import React, { useRef } from 'react';

const FileUpload = ({ onDataParsed, onError }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Dynamically import the parsing logic
        const { parseFile } = await import('../utils/parseFile');

        try {
            const data = await parseFile(file);
            onDataParsed(data, file.name);
            onError(null); // Clear errors
        } catch (error) {
            console.error(error);
            onError(error.message || "Error parsing file");
        }
    };

    return (
        <div className="file-upload-panel panel">
            <h3>Data Source</h3>
            <p>Upload a JSON or CSV metrics file.</p>
            <input 
                type="file" 
                accept=".json,.csv"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="file-input"
            />
            <button 
                className="upload-btn" 
                onClick={() => fileInputRef.current.click()}
            >
                SELECT DATA FILE
            </button>
        </div>
    );
};

export default FileUpload;
