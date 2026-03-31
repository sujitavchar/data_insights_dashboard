import Papa from 'papaparse';

/**
 * Parses a File object (CSV or JSON) and returns a Promise resolving to an array of objects.
 * Expects dataset to represent Media Insights: id, channel, program, brand, date, time_slot, impressions, revenue, ctr, spend, region.
 */
export const parseFile = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject(new Error("No file selected"));
        }

        const extension = file.name.split('.').pop().toLowerCase();

        if (extension === 'json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (Array.isArray(data)) {
                        resolve(data);
                    } else {
                        reject(new Error("JSON data must be an array of objects."));
                    }
                } catch (err) {
                    reject(new Error("Invalid JSON file format."));
                }
            };
            reader.onerror = () => reject(new Error("Failed to read JSON file."));
            reader.readAsText(file);
            return;
        }

        if (extension === 'csv') {
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,  // Automatically converts numeric fields like revenue, spend, impressions to numbers
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        console.error('CSV Parsing Errors:', results.errors);
                    }
                    resolve(results.data);
                },
                error: (error) => {
                    reject(new Error(`CSV parsing error: ${error.message}`));
                }
            });
            return;
        }

        reject(new Error("Unsupported file format. Please upload a .json or .csv file."));
    });
};
