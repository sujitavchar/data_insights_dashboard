import React from 'react';

const ChartTypeSelector = ({
    chartType,
    setChartType,
    metric,
    setMetric,
    disabled,
    channels = [],
    selectedChannels = [],
    setSelectedChannels
}) => {

    const toggleChannel = (channel) => {
        if (selectedChannels.includes(channel)) {
            setSelectedChannels(selectedChannels.filter(c => c !== channel));
        } else {
            setSelectedChannels([...selectedChannels, channel]);
        }
    };

    return (
        <div className="chart-selector panel">
            <h3>Visualization Controls</h3>

            <div className="control-group">
                <label>Chart Mode:</label>
                <select 
                    value={chartType} 
                    onChange={e => setChartType(e.target.value)}
                    disabled={disabled}
                >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                </select>
            </div>
            
            <div className="control-group">
                <label>Metric:</label>
                <select 
                    value={metric} 
                    onChange={e => setMetric(e.target.value)}
                    disabled={disabled}
                >
                    <option value="revenue">Revenue</option>
                    <option value="spend">Spend</option>
                    <option value="impressions">Impressions</option>
                    <option value="ctr">CTR</option>
                </select>
            </div>

            {/* FILTER UI */}
            {chartType === 'bar' && (
                <div className="control-group">
                    <label>Channels:</label>
                    {channels.map(channel => (
                        <div key={channel}>
                            <input
                                type="checkbox"
                                checked={selectedChannels.includes(channel)}
                                onChange={() => toggleChannel(channel)}
                                disabled={disabled}
                            />
                            <span>{channel}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChartTypeSelector;
