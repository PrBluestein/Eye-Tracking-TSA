// SAE303 - Filters Management
// Gestion des filtres interactifs

// Initialize filter event listeners
function initFilters() {
    // Filter buttons (face and zone)
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filterType = this.getAttribute('data-filter');
            const value = this.getAttribute('data-value');

            // Update active state
            const siblings = this.parentElement.querySelectorAll('.filter-btn');
            siblings.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update filter
            if (filterType === 'face') {
                updateFilter('face', parseInt(value));
                updateFaceCardSelection(parseInt(value));
            } else if (filterType === 'zone') {
                updateFilter('zone', value);
            }
        });
    });

    // Parameter select
    const parameterSelect = document.getElementById('parameterSelect');
    if (parameterSelect) {
        parameterSelect.addEventListener('change', function () {
            updateFilter('parameter', this.value);
        });
    }

    // Face card selection
    const faceCards = document.querySelectorAll('.face-card');
    faceCards.forEach(card => {
        card.addEventListener('click', function () {
            const faceNumber = parseInt(this.getAttribute('data-face'));

            // Update active state
            faceCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            // Update corresponding filter button
            const faceButtons = document.querySelectorAll('[data-filter="face"]');
            faceButtons.forEach(btn => {
                if (parseInt(btn.getAttribute('data-value')) === faceNumber) {
                    btn.click();
                }
            });
        });
    });
}

// Update face card visual selection
function updateFaceCardSelection(faceNumber) {
    const faceCards = document.querySelectorAll('.face-card');
    faceCards.forEach(card => {
        if (parseInt(card.getAttribute('data-face')) === faceNumber) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilters);
} else {
    initFilters();
}
