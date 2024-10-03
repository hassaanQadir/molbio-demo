import React, { useState } from 'react';

function IntegrationHelperInputGenbanks({ onCargoSubmit }) {
    const [genomeFile, setGenomeFile] = useState(null);
    const [cargoFile, setCargoFile] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [showResultsMessage, setShowResultsMessage] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!genomeFile || !cargoFile) {
            alert("Please upload both files.");
            return;
        }

        setLoading(true);
        setShowResultsMessage(false);

        const formData = new FormData();
        formData.append('genomeFile', genomeFile);
        formData.append('cargoFile', cargoFile);

        onCargoSubmit(formData)
            .then(() => {
                setShowResultsMessage(true);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Integration Helper</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="genome_input" className="block text-sm font-medium text-gray-700">Upload genome genbank:</label>
                    <input type="file" name="genome_input" accept=".gb" id="genome_input" onChange={(e) => setGenomeFile(e.target.files[0])} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label htmlFor="cargo_input" className="block text-sm font-medium text-gray-700">Upload plasmid genbank carrying the cargo:</label>
                    <input type="file" name="cargo_input" id="cargo_input" onChange={(e) => setCargoFile(e.target.files[0])} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <button type="submit" className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full">
                    {loading ? 'Loading...' : 'Submit'}
                </button>
            </form>
            {showResultsMessage && (
                <div className="mt-4 text-blue-600">
                    Results in Workspace
                </div>
            )}
        </div>
    );
}

export default IntegrationHelperInputGenbanks;
