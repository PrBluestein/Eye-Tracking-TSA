// Fun & Clear Data Visualizations
// Playful representations that make data easy to understand

class FunDataViz {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createVisualizations());
        } else {
            this.createVisualizations();
        }
    }

    createVisualizations() {
        const containers = document.querySelectorAll('[data-viz-type]');

        containers.forEach(container => {
            const vizType = container.dataset.vizType;

            switch (vizType) {

                case 'attention-bars':
                    this.createAttentionBars(container);
                    break;
                case 'emoji-scale':
                    this.createEmojiScale(container);
                    break;
                case 'filling-silhouettes':
                    this.createFillingSilhouettes(container);
                    break;
            }
        });
    }

    // New Visualisation: Filling Silhouettes (DT vs TSA Boys)
    createFillingSilhouettes(container) {
        // Use current filters from global state if available, else default
        const face = (typeof currentFilters !== 'undefined') ? currentFilters.face : 1;
        const zone = (typeof currentFilters !== 'undefined') ? currentFilters.zone : 'ecran';
        const parameter = (typeof currentFilters !== 'undefined') ? currentFilters.parameter : 'tf';

        const data = getData(face, zone, parameter);
        if (!data) return;

        // Calculate filling percentages
        let dtValue = data.dt;
        let tsaValue = data.tsa;
        let unit = data.unit;

        let dtPercent, tsaPercent;
        if (unit === '%') {
            dtPercent = dtValue * 100;
            tsaPercent = tsaValue * 100;
        } else {
            // Units like 's' or 'fixations', we find the max of the two and scale to 100
            const max = Math.max(dtValue, tsaValue, 1);
            dtPercent = (dtValue / max) * 100;
            tsaPercent = (tsaValue / max) * 100;
        }

        container.innerHTML = '';
        container.classList.add('chart-container');
        container.style.cssText += `
            padding: 40px;
            /* No background to avoid rectangle look, but maybe a subtle one or none as requested */
            background: transparent; 
            border-radius: 25px;
            text-align: center;
        `;

        const title = document.createElement('h3');
        title.className = 'chart-title';
        title.innerHTML = `Engagement Comparé - ${parameters[parameter].label}`;
        // Ensure title is readable on whatever background acts as behind this
        container.appendChild(title);

        const silhouettesWrapper = document.createElement('div');
        silhouettesWrapper.style.cssText = `
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            gap: 20px;
            margin-top: 20px;
            flex-wrap: wrap;
        `;

        // Childish Silhouette SVG Path
        // Refined with visible arms
        // Head, Shoulders, Arms extended slightly, Body, Legs
        const childPath = "M50,10 C68,10 80,22 80,40 C80,52 72,62 60,65 L60,68 C75,70 95,75 95,95 C95,105 85,105 80,100 L75,95 L75,135 C75,135 75,145 75,145 L70,185 C70,195 60,195 55,185 L55,145 L45,145 L45,185 C40,195 30,195 30,185 L25,145 C25,145 25,135 25,135 L25,95 L20,100 C15,105 5,105 5,95 C5,75 25,70 40,68 L40,65 C28,62 20,52 20,40 C20,22 32,10 50,10 Z";

        // Create DT Silhouette
        silhouettesWrapper.appendChild(this.createSilhouette('DT', dtPercent, dtValue, unit, '#009DC1', childPath));

        // Create TSA Silhouette
        silhouettesWrapper.appendChild(this.createSilhouette('TSA', tsaPercent, tsaValue, unit, '#FF5852', childPath));

        container.appendChild(silhouettesWrapper);

        // Subtitle (significance)
        if (isSignificant(data.pValue)) {
            const subtitle = document.createElement('p');
            subtitle.style.cssText = 'color: var(--distinctive-red); font-weight: 700; margin-top: 20px;';
            subtitle.textContent = 'Différence significative entre les deux groupes !';
            container.appendChild(subtitle);
        }

        // Added Description with Conclusion
        const description = document.createElement('p');
        description.style.cssText = 'color: #666; margin-top: 25px; font-size: 0.95rem; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.5; font-style: italic;';

        // Explain logic
        let explanation = "Le remplissage des silhouettes illustre l'intensité du regard.";

        // Draw conclusion
        let conclusion = "";
        if (dtValue > tsaValue) {
            conclusion = `On constate ici que <strong>les enfants au développement typique (DT)</strong> accordent plus d'attention à cette zone que les enfants avec TSA.`;
        } else if (tsaValue > dtValue) {
            conclusion = `On constate ici que <strong>les enfants avec TSA</strong> accordent plus d'attention à cette zone que les enfants au développement typique (DT).`;
        } else {
            conclusion = `On constate ici un niveau d'attention similaire entre les deux groupes.`;
        }

        description.innerHTML = `${explanation}<br>${conclusion}`;
        container.appendChild(description);
    }

    createSilhouette(label, percent, rawValue, unit, color, pathData) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'flex: 1; min-width: 150px; display: flex; flex-direction: column; align-items: center;';

        const svgNamespace = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNamespace, "svg");
        svg.setAttribute("viewBox", "0 0 100 200"); // Adjusted ViewBox for the new path
        svg.setAttribute("width", "120");
        svg.setAttribute("height", "240");
        svg.style.overflow = "visible";

        // Define ClipPath (The growing rectangle)
        const defs = document.createElementNS(svgNamespace, "defs");
        const clipPathId = `fill-clip-${label}-${Math.random().toString(36).substr(2, 9)}`;
        const clipPath = document.createElementNS(svgNamespace, "clipPath");
        clipPath.setAttribute("id", clipPathId);

        const clipRect = document.createElementNS(svgNamespace, "rect");
        clipRect.setAttribute("x", "0");
        clipRect.setAttribute("width", "100");

        // Start state: Empty (fill is at bottom, height 0 or y at bottom)
        // We want to fill upwards.
        // Screen coords: y=200 is bottom. y=0 is top.
        // Rect y starts at 200, height 0.
        // Target: y = 200 - (height), height = percent * 2.

        const maxHeight = 200;
        const targetHeight = (percent / 100) * maxHeight;
        const targetY = maxHeight - targetHeight;

        clipRect.setAttribute("y", "200");
        clipRect.setAttribute("height", "0");

        // Animation
        const animateY = document.createElementNS(svgNamespace, "animate");
        animateY.setAttribute("attributeName", "y");
        animateY.setAttribute("from", "200");
        animateY.setAttribute("to", targetY);
        animateY.setAttribute("dur", "1.5s");
        animateY.setAttribute("fill", "freeze");
        animateY.setAttribute("calcMode", "spline");
        animateY.setAttribute("keySplines", "0.4 0 0.2 1"); // Ease-out
        clipRect.appendChild(animateY);

        const animateH = document.createElementNS(svgNamespace, "animate");
        animateH.setAttribute("attributeName", "height");
        animateH.setAttribute("from", "0");
        animateH.setAttribute("to", targetHeight);
        animateH.setAttribute("dur", "1.5s");
        animateH.setAttribute("fill", "freeze");
        animateH.setAttribute("calcMode", "spline");
        animateH.setAttribute("keySplines", "0.4 0 0.2 1"); // Ease-out
        clipRect.appendChild(animateH);

        clipPath.appendChild(clipRect);
        defs.appendChild(clipPath);
        svg.appendChild(defs);

        // 1. Background Outline / Ghost (Empty state)
        const bgBody = document.createElementNS(svgNamespace, "path");
        bgBody.setAttribute("d", pathData);
        bgBody.setAttribute("fill", "#e0e0e0"); // Light gray fill for empty part
        // bgBody.setAttribute("stroke", "#ccc");
        // bgBody.setAttribute("stroke-width", "2");
        svg.appendChild(bgBody);

        // 2. Filled Body (Clipped by the rect)
        const filledBody = document.createElementNS(svgNamespace, "path");
        filledBody.setAttribute("d", pathData);
        filledBody.setAttribute("fill", color);
        filledBody.setAttribute("clip-path", `url(#${clipPathId})`); // Apply clip
        svg.appendChild(filledBody);

        // 3. Outline (Optional, to define the shape clearly)
        // const outline = document.createElementNS(svgNamespace, "path");
        // outline.setAttribute("d", pathData);
        // outline.setAttribute("fill", "none");
        // outline.setAttribute("stroke", color);
        // outline.setAttribute("stroke-width", "2");
        // svg.appendChild(outline);

        wrapper.appendChild(svg);

        // Label and Value
        const labelDiv = document.createElement('div');
        labelDiv.style.cssText = `margin-top: 15px; font-weight: 800; font-size: 1.4rem; color: ${color};`;
        labelDiv.textContent = label;
        wrapper.appendChild(labelDiv);

        const valueDiv = document.createElement('div');
        valueDiv.style.cssText = 'font-weight: 600; color: var(--text-secondary);';
        let displayValue = rawValue;
        if (unit === '%') displayValue = (rawValue * 100).toFixed(1);
        valueDiv.textContent = `${displayValue}${unit}`;
        wrapper.appendChild(valueDiv);

        return wrapper;
    }



    // Visualisation 2: Barres d'attention (Attention Bars)
    createAttentionBars(container) {
        const face = parseInt(container.dataset.face) || 1;

        container.innerHTML = '';
        container.style.cssText = `
            padding: 40px;
            background: white;
            border-radius: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        `;

        const title = document.createElement('h3');
        title.innerHTML = `Temps d'Attention par Zone - Visage ${face}`;
        title.style.cssText = 'text-align: center; margin-bottom: 40px; color: var(--marine-blue);';
        container.appendChild(title);

        const zones = ['ecran', 'tete', 'yeux', 'bouche'];
        const zoneIcons = {
            ecran: 'assets/icons/ecran.webp',
            tete: 'assets/icons/tete.webp',
            yeux: 'assets/icons/oeil.svg',
            bouche: 'assets/icons/bouche.svg'
        };
        const zoneLabels = { ecran: 'Écran', tete: 'Tête', yeux: 'Yeux', bouche: 'Bouche' };

        zones.forEach((zone, index) => {
            const data = getData(face, zone, 'tp');
            if (!data) return;

            const zoneDiv = document.createElement('div');
            zoneDiv.style.cssText = 'margin-bottom: 30px;';

            // Zone label
            const label = document.createElement('div');
            label.innerHTML = `<img src="${zoneIcons[zone]}" class="pictogram pictogram-sm me-2"> <strong>${zoneLabels[zone]}</strong>`;
            label.style.cssText = 'font-size: 1.2rem; margin-bottom: 10px; color: var(--marine-blue);';
            zoneDiv.appendChild(label);

            // Bars container
            const barsContainer = document.createElement('div');
            barsContainer.style.cssText = 'display: flex; gap: 10px; align-items: center;';

            // DT Bar
            const dtBar = this.createBar('DT', data.dt, '#009DC1', index * 0.2);
            barsContainer.appendChild(dtBar);

            // TSA Bar
            const tsaBar = this.createBar('TSA', data.tsa, '#FF5852', index * 0.2 + 0.1);
            barsContainer.appendChild(tsaBar);

            zoneDiv.appendChild(barsContainer);

            // Significance
            if (isSignificant(data.pValue)) {
                const sig = document.createElement('div');
                sig.innerHTML = 'Différence significative!';
                sig.style.cssText = 'color: #FF5852; font-weight: 700; margin-top: 5px; font-size: 0.9rem;';
                zoneDiv.appendChild(sig);
            }

            container.appendChild(zoneDiv);
        });
    }

    createBar(label, value, color, delay) {
        const barWrapper = document.createElement('div');
        barWrapper.style.cssText = 'flex: 1;';

        const barLabel = document.createElement('div');
        barLabel.textContent = label;
        barLabel.style.cssText = `font-size: 0.9rem; font-weight: 700; color: ${color}; margin-bottom: 5px;`;
        barWrapper.appendChild(barLabel);

        const barBg = document.createElement('div');
        barBg.style.cssText = `
            width: 100%;
            height: 40px;
            background: ${color}20;
            border-radius: 20px;
            position: relative;
            overflow: hidden;
        `;

        const barFill = document.createElement('div');
        const percentage = Math.min(value * 100, 100);
        barFill.style.cssText = `
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, ${color} 0%, ${color}CC 100%);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 10px;
            color: white;
            font-weight: 700;
            animation: fillBar${Date.now()}${Math.random()} 1.5s ease-out ${delay}s forwards;
            box-shadow: 0 2px 10px ${color}60;
        `;
        barFill.textContent = `${value}%`;

        const style = document.createElement('style');
        const animName = `fillBar${Date.now()}${Math.random()}`;
        style.textContent = `
            @keyframes ${animName} {
                to { width: ${percentage}%; }
            }
        `;
        document.head.appendChild(style);

        barBg.appendChild(barFill);
        barWrapper.appendChild(barBg);

        return barWrapper;
    }

    // Visualisation 3: Échelle d'Emojis (Emoji Scale)
    createEmojiScale(container) {
        const face = parseInt(container.dataset.face) || 1;
        const zone = container.dataset.zone || 'yeux';

        const data = getData(face, zone, 'latence');
        if (!data) return;

        container.innerHTML = '';
        container.style.cssText = `
            padding: 40px;
            background: linear-gradient(135deg, #FFE8E7 0%, #FFD6D5 100%);
            border-radius: 25px;
        `;

        const title = document.createElement('h3');
        title.innerHTML = `Rapidité de Réaction - ${zone === 'yeux' ? 'Yeux' : zone.charAt(0).toUpperCase() + zone.slice(1)}`;
        title.style.cssText = 'text-align: center; margin-bottom: 40px; color: var(--marine-blue);';
        container.appendChild(title);

        const scaleContainer = document.createElement('div');
        scaleContainer.style.cssText = `
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            gap: 40px;
            flex-wrap: wrap;
        `;

        // DT Scale
        scaleContainer.appendChild(this.createSpeedometer('DT', data.dt, '#009DC1'));

        // VS
        const vs = document.createElement('div');
        vs.innerHTML = 'VS';
        vs.style.cssText = `
            font-size: 2.5rem;
            font-weight: 900;
            color: var(--marine-blue);
            text-align: center;
            align-self: center;
        `;
        scaleContainer.appendChild(vs);

        // TSA Scale
        scaleContainer.appendChild(this.createSpeedometer('TSA', data.tsa, '#FF5852'));

        container.appendChild(scaleContainer);

        // Explanation
        const explanation = document.createElement('div');
        explanation.style.cssText = 'text-align: center; margin-top: 30px; font-size: 1.1rem; color: #666;';
        explanation.innerHTML = `
            <strong>Plus c'est rapide, mieux c'est!</strong><br>
            ${data.dt < data.tsa ? 'DT réagit plus vite!' : 'TSA réagit plus vite!'}
        `;
        container.appendChild(explanation);
    }

    createSpeedometer(label, value, color) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'text-align: center; flex: 1; min-width: 200px;';

        // Speed emoji based on value (lower is faster)
        const speedEmoji = '';

        const gauge = document.createElement('div');
        gauge.style.cssText = `
            width: 150px;
            height: 150px;
            margin: 0 auto 20px;
            border-radius: 50%;
            background: conic-gradient(
                ${color} 0deg,
                ${color}80 ${Math.min(360 - (value / 4) * 360, 360)}deg,
                #e0e0e0 ${Math.min(360 - (value / 4) * 360, 360)}deg
            );
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            animation: rotateGauge 2s ease-out;
            box-shadow: 0 10px 30px ${color}40;
        `;

        const innerCircle = document.createElement('div');
        innerCircle.style.cssText = `
            width: 120px;
            height: 120px;
            background: white;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `;

        innerCircle.innerHTML = `
            <div style="font-size: 3rem;">${speedEmoji}</div>
            <div style="font-size: 1.5rem; font-weight: 900; color: ${color};">${value}s</div>
        `;

        gauge.appendChild(innerCircle);
        wrapper.appendChild(gauge);

        const labelEl = document.createElement('div');
        labelEl.textContent = label;
        labelEl.style.cssText = `
            font-size: 1.5rem;
            font-weight: 900;
            color: ${color};
        `;
        wrapper.appendChild(labelEl);

        return wrapper;
    }

    // Static update method for external calls
    static updateAll() {
        if (window.funDataVizInstance) {
            window.funDataVizInstance.createVisualizations();
        }
    }
}

// Add global animation
if (!document.getElementById('fun-viz-styles')) {
    const globalStyle = document.createElement('style');
    globalStyle.id = 'fun-viz-styles';
    globalStyle.textContent = `
        @keyframes rotateGauge {
            from { transform: rotate(-180deg); }
            to { transform: rotate(0deg); }
        }
    `;
    document.head.appendChild(globalStyle);
}

// Initialize and store globally for updates
window.funDataVizInstance = new FunDataViz();
