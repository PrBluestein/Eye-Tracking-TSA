

(function () {
    'use strict';

    
    document.addEventListener('DOMContentLoaded', function () {
        initializeFaceInteractions();
    });

    function initializeFaceInteractions() {
        
        const faceCards = document.querySelectorAll('.face-card');

        faceCards.forEach(card => {
            const faceNumber = card.getAttribute('data-face');
            const img = card.querySelector('img');

            if (img && img.src.includes('.svg')) {
                
                loadSVGInline(img, faceNumber);
            }
        });
    }

    function loadSVGInline(imgElement, faceNumber) {
        const svgPath = imgElement.src;

        fetch(svgPath)
            .then(response => response.text())
            .then(svgContent => {
                
                const container = document.createElement('div');
                container.innerHTML = svgContent;
                const svg = container.querySelector('svg');

                if (svg) {
                    
                    svg.classList.add('face-svg-interactive');

                    
                    imgElement.parentNode.replaceChild(svg, imgElement);

                    
                    setupZoneInteractions(svg, faceNumber);
                }
            })
            .catch(error => {
                console.error('Erreur lors du chargement du SVG:', error);
            });
    }

    function setupZoneInteractions(svg, faceNumber) {
        const zones = svg.querySelectorAll('.face-zone');

        zones.forEach(zone => {
            const zoneName = zone.getAttribute('data-zone');

            
            zone.addEventListener('mouseenter', function () {
                this.classList.add('hovered');
                highlightZone(zoneName);
            });

            zone.addEventListener('mouseleave', function () {
                this.classList.remove('hovered');
                unhighlightZone(zoneName);
            });

            
            zone.addEventListener('click', function (e) {
                e.stopPropagation();
                handleZoneClick(faceNumber, zoneName);
            });
        });

        
        svg.addEventListener('click', function () {
            handleZoneClick(faceNumber, 'ecran');
        });
    }

    function handleZoneClick(faceNumber, zoneName) {
        console.log(`Zone cliquée: Visage ${faceNumber}, Zone ${zoneName}`);

        
        const faceButtons = document.querySelectorAll('[data-filter="face"]');
        faceButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-value') === faceNumber) {
                btn.classList.add('active');
            }
        });

        
        const zoneButtons = document.querySelectorAll('[data-filter="zone"]');
        zoneButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-value') === zoneName) {
                btn.classList.add('active');
            }
        });

        
        const faceCards = document.querySelectorAll('.face-card');
        faceCards.forEach(card => {
            card.classList.remove('active');
            if (card.getAttribute('data-face') === faceNumber) {
                card.classList.add('active');
            }
        });

        
        if (typeof updateCharts === 'function') {
            updateCharts();
        }

        
        updateActiveZones(faceNumber, zoneName);
    }

    function updateActiveZones(activeFace, activeZone) {
        
        document.querySelectorAll('.face-zone').forEach(zone => {
            zone.classList.remove('active');
        });

        
        const activeSvg = document.querySelector(`svg[data-face="${activeFace}"]`);
        if (activeSvg) {
            const zone = activeSvg.querySelector(`[data-zone="${activeZone}"]`);
            if (zone) {
                zone.classList.add('active');
            }
        }
    }

    function highlightZone(zoneName) {
        
        const zoneButton = document.querySelector(`[data-filter="zone"][data-value="${zoneName}"]`);
        if (zoneButton) {
            zoneButton.style.transform = 'scale(1.05)';
        }
    }

    function unhighlightZone(zoneName) {
        const zoneButton = document.querySelector(`[data-filter="zone"][data-value="${zoneName}"]`);
        if (zoneButton) {
            zoneButton.style.transform = '';
        }
    }

    
    window.faceInteractions = {
        updateActiveZones: updateActiveZones
    };
})();
