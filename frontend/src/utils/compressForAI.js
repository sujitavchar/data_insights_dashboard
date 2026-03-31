/**
 * Compresses large dataset into high-level summary metadata for the AI.
 * Follows the expected body structure from backend/routes/insights.py.
 * @param {Array} data - Raw dataset array.
 * @param {string} metric - Selected metric (e.g. 'revenue', 'impressions').
 * @returns {Object} - Compressed statistics summary.
 */
export const compressForAI = (data, metric) => {
    if (!data || data.length === 0) return {};

    let total = 0;
    let maxVal = -1;
    let maxRecord = null;
    let minVal = Infinity;
    let minRecord = null;
    
    // Platform/Channel counts
    const platformSum = {};

    data.forEach(row => {
        const val = parseFloat(row[metric]) || 0;
        const channel = row.channel || row.platform || 'Unknown';

        total += val;

        if (val > maxVal) {
            maxVal = val;
            maxRecord = row;
        }

        if (val < minVal) {
            minVal = val;
            minRecord = row;
        }

        if (!platformSum[channel]) {
            platformSum[channel] = 0;
        }
        platformSum[channel] += val;
    });

    // Find top and bottom platforms
    const sortedPlatforms = Object.entries(platformSum).sort((a, b) => b[1] - a[1]);
    const topPlatform = sortedPlatforms[0] ? { name: sortedPlatforms[0][0], val: sortedPlatforms[0][1] } : null;

    return {
        total_records: data.length,
        metric_analyzed: metric,
        total_value: total.toFixed(2),
        highest_record: maxRecord ? { id: maxRecord.id, [metric]: maxVal, channel: maxRecord.channel || maxRecord.platform } : null,
        lowest_record: minRecord ? { id: minRecord.id, [metric]: minVal, channel: minRecord.channel || minRecord.platform } : null,
        top_platform: topPlatform,
        unique_platforms_count: sortedPlatforms.length
    };
};
