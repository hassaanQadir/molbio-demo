import React, { useState } from 'react';

function PlasmidfinderInput({ onPmidSubmit }) {
    const [pmid, setPmid] = useState('');
    const [loading, setLoading] = useState(false); 
    const [showResultsMessage, setShowResultsMessage] = useState(false); // State to manage the display of the results message

    const handleSubmit = (event) => {
      event.preventDefault();
      setLoading(true); // Set loading true right when form is submitted
      setShowResultsMessage(false); // Reset the results message display state on new submission
      onPmidSubmit(pmid)
          .then(() => {
              setShowResultsMessage(true); // Show results message when promise resolves
          })
          .finally(() => {
              setLoading(false); // Reset loading state when done
          });
  };
  
    const handlePmidChange = (event) => {
      setPmid(event.target.value);
    };

    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Plasmidfinder</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pmid" className="block text-sm font-medium text-gray-700">
            Enter the paper whose plasmid you want to source (DOI, PMID, title, or link):
            </label>
            <input
              type="text"
              name="pmid"
              id="pmid"
              value={pmid}
              onChange={handlePmidChange}
              className="mt-1 block w-full rounded-md border-2 bg-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              // disabled={loading} // Disable input when loading
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            // disabled={loading} // Optionally disable the button when loading
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
        {/* Conditionally display the results message */}
        {showResultsMessage && (
              <div className="mt-4 text-blue-600">
                  Results in Workspace
              </div>
          )}
      </div>
    );
}

export default PlasmidfinderInput;
