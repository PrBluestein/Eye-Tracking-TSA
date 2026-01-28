/**
 * Face Interactions - Gestion de l'interactivité des visages SVG
 * Synchronise les clics sur les zones SVG avec le système de filtres
 */

(function () {
    'use strict';

    // Attendre que le DOM soit chargé
    document.addEventListener('DOMContentLoaded', function () {
        initializeFaceInteractions();
    });

    function initializeFaceInteractions() {
        // Sélectionner tous les SVG de visages
        const faceCards = document.querySelectorAll('.face-card');

        faceCards.forEach(card => {
            const faceNumber = card.getAttribute('data-face');
            const img = card.querySelector('img');

            if (img && img.src.includes('.svg')) {
                // Pour les SVG chargés via <img>, on doit les remplacer par <object> ou inline
                loadSVGInline(img, faceNumber);
            }
        });
    }

    function loadSVGInline(imgElement, faceNumber) {
        const svgPath = imgElement.src;

        fetch(svgPath)
            .then(response => response.text())
            .then(svgContent => {
                // Créer un conteneur pour le SVG
                const container = document.createElement('div');
                container.innerHTML = svgContent;
                const svg = container.querySelector('svg');

                if (svg) {
                    // Copier les classes de l'image originale
                    svg.classList.add('face-svg-interactive');

                    // Remplacer l'image par le SVG
                    imgElement.parentNode.replaceChild(svg, imgElement);

                    // Ajouter les événements d'interaction
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

            // Événement de survol
            zone.addEventListener('mouseenter', function () {
                this.classList.add('hovered');
                highlightZone(zoneName);
            });

            zone.addEventListener('mouseleave', function () {
                this.classList.remove('hovered');
                unhighlightZone(zoneName);
            });

            // Événement de clic
            zone.addEventListener('click', function (e) {
                e.stopPropagation();
                handleZoneClick(faceNumber, zoneName);
            });
        });

        // Clic sur le visage entier (écran)
        svg.addEventListener('click', function () {
            handleZoneClick(faceNumber, 'ecran');
        });
    }

    function handleZoneClick(faceNumber, zoneName) {
        console.log(`Zone cliquée: Visage ${faceNumber}, Zone ${zoneName}`);

        // Mettre à jour le filtre de visage
        const faceButtons = document.querySelectorAll('[data-filter="face"]');
        faceButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-value') === faceNumber) {
                btn.classList.add('active');
            }
        });

        // Mettre à jour le filtre de zone
        const zoneButtons = document.querySelectorAll('[data-filter="zone"]');
        zoneButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-value') === zoneName) {
                btn.classList.add('active');
            }
        });

        // Mettre à jour les cartes de visages
        const faceCards = document.querySelectorAll('.face-card');
        faceCards.forEach(card => {
            card.classList.remove('active');
            if (card.getAttribute('data-face') === faceNumber) {
                card.classList.add('active');
            }
        });

        // Déclencher la mise à jour des graphiques
        if (typeof updateCharts === 'function') {
            updateCharts();
        }

        // Mettre à jour les zones actives visuellement
        updateActiveZones(faceNumber, zoneName);
    }

    function updateActiveZones(activeFace, activeZone) {
        // Retirer toutes les classes actives
        document.querySelectorAll('.face-zone').forEach(zone => {
            zone.classList.remove('active');
        });

        // Ajouter la classe active à la zone sélectionnée
        const activeSvg = document.querySelector(`svg[data-face="${activeFace}"]`);
        if (activeSvg) {
            const zone = activeSvg.querySelector(`[data-zone="${activeZone}"]`);
            if (zone) {
                zone.classList.add('active');
            }
        }
    }

    function highlightZone(zoneName) {
        // Optionnel: mettre en évidence le bouton de filtre correspondant
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

    // Exposer certaines fonctions globalement si nécessaire
    window.faceInteractions = {
        updateActiveZones: updateActiveZones
    };
})();
