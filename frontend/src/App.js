import React, { useState,  useEffect } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import ChartTypeSelector from './components/ChartTypeSelector';
import ChartPanel from './components/ChartPanel';
import AIInsightsPanel from './components/AIInsightsPanel';

function App() {
    const [dataset, setDataset] = useState([]);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState('bar');
    const [metric, setMetric] = useState('revenue');
    const [selectedChannels, setSelectedChannels] = useState([]);
    const [channels, setChannels] = useState([]);

    const handleDataParsed = (data, name) => {
        setDataset(data);
        setFileName(name);
    };

    useEffect(() => {
    if (dataset.length > 0) {
        const uniqueChannels = [
            ...new Set(dataset.map(d => d.channel || d.platform))
        ];

        setChannels(uniqueChannels);
        setSelectedChannels(uniqueChannels); // ✅ default all selected
    }
    }, [dataset]);

    return (
        <div className="telecast-dashboard">
            <header className="dashboard-header panel">
                <div className="title-section">
                    <h1>🔴 LIVE: MEDIA METRICS CONTROL</h1>
                    <span className="subtitle">Real-Time Data Orchestration</span>
                </div>
                {fileName && (
                    <div className="status-indicator active">
                        SOURCE: {fileName}
                    </div>
                )}
            </header>

            {error && (
                <div className="error-banner panel">
                    <h2>SYSTEM ALERT</h2>
                    <p>{error}</p>
                </div>
            )}

            <main className="dashboard-grid">
                <aside className="sidebar collapse-desktop">
                    <FileUpload onDataParsed={handleDataParsed} onError={setError} />
                    
                    <ChartTypeSelector 
                        chartType={chartType} 
                        setChartType={setChartType} 
                        metric={metric} 
                        setMetric={setMetric}
                        disabled={dataset.length === 0} 
                        channels={channels}
                        selectedChannels={selectedChannels}
                        setSelectedChannels={setSelectedChannels}
                    />
                    
                    <AIInsightsPanel 
                        data={dataset} 
                        chartType={chartType} 
                        metric={metric} 
                        disabled={dataset.length === 0}
                    />
                </aside>

                <section className="main-display">
                    <ChartPanel 
                        data={dataset} 
                        chartType={chartType} 
                        metric={metric} 
                        selectedChannels={selectedChannels}
                    />
                </section>
            </main>
        </div>
    );
}

export default App;
