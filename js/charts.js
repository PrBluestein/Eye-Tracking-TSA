



let barChart, lineChart, pieChart, combinedChart;


let currentFilters = {
    face: 1,
    zone: 'ecran',
    parameter: 'tf'
};


Chart.defaults.font.family = 'Inter, sans-serif';
Chart.defaults.color = '#495057';

// Helper function to convert percentage values (0.95 -> 95)
function formatValue(value, unit) {
    if (unit === '%') {
        return value * 100;
    }
    return value;
}

// Helper function to get descriptive Y-axis labels with units
function getYAxisLabel(parameter, unit) {
    const label = parameters[parameter].label;

    // Add descriptive units
    if (unit === '%') {
        return `${label} (% du temps)`;
    } else if (unit === 's') {
        return `${label} (secondes)`;
    } else if (unit === 'fixations') {
        return `${label} (nombre)`;
    } else if (unit === 'entrées') {
        return `${label} (nombre)`;
    }

    return `${label} (${unit})`;
}

function initCharts() {
    createBarChart();
    createLineChart();
    createPieChart();
    createCombinedChart();
}


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
                data: [
                    formatValue(data.dt, data.unit),
                    formatValue(data.tsa, data.unit)
                ],
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
                        text: getYAxisLabel(currentFilters.parameter, data.unit)
                    }
                }
            }
        }
    });
}


function createLineChart() {
    const ctx = document.getElementById('lineChart');
    if (!ctx) return;

    const allData = getAllFacesData(currentFilters.zone, currentFilters.parameter);
    const unit = getData(1, currentFilters.zone, currentFilters.parameter)?.unit || '';

    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: allData.labels,
            datasets: [
                {
                    label: 'DT',
                    data: allData.dt.map(v => formatValue(v, unit)),
                    borderColor: groupColors.dt,
                    backgroundColor: groupColors.dt + '20',
                    borderWidth: 3,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'TSA',
                    data: allData.tsa.map(v => formatValue(v, unit)),
                    borderColor: groupColors.tsa,
                    backgroundColor: groupColors.tsa + '10',
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
                        text: getYAxisLabel(currentFilters.parameter, unit)
                    }
                }
            }
        }
    });
}


function createPieChart() {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;

    const distribution = getZoneDistribution(currentFilters.face, currentFilters.parameter);
    const unit = getData(currentFilters.face, 'ecran', currentFilters.parameter)?.unit || '';

    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: distribution.labels,
            datasets: [{
                label: 'DT',
                data: distribution.dt.map(v => formatValue(v, unit)),
                backgroundColor: [
                    zones.ecran.color + 'CC',
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


function createCombinedChart() {
    const ctx = document.getElementById('combinedChart');
    if (!ctx) return;

    const allData = getAllFacesData(currentFilters.zone, currentFilters.parameter);
    const unit = getData(1, currentFilters.zone, currentFilters.parameter)?.unit || '';


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
                    data: allData.dt.map(v => formatValue(v, unit)),
                    backgroundColor: groupColors.dt + 'B3',
                    borderColor: groupColors.dt,
                    borderWidth: 2,
                    type: 'bar'
                },
                {
                    label: 'TSA',
                    data: allData.tsa.map(v => formatValue(v, unit)),
                    backgroundColor: groupColors.tsa + 'B3',
                    borderColor: groupColors.tsa,
                    borderWidth: 2,
                    type: 'bar'
                },
                {
                    label: 'Moyenne',
                    data: averages.map(v => formatValue(v, unit)),
                    borderColor: groupColors.average,
                    backgroundColor: groupColors.average + '33',
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
                        text: getYAxisLabel(currentFilters.parameter, unit)
                    }
                }
            }
        }
    });
}


function updateCharts() {

    if (barChart) barChart.destroy();
    if (lineChart) lineChart.destroy();
    if (pieChart) pieChart.destroy();
    if (combinedChart) combinedChart.destroy();


    createBarChart();
    createLineChart();
    createPieChart();
    createCombinedChart();


    if (typeof FunDataViz !== 'undefined') {
        FunDataViz.updateAll();
    }


    highlightZone(currentFilters.zone);
}


function highlightZone(zone) {
    const overlays = document.querySelectorAll('.zone-overlay');
    overlays.forEach(overlay => {

        overlay.className = 'zone-overlay';


        const faceCard = overlay.closest('.face-card');
        const faceId = faceCard ? parseInt(faceCard.dataset.face) : null;



        if (zone && faceId == currentFilters.face) {
            overlay.classList.add('active');
            overlay.classList.add(`zone-${zone}`);
        }
    });
}


function updateFilter(filterType, value) {
    currentFilters[filterType] = value;
    updateCharts();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCharts);
} else {
    initCharts();
}
