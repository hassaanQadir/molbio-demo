import React, { useState } from 'react';

function IntegrationHelperInputSequences({ onCargoSubmit }) {
    const [genomeSequence, setGenomeSequence] = useState('');
    const [cargoSequence, setCargoSequence] = useState('');
    const [loading, setLoading] = useState(false); 
    const [showResultsMessage, setShowResultsMessage] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!genomeSequence || !cargoSequence) {
            alert("Please enter both sequences.");
            return;
        }

        setLoading(true);
        setShowResultsMessage(false);

        const formData = new FormData();
        formData.append('genomeSequence', genomeSequence);
        formData.append('cargoSequence', cargoSequence);

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
                    <label htmlFor="genome_sequence" className="block text-sm font-medium text-gray-700">Genome Sequence:</label>
                    <textarea id="genome_sequence" name="genome_sequence" onChange={(e) => setGenomeSequence(e.target.value)} className="mt-1 block w-full rounded-md border-2 bg-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                </div>
                <div>
                    <label htmlFor="cargo_sequence" className="block text-sm font-medium text-gray-700">Cargo Sequence:</label>
                    <textarea id="cargo_sequence" name="cargo_sequence" onChange={(e) => setCargoSequence(e.target.value)} className="mt-1 block w-full rounded-md border-2 bg-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
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

export default IntegrationHelperInputSequences;
