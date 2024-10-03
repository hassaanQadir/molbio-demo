import React from 'react';

const FileDirectory = () => {
    const dummyFiles = [
        { name: "4Jan24", type: "Note", lastModified: "Last modified 1/1/2023" },
        { name: "Gel1.png", type: "Image File", lastModified: "Last modified 2/2/2023" },
        { name: "AE12.gb", type: "Genbank", lastModified: "Last modified 3/3/2023" },
        { name: "AE12", type: "Plasmid", lastModified: "Last modified 4/4/2023" },
        { name: "Electroporation", type: "Method", lastModified: "Last modified 5/5/2023" }
    ];

    return (
        <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-semibold mb-2">Files (Coming Soon)</p>
            <ul className="list-none">
                {dummyFiles.map((file, index) => (
                    <li key={index} className="flex items-start justify-between p-2 hover:bg-blue-100 dark:hover:bg-gray-700 border-b last:border-b-0">
                        <div className="flex flex-col">
                            {/* Placeholder for file icon */}
                            <div className="flex items-center mb-1">
                                <span className="inline-block w-6 h-6 bg-gray-300 rounded mr-2"></span>
                                {file.name}
                            </div>
                            <div className="text-sm text-gray-600">
                                {file.lastModified}
                            </div>
                        </div>
                        <div>
                            {/* Placeholder for any additional icons or info */}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FileDirectory;
