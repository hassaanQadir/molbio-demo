import React, { useState, useEffect } from 'react';
import { useMessages } from '../../ContextProvider';
import { v4 as uuidv4 } from 'uuid';
import { SeqViz } from 'seqviz';
import seqparse from "seqparse";

function IntegrationhelperOutput({ results }) {
    const { addMessage } = useMessages();
    const [downloadUrl, setDownloadUrl] = useState('');

    useEffect(() => {
        // Check if fileContent is available in the results
        if (results.syntheticGenomeFileContent) {
            // Create a Blob from the fileContent string
            const blob = new Blob([results.syntheticGenomeFileContent], { type: 'text/plain' });
            // Create a URL for the Blob
            const url = window.URL.createObjectURL(blob);
            // Set the URL for downloading
            setDownloadUrl(url);

            // Cleanup the blob URL when the component unmounts
            return () => {
                window.URL.revokeObjectURL(url);
            };
        }
    }, [results.syntheticGenomeFileContent]); 

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <p>We have integrated your plasmid's cargo into the synthetic genome below!</p>
            

            
            {downloadUrl && (
                <a href={downloadUrl} download="syntheticGenome.gb" className="mt-4 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Download Synthetic Genome Genbank
                </a>
            )}
        </div>
    );
}

export default IntegrationhelperOutput;
