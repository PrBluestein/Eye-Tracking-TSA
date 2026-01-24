import zipfile
import xml.etree.ElementTree as ET
import json
import re

def parse_excel_to_json(file_path):
    print(f"// Generated from {file_path}")
    
    data = {}
    
    try:
        with zipfile.ZipFile(file_path, 'r') as z:
            # 1. Parse Shared Strings
            shared_strings = []
            try:
                with z.open('xl/sharedStrings.xml') as f:
                    tree = ET.parse(f)
                    root = tree.getroot()
                    ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                    for si in root.findall('ns:si', ns):
                        t_texts = [t.text for t in si.findall('.//ns:t', ns) if t.text]
                        shared_strings.append("".join(t_texts))
            except Exception as e:
                pass

            # 2. Iterate through sheets
            sheets = [n for n in z.namelist() if n.startswith('xl/worksheets/sheet')]
            sheets.sort()
            
            for sheet_name in sheets:
                rows = []
                with z.open(sheet_name) as f:
                    tree = ET.parse(f)
                    root = tree.getroot()
                    ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                    sheetData = root.find('ns:sheetData', ns)
                    if sheetData is None: continue
                    
                    for row in sheetData.findall('ns:row', ns):
                        row_data = []
                        for c in row.findall('ns:c', ns):
                            cell_value = ""
                            t_attr = c.get('t')
                            v = c.find('ns:v', ns)
                            if v is not None:
                                val = v.text
                                if t_attr == 's':
                                    try: cell_value = shared_strings[int(val)]
                                    except: cell_value = ""
                                else: cell_value = val
                            row_data.append(cell_value)
                        rows.append(row_data)

                # Find VISAGE block
                face_num = 0
                start_row = -1
                for i, row in enumerate(rows):
                    row_str = " ".join([str(c) for c in row])
                    if "VISAGE" in row_str.upper():
                        # Extract face number
                        match = re.search(r'VISAGE\s*(\d+)', row_str.upper())
                        if match:
                            face_num = int(match.group(1))
                            start_row = i
                            break
                
                if face_num == 0: continue
                
                face_key = f"visage{face_num}"
                data[face_key] = {}
                
                # Helper to find parameter block
                def get_param_block(param_name, rows, start):
                    for i in range(start, len(rows)):
                        if len(rows[i]) > 0 and param_name.upper() in str(rows[i][0]).upper():
                            return i
                    return -1

                # Zones mapping
                zones_map = {'Ecran': 'ecran', 'Tête': 'tete', 'Yeux': 'yeux', 'Bouche': 'bouche'}
                
                # Parameters to extract
                # We need to map Excel row headers to our keys: tf, nbf, tp, nbe, latence, ttt
                # TTT is separate
                
                # Extract TTT (Temps Total Tracké)
                ttt_row_idx = get_param_block("Temps Total Tracké", rows, start_row)
                if ttt_row_idx != -1:
                    # TTT is usually 2 rows below header, Col 1 (DT), Col 2 (TSA), Col 5 (p-value)
                    # Row structure in Excel dump:
                    # Row+2: ['', '3.98', '3.95', '0.15', '0.24', '0.31'] -> Idx 1=DT, 2=TSA, 5=pValue
                    r = rows[ttt_row_idx + 2]
                    if len(r) > 5:
                        dt = float(r[1]) if r[1] else 0
                        tsa = float(r[2]) if r[2] else 0
                        pval = r[5]
                        try: pval = float(pval)
                        except: pval = 0.05 # Fallback if '~ 0.05'
                        
                        # Store TTT in 'ecran' or separate? Let's put it in 'ecran' as 'ttt'
                        if 'ecran' not in data[face_key]: data[face_key]['ecran'] = {}
                        data[face_key]['ecran']['ttt'] = {'dt': dt, 'tsa': tsa, 'pValue': pval, 'unit': 's'}

                # Extract other params
                # Format: Header -> Rows for Ecran, Tete, Yeux, Bouche
                # Params: TP, TF, NBF, NBE, Latence
                
                param_defs = [
                    ('Temps Passé', 'tp', '%'),
                    ('Temps de fixation', 'tf', '%'),
                    ('Nombre de fixations', 'nbf', 'fixations'),
                    ("Nombre d'entrées", 'nbe', 'entrées'),
                    ('Latence', 'latence', 's')
                ]

                for p_label, p_key, unit in param_defs:
                    p_idx = get_param_block(p_label, rows, start_row)
                    if p_idx != -1:
                        # Iterate next few rows to find zones
                        for r_offset in range(2, 8): # Check next 6 rows
                            if p_idx + r_offset >= len(rows): break
                            row = rows[p_idx + r_offset]
                            if len(row) < 1: continue
                            
                            zone_label = str(row[0]).strip()
                            zone_clean = zone_label.replace(' ', '')
                            
                            target_zone = None
                            for k, v in zones_map.items():
                                if k in zone_label:
                                    target_zone = v
                                    break
                            
                            if target_zone:
                                # Values usually in Col 1 (DT), Col 2 (TSA), Col 5 (p-value) for this layout
                                # Wait, Latence might be different columns?
                                # Latence Row 37: ['Tête', '0.27', '0.36', '0.39', '0.6', '0.25'] -> 1=DT, 2=TSA, 5=p
                                # Looks consistent.
                                
                                if len(row) > 5:
                                    try:
                                        dt = float(row[1])
                                        tsa = float(row[2])
                                        pval_str = str(row[5]).replace(',', '.').replace('~', '')
                                        pval = float(pval_str)
                                    except:
                                        continue # Skip bad data
                                        
                                    if target_zone not in data[face_key]: data[face_key][target_zone] = {}
                                    
                                    data[face_key][target_zone][p_key] = {
                                        'dt': dt, 'tsa': tsa, 'pValue': pval, 'unit': unit
                                    }

        # Print JavaScript object
        print("const eyeTrackingData = ", end="")
        print(json.dumps(data, indent=2), end=";\n")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    parse_excel_to_json("Data_SAE3031_VF_OK.xlsx")
