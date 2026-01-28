// SAE303 - Chart.js Implementation
// Gestion des graphiques interactifs

// Global chart instances
let barChart, lineChart, pieChart, combinedChart;

// Current filter state
let currentFilters = {
    face: 1,
    zone: 'ecran',
    parameter: 'tf'
};

// Chart.js default configuration
Chart.defaults.font.family = 'Inter, sans-serif';
Chart.defaults.color = '#495057';

// Initialize all charts
function initCharts() {
    createBarChart();
    createLineChart();
    createPieChart();
    createCombinedChart();
}

// Chart 1: Bar Chart - DT vs TSA Comparison
function createBarChart() {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;

    const data = getData(currentFilters.face, currentFilters.zone, currentFilters.parameter);
    if (!data) return;

    const isSignif = isSignificant(data.pValue);

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['DT (Développement Typique)', 'TSA (Troubles du Spectre de l\'Autisme)'],
            datasets: [{
                label: parameters[currentFilters.parameter].label,
                data: [data.dt, data.tsa],
                backgroundColor: [
                    groupColors.dt,
                    groupColors.tsa
                ],
                borderColor: [groupColors.dt, groupColors.tsa],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: `${parameters[currentFilters.parameter].label} - ${zones[currentFilters.zone].label}`,
                    font: { size: 14, weight: '600' }
                },
                subtitle: {
                    display: isSignif,
                    text: `Différence significative (p = ${data.pValue.toFixed(3)})`,
                    color: '#F4D35E',
                    font: { size: 12, weight: '600' },
                    padding: { bottom: 10 }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.parsed.y} ${data.unit}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: `${parameters[currentFilters.parameter].label} (${data.unit})`
                    }
                }
            }
        }
    });
}

// Chart 2: Line Chart - Evolution across faces
function createLineChart() {
    const ctx = document.getElementById('lineChart');
    if (!ctx) return;

    const allData = getAllFacesData(currentFilters.zone, currentFilters.parameter);

    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: allData.labels,
            datasets: [
                {
                    label: 'DT',
                    data: allData.dt,
                    borderColor: groupColors.dt,
                    backgroundColor: groupColors.dt + '20', // Alpha 0.125
                    borderWidth: 3,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'TSA',
                    data: allData.tsa,
                    borderColor: groupColors.tsa,
                    backgroundColor: groupColors.tsa + '10', // Alpha 0.06
                    borderWidth: 3,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: `${parameters[currentFilters.parameter].label} - ${zones[currentFilters.zone].label}`,
                    font: { size: 14, weight: '600' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: parameters[currentFilters.parameter].label
                    }
                }
            }
        }
    });
}

// Chart 3: Pie Chart - Zone Distribution
function createPieChart() {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;

    const distribution = getZoneDistribution(currentFilters.face, currentFilters.parameter);

    // Use DT data for pie chart
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: distribution.labels,
            datasets: [{
                label: 'DT',
                data: distribution.dt,
                backgroundColor: [
                    zones.ecran.color + 'CC',  // Alpha 0.8
                    zones.tete.color + 'CC',
                    zones.yeux.color + 'CC',
                    zones.bouche.color + 'CC'
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: `Répartition DT - Visage ${currentFilters.face}`,
                    font: { size: 14, weight: '600' }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Chart 4: Combined Chart - Bar + Line
function createCombinedChart() {
    const ctx = document.getElementById('combinedChart');
    if (!ctx) return;

    const allData = getAllFacesData(currentFilters.zone, currentFilters.parameter);

    // Calculate averages
    const averages = allData.labels.map((_, i) => {
        return (allData.dt[i] + allData.tsa[i]) / 2;
    });

    combinedChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: allData.labels,
            datasets: [
                {
                    label: 'DT',
                    data: allData.dt,
                    backgroundColor: groupColors.dt + 'B3', // Alpha 0.7
                    borderColor: groupColors.dt,
                    borderWidth: 2,
                    type: 'bar'
                },
                {
                    label: 'TSA',
                    data: allData.tsa,
                    backgroundColor: groupColors.tsa + 'B3', // Alpha 0.7
                    borderColor: groupColors.tsa,
                    borderWidth: 2,
                    type: 'bar'
                },
                {
                    label: 'Moyenne',
                    data: averages,
                    borderColor: groupColors.average,
                    backgroundColor: groupColors.average + '33', // Alpha 0.2
                    borderWidth: 3,
                    type: 'line',
                    tension: 0.3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: `Analyse Combinée - ${zones[currentFilters.zone].label}`,
                    font: { size: 14, weight: '600' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: parameters[currentFilters.parameter].label
                    }
                }
            }
        }
    });
}

// Update all charts with new filters
function updateCharts() {
    // Destroy existing charts
    if (barChart) barChart.destroy();
    if (lineChart) lineChart.destroy();
    if (pieChart) pieChart.destroy();
    if (combinedChart) combinedChart.destroy();

    // Recreate charts with new data
    createBarChart();
    createLineChart();
    createPieChart();
    createCombinedChart();

    // Trigger fun playground visualizations
    if (typeof FunDataViz !== 'undefined') {
        FunDataViz.updateAll();
    }

    // Highlight selected zone
    highlightZone(currentFilters.zone);
}

// Highlight the selected zone on the faces
function highlightZone(zone) {
    const overlays = document.querySelectorAll('.zone-overlay');
    overlays.forEach(overlay => {
        // Reset classes
        overlay.className = 'zone-overlay';

        // Find parent face card to check if it matches the current selected face
        const faceCard = overlay.closest('.face-card');
        const faceId = faceCard ? parseInt(faceCard.dataset.face) : null;

        // Only apply highlight if zone exists AND it matches the current face filter
        // Note: currentFilters.face is a string or number, ensure comparison works
        if (zone && faceId == currentFilters.face) {
            overlay.classList.add('active');
            overlay.classList.add(`zone-${zone}`);
        }
    });
}

// Update filter state
function updateFilter(filterType, value) {
    currentFilters[filterType] = value;
    updateCharts();
}

// Initialize charts when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCharts);
} else {
    initCharts();
}
