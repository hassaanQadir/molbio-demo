import React from 'react';

const Page = ({ content }) => {
    return (
        <div className="flex flex-col flex-1 p-4 h-screen overflow-auto scrollbar-thin">
            <div>{content}</div>
        </div>
    );
};

export default Page;
