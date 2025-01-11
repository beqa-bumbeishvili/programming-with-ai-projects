const unemploymentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
        data: [4.0, 3.8, 3.7, 3.6, 3.5, 3.4],
        backgroundColor: [
            '#FDA4AF',
            '#FDE047',
            '#86EFAC',
            '#7DD3FC',
            '#A78BFA',
            '#F472B6'
        ],
        borderWidth: 1,
        borderRadius: 5,
        barPercentage: 0.5 
    }]
};

const chartConfig = {
    type: 'bar',
    data: unemploymentData,
    options: {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
            legend: {
                display: false 
            },
            tooltip: {
                enabled: false 
            },
            datalabels: { 
                anchor: 'end',
                align: 'end',
                formatter: (value) => `${value}%`,
                font: {
                    weight: 'bold',
                    size: 12
                },
                color: '#333'
                
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 5,
                ticks: {
                    stepSize: 1,
                    callback: function(value) {
                        return value + '%';
                    }
                },
                title: {
                    display: true,
                    text: 'Unemployment Rate (%)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            }
        }
    },
    plugins: [ChartDataLabels]
};

function initChart() {
    const ctx = document.getElementById('unemploymentChart').getContext('2d');
    new Chart(ctx, chartConfig);
}

document.addEventListener('DOMContentLoaded', initChart);
