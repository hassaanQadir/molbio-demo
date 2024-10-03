import React from 'react';
import useUploadObject from '../../filestorage/useUploadObject';
import { useMessages } from '../../ContextProvider';
import { v4 as uuidv4 } from 'uuid';

function PlasmidfinderOutput({ results }) {
    const { addMessage } = useMessages();
    
    const uploadObject = useUploadObject();

    const plasmidFinderResults = results.plasmidfinder_agent_results_dictionary;

    
    const handleUpload = async () => {
        const plasmidObject = {
            bucket_name: 'bucket001',
            object_name: 'plasmid object',
            object_data: plasmidFinderResults.final_output_string || '', // Corrected fallback
            object_type: 'plasmid',
            object_size: plasmidFinderResults.final_output_string ? plasmidFinderResults.final_output_string.length : 0, // Corrected conditional check
        };
    
        await uploadObject(plasmidObject);

        addMessage({
            key: `message__${uuidv4()}`, // Ensure a unique key
            title: `Plasmid Saved!`,
            content: 'Your Plasmid has been saved to your Storage.',
          });
    };
    
    


    return (
        <div className="bg-white shadow rounded-lg p-6">
            {plasmidFinderResults && (
                <div className="mt-4">
                    {plasmidFinderResults.addgene_genbank && (
                        <div className="mt-4">
                            <button onClick={handleUpload} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Save Plasmid  
                            </button>
                            <p className="text-sm break-words break-all text-wrap text-gray-600 mt-4">{plasmidFinderResults.final_output_string}</p>
                        </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-800">DuckDuckGo Search Results</h3>
                    {Object.entries(plasmidFinderResults.duckduckgo_results_dict).map(([key, value]) => (
                        <div key={key} className="mt-2">
                            <a href={value.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{value.title}</a>
                            <p className="text-sm text-gray-600 mt-1">{value.body}</p>
                        </div>
                    ))}
                    
                </div>
            )}
        </div>
    );
}

export default PlasmidfinderOutput;
