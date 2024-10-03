import React, { useState } from 'react';
import '../main.css';
import { getCsrfToken } from '../index';



function DNAbuilder() {
  const [sequenceFile, setSequenceFile] = useState(null);
  const [plasmidFile, setPlasmidFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [apiData, setApiData] = useState([]); // State to store API data

  
  const handleSubmit = async (event) => {
    const csrfToken = await getCsrfToken();
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // Reset the error message on new submission


    // Create a FormData object to hold the files
    const formData = new FormData();
    formData.append('sequence_database_input', sequenceFile);
    formData.append('desired_plasmid_input', plasmidFile);

    try {
      const response = await fetch('/api/dnabuilder/driver', { 
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken,
      },
        body: formData,
        credentials: 'include',
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const nonJsonResponse = await response.text(); // Read the response as text
        throw new Error(`Received non-JSON response from the server: ${nonJsonResponse}`);
      }
  

      const result = await response.json(); // Parse the JSON response

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! Status: ${response.status}`);
      }

      // Process the response here if needed

    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage(error.message); // Set the error message
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // eslint-disable-next-line
  const handleAPICall = async () => {
    const csrfToken = await getCsrfToken();
    setIsLoading(true);
    setErrorMessage('');
  
    try {
      const response = await fetch(`/api/dnabuilder/test`, { 
        method: 'POST',
        headers: {
          'X-CSRFToken': csrfToken,
      },
        credentials: 'include',
      });

      const contentType = response.headers.get('content-type');
  
      if (!contentType || !contentType.includes('application/json')) {
        // If the response is not JSON, read it as text
        const textResponse = await response.text();
        setErrorMessage(`Non-JSON Response: ${textResponse}`);
      } else {
        const data = await response.json()
        if (data.status === 'success' && Array.isArray(data.primers)) {
          setApiData(data.primers); // Set the primers array to your state
        } else {
          setErrorMessage('No primers data found');
        }
      }
      
      
      
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  

  

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <ol className="list-decimal list-inside mb-4">
        <li>Upload a folder containing genbanks of all your DNA fragments.</li>
        <li>Upload a genbank of the plasmid you want to make.</li>
        <li>We'll show you how to combine the fragments you already have to get the plasmid you want.</li>
      </ol>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sequence File Input */}
        <div>
          <label htmlFor="sequence_database_input" className="block text-sm font-medium text-gray-700">Upload sequences in a ZIP:</label>
          <input 
            type="file" 
            name="sequence_database_input" 
            accept=".zip" 
            id="sequence_database_input"
            onChange={(e) => setSequenceFile(e.target.files[0])}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        {/* Plasmid File Input */}
        <div>
          <label htmlFor="desired_plasmid_input" className="block text-sm font-medium text-gray-700">Upload desired plasmid:</label>
          <input 
            type="file" 
            name="desired_plasmid_input" 
            id="desired_plasmid_input"
            onChange={(e) => setPlasmidFile(e.target.files[0])}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <button type="submit" className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full">
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {errorMessage && (
        <div className="mt-4 text-sm text-red-500">{errorMessage}</div>
      )}
      {isLoading && (
        <div className="mt-4 text-sm text-blue-600">Processing... Please wait.</div>
      )}

      {apiData.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">String 1</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">String 2</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apiData.map((row, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row[0]}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row[1]}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row[2]}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DNAbuilder;
