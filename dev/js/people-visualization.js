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
                case 'race-track':
                    this.createRaceTrack(container);
                    break;
                case 'attention-bars':
                    this.createAttentionBars(container);
                    break;
                case 'emoji-scale':
                    this.createEmojiScale(container);
                    break;
            }
        });
    }

    // Visualisation 1: Course de regards (Race Track)
    createRaceTrack(container) {
        const face = parseInt(container.dataset.face) || 1;
        const zone = container.dataset.zone || 'yeux';

        const data = getData(face, zone, 'nbf');
        if (!data) return;

        container.innerHTML = '';
        container.style.cssText = `
            padding: 40px;
            background: linear-gradient(135deg, #E6F7FB 0%, #B3E5F5 100%);
            border-radius: 25px;
            position: relative;
            overflow: hidden;
            margin-bottom: 120px;
        `;

        // Title
        const title = document.createElement('h3');
        title.innerHTML = `Course des Regards sur ${zone === 'yeux' ? 'les Yeux' : 'la ' + zone.charAt(0).toUpperCase() + zone.slice(1)}`;
        title.style.cssText = 'text-align: center; margin-bottom: 40px; color: var(--marine-blue);';
        container.appendChild(title);

        // Track container
        const track = document.createElement('div');
        track.style.cssText = `
            position: relative;
            height: 200px;
            background: white;
            border-radius: 20px;
            padding: 20px;
            box-shadow: inset 0 4px 10px rgba(0,0,0,0.1);
        `;

        // DT Runner
        const dtRunner = this.createRunner('DT', data.dt, '#009DC1', 0);
        track.appendChild(dtRunner);

        // TSA Runner
        const tsaRunner = this.createRunner('TSA', data.tsa, '#FF5852', 1);
        track.appendChild(tsaRunner);

        // Finish line
        const finishLine = document.createElement('div');
        finishLine.innerHTML = 'ARRIVÉE';
        finishLine.style.cssText = `
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.2rem;
            font-weight: 900;
            color: var(--marine-blue);
            opacity: 0.3;
        `;
        track.appendChild(finishLine);

        container.appendChild(track);

        // Legend
        const legend = document.createElement('div');
        legend.style.cssText = 'text-align: center; margin-top: 20px; font-size: 1.1rem;';
        legend.innerHTML = `
            <strong>DT:</strong> ${data.dt} fixations | 
            <strong>TSA:</strong> ${data.tsa} fixations
            ${isSignificant(data.pValue) ? ' | <strong>Différence significative!</strong>' : ''}
        `;
        container.appendChild(legend);
    }

    createRunner(label, value, color, lane) {
        const runner = document.createElement('div');
        const maxValue = 3; // Adjust based on your data range
        const distance = Math.min((value / maxValue) * 80, 90); // Max 90% of track

        runner.style.cssText = `
            position: absolute;
            top: ${30 + lane * 90}px;
            left: 20px;
            width: 60px;
            height: 60px;
            background: ${color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            color: white;
            font-size: 1.2rem;
            box-shadow: 0 4px 15px ${color}80;
            animation: runAnimation${lane} 2s ease-out forwards;
            z-index: 10;
        `;

        runner.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 1.2rem; font-weight: 900;">${label}</div>
            </div>
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes runAnimation${lane} {
                0% {
                    left: 20px;
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
                100% {
                    left: ${distance}%;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);

        return runner;
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
        title.innerHTML = `📊 Temps d'Attention par Zone - Visage ${face}`;
        title.style.cssText = 'text-align: center; margin-bottom: 40px; color: var(--marine-blue);';
        container.appendChild(title);

        const zones = ['tete', 'yeux', 'bouche'];
        const zoneEmojis = { tete: '👤', yeux: '👁️', bouche: '👄' };
        const zoneLabels = { tete: 'Tête', yeux: 'Yeux', bouche: 'Bouche' };

        zones.forEach((zone, index) => {
            const data = getData(face, zone, 'tp');
            if (!data) return;

            const zoneDiv = document.createElement('div');
            zoneDiv.style.cssText = 'margin-bottom: 30px;';

            // Zone label
            const label = document.createElement('div');
            label.innerHTML = `${zoneEmojis[zone]} <strong>${zoneLabels[zone]}</strong>`;
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
                sig.innerHTML = '⭐ Différence significative!';
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
        title.innerHTML = `⏱️ Rapidité de Réaction - ${zone === 'yeux' ? 'Yeux' : zone.charAt(0).toUpperCase() + zone.slice(1)}`;
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
        vs.innerHTML = '⚡<br>VS';
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
            ${data.dt < data.tsa ? '🏆 DT réagit plus vite!' : '🏆 TSA réagit plus vite!'}
        `;
        container.appendChild(explanation);
    }

    createSpeedometer(label, value, color) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'text-align: center; flex: 1; min-width: 200px;';

        // Speed emoji based on value (lower is faster)
        const speedEmoji = value < 1 ? '🚀' : value < 2 ? '🏃' : '🐌';

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
}

// Add global animation
const globalStyle = document.createElement('style');
globalStyle.textContent = `
    @keyframes rotateGauge {
        from { transform: rotate(-180deg); }
        to { transform: rotate(0deg); }
    }
`;
document.head.appendChild(globalStyle);

// Initialize
new FunDataViz();
