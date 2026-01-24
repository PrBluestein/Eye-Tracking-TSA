import zipfile
import sys

# Extract Excel data without external dependencies
xlsx_file = "Data_SAE3031_VF_OK.xlsx"

with zipfile.ZipFile(xlsx_file, 'r') as zip_ref:
    # List all files in the Excel archive
    print("Files in Excel archive:")
    for name in zip_ref.namelist():
        print(f"  {name}")
    
    # Try to read shared strings
    try:
        with zip_ref.open('xl/sharedStrings.xml') as f:
            content = f.read().decode('utf-8')
            print("\n=== Shared Strings (first 2000 chars) ===")
            print(content[:2000])
    except:
        print("No shared strings found")
    
    # Try to read first worksheet
    try:
        with zip_ref.open('xl/worksheets/sheet1.xml') as f:
            content = f.read().decode('utf-8')
            print("\n=== Sheet 1 (first 3000 chars) ===")
            print(content[:3000])
    except Exception as e:
        print(f"Error reading sheet1: {e}")
