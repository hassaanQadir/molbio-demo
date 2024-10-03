import React from 'react';
import PlatformDashboard from '../platform/PlatformDashboard';
import { usePages, useMessages, useCards } from '../ContextProvider';
import { v4 as uuidv4 } from 'uuid';
import { SeqViz } from 'seqviz';



function PlasmidPage({ results }) {
    const { addPage } = usePages();
    const { addMessage } = useMessages();
    const { addCard } = useCards();

    const handleShare = async ( objectData ) => {
        // Here you add a new card and a message indicating the share was successful
        addCard({
            key: `card__${uuidv4()}`,
            type: 'plasmid',
            title: `Your Plasmid`,
            imageUrl: 'https://via.placeholder.com/150',
            bulletPoints: ['Point 1', 'Point 2', 'Point 3'], 
            objectData: objectData
        });

        const thePage = {
            key: `page__${uuidv4()}`, 
            title: 'Share', 
            content: <PlatformDashboard />
        }

        addPage(thePage);
    
        
        addMessage({
            key: `message__${uuidv4()}`, 
            title: `Plasmid Shared!`,
            content: 'Your Plasmid has been shared successfully.',
            page: thePage
        });
        
    };
    


    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800">Your Plasmid Here</h3>
                    {results && (
                        <div className="mt-4">
                        <SeqViz
                            name="plasmid"
                            seq="GACATTGATTATTGACTAGTTATTAATAGTAATCAATTACGGGGTCATTAGTTCATAGCCCATATATGGAGTTCCGCGTTACATAACTTACGGTAAATGGCCCGCCTGGCTGACCGCCCAACGACCCCCGCCCATTGACGTCAATAATGACGTATGTTCCCATAGTAACGCCAATAGGGACTTTCCATTGACGTCAATGGGTGGAGTATTTACGGTAAACTGCCCACTTGGCAGTACATCAAGTGTATCATATGCCAAGTACGCCCCCTATTGACGTCAATGACGGTAAATGGCCCGCCTGGCATTATGCCCAGTACATGACC"
                            style={{ height: "100vh", width: "100vw" }}
                        />
                            <p className="text-sm break-words break-all text-wrap text-gray-600 mt-4">{results}</p>
                        </div>
                    )}
            <button 
                onClick={() => handleShare(results)}  
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Share Plasmid
            </button>
        </div>
    );
}

export default PlasmidPage;
