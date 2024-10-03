import React, { useState } from 'react';
import PlasmidfinderDriver from '../tools/plasmidfinder/PlasmidfinderDriver';
import DNAbuilder from '../tools/DNAbuilder';
import IntegrationhelperDriver from '../tools/integrationhelper/IntegrationhelperDriver';

const ToolDirectory = () => {
    const [activeTool, setActiveTool] = useState(null);

    const tools = [
        { name: "Plasmidfinder", component: <PlasmidfinderDriver /> },
        { name: "DNAbuilder", component: <DNAbuilder /> },
        { name: "Integrationhelper (Genbanks)", component: <IntegrationhelperDriver InputType="genbanks" />},
        { name: "Integrationhelper (Sequences)", component: <IntegrationhelperDriver InputType="sequences" />}
        // ... other tools
    ];

    const handleOpenTool = (componentJSX) => {
        setActiveTool(componentJSX); // Expecting a JSX component
    };

    const handleClose = () => {
        setActiveTool(null);
    };

    return (
        <div className="p-4 bg-gray-50 rounded-lg relative">
            {activeTool ? (
                <div className="absolute inset-0 bg-white rounded-lg">
                    {activeTool}
                    <button 
                        onClick={handleClose} 
                        className="absolute top-0 right-0 mt-2 mr-2 text-lg"
                    >
                        &times; {/* This is a simple 'x' button */}
                    </button>
                </div>
            ) : (
                <>
                    <p className="text-lg font-semibold text-right mb-2">Tools</p>
                    <div className="grid grid-cols-1 gap-2">
                        {tools.map((tool, index) => (
                            <button
                                key={index}
                                onClick={() => handleOpenTool(tool.component)}
                                className="flex items-center justify-center h-24 hover:bg-blue-100 dark:hover:bg-gray-700 border-b last:border-b-0"
                            >
                                {tool.name}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default ToolDirectory;
