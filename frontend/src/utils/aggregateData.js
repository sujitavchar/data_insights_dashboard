/**
 * Aggregates raw dataset for Chart.js rendering.
 * @param {Array} data - Array of record objects.
 * @param {string} chartType - 'bar' or 'line'
 * @param {string} metric - e.g., 'revenue', 'spend', 'impressions'
 * @returns {Object} - Chart.js data object: { labels: [], datasets: [{...}] }
 */
export const aggregateData = (data, chartType, metric, selectedChannels =[]) => {
    if (!data || data.length === 0) return { labels: [], datasets: [] };

    // For line charts, typically want timeline logic.
    // For bar charts, typically want categorical logic (like by channel or platform).
    
    // We will build a flexible grouping logic based on chartType
    const grouped = {};

    data.forEach(row => {
        const dateVal = row.date || 'Unknown Date';
        const channelVal = row.channel || row.platform || 'Unknown Channel';
        const metricVal = parseFloat(row[metric]) || 0;

        //  FILTER LOGIC
        if (chartType === 'bar') {
            if (!selectedChannels.includes(channelVal)) return;
        }

        let key = chartType === 'line' ? dateVal : channelVal;

        if (!grouped[key]) {
            grouped[key] = 0;
        }
        grouped[key] += metricVal;
    });

    // Sort labels appropriately
    let sortedKeys = Object.keys(grouped);
    if (chartType === 'line') {
        sortedKeys.sort((a, b) => new Date(a) - new Date(b));
    } else {
        // Sort categories by metric value descending
        sortedKeys.sort((a, b) => grouped[b] - grouped[a]);
    }

    const labels = sortedKeys;
    const values = sortedKeys.map(k => grouped[k]);

    return {
        labels: labels,
        datasets: [
            {
                label: `Total ${metric.charAt(0).toUpperCase() + metric.slice(1)}`,
                data: values,
                backgroundColor: chartType === 'bar' ? 'rgba(54, 162, 235, 0.6)' : 'rgba(75, 192, 192, 0.2)',
                borderColor: chartType === 'bar' ? 'rgba(54, 162, 235, 1)' : 'rgba(75, 192, 192, 1)',
                borderWidth: chartType === 'bar' ? 1 : 2,
                tension: 0.3, // slight curve for lines
                fill: chartType === 'line',
            }
        ]
    };
};
