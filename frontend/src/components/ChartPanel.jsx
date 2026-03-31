import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { aggregateData } from '../utils/aggregateData';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ChartPanel = ({ data, chartType, metric, selectedChannels  }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (data && data.length > 0) {
            const aggregated = aggregateData(data, chartType, metric, selectedChannels );
            setChartData(aggregated);
        } else {
            setChartData(null);
        }
    }, [data, chartType, metric, selectedChannels ]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#e0e0e0' }
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                ticks: { color: '#b0b0b0' },
                grid: { color: '#333' }
            },
            y: {
                ticks: { color: '#b0b0b0' },
                grid: { color: '#333' }
            }
        }
    };

    if (!chartData || chartData.labels.length === 0) {
        return (
            <div className="chart-panel panel empty-state">
                <p>Upload data to see visualizations.</p>
            </div>
        );
    }

    return (
        <div className="chart-panel panel">
            {chartType === 'bar' ? (
                <Bar options={options} data={chartData} />
            ) : (
                <Line options={options} data={chartData} />
            )}
        </div>
    );
};

export default ChartPanel;
