import React, { useState } from 'react';
import { compressForAI } from '../utils/compressForAI';

const AIInsightsPanel = ({ data, chartType, metric, disabled }) => {
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerateInsights = async () => {
        if (!data || data.length === 0) return;

        setLoading(true);
        setError(null);
        setInsight('');

        try {
            // Compress data so we don't bombard AI with huge generic payloads
            const compressedData = compressForAI(data, metric);

            const payload = {
                data: compressedData,
                chart_type: chartType,
                metric: metric,
            };
            console.log(payload);
            const response = await fetch('http://localhost:8000/api/summarise', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || `Server error: ${response.status}`);
            }

            const result = await response.json();
            setInsight(result.insight || "No insight generated.");

        } catch (err) {
            console.error('Insights Error:', err);
            setError(err.message || 'Failed to generate insights. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-insights-panel panel">
            <h3> AI Analyst</h3>
            <p className="subtitle">Synthesizing intelligence from current view.</p>
            
            <button 
                className="insight-btn"
                onClick={handleGenerateInsights}
                disabled={disabled || loading}
            >
                {loading ? 'GENERATING INSIGHTS...' : 'GENERATE INSIGHTS'}
            </button>

            {error && <div className="error-message">Error: {error}</div>}
            
            {(insight || loading) && (
                <div className="insight-response">
                    {loading ? (
                        <div className="loading-pulse">Analyzing control room metrics...</div>
                    ) : (
                        <p>{insight}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AIInsightsPanel;
