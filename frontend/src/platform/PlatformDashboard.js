import React, { useState } from 'react';
import Card from './Card';
import { useCards } from '../ContextProvider';

function PlatformDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCards, setShowCards] = useState(true);

  const { Cards } = useCards();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Implement search functionality here
    console.log('Searching for:', searchTerm);
    // Mock loading and Cards
    setTimeout(() => {
      setLoading(false);
      setShowCards(true);
    }, 2000);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
    <p className="text-lg font-semibold text-center mb-2">Sharing Platform</p>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="mt-1 block w-full rounded-md border-2 bg-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Search..."
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>
      {showCards && (
        <div className="grid grid-cols-3 gap-4">
        {Cards.map(CardInstance => (
          <Card key={CardInstance.key} type={CardInstance.type} title={CardInstance.title} imageUrl={CardInstance.imageUrl} bulletPoints={CardInstance.bulletPoints} objectData={CardInstance.objectData} />
        ))}
      </div>
      )}
    </div>
  );
}

export default PlatformDashboard;
