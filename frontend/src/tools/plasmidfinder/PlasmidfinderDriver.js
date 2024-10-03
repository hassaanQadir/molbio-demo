import React from 'react';
import { getCsrfToken } from '../../index';
import PlasmidfinderInput from './PlasmidfinderInput';
import PlasmidfinderOutput from './PlasmidfinderOutput';
import { usePages, useMessages } from '../../ContextProvider';
import { v4 as uuidv4 } from 'uuid';

function PlasmidfinderDriver() {
  const { addPage } = usePages();
  const { addMessage } = useMessages();

  const fetchPlasmidData = async (pmid) => {
    const csrfToken = await getCsrfToken();

    try {
      const response = await fetch(`/api/plasmidfinder/driver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ pmid: pmid }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // Check if user_input is over 10 characters long and truncate if necessary
      const truncated_pmid = pmid.length > 10 ? `${pmid.substring(0, 10)}-` : pmid;

      const thePage = {
        key: `page__${uuidv4()}`,
        title: `${truncated_pmid} results`,
        content: (
          <PlasmidfinderOutput results={data} />
        ),
      }

      addPage(thePage);

      // Add a message after successfully fetching and setting results
      addMessage({
        key: `message__${uuidv4()}`,
        title: `${truncated_pmid} Plasmidfinder Results Ready!`,
        content: 'Your Plasmidfinder analysis has completed. Click here to go to the page.',
        page: thePage
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };

  return (
    <div>
      <PlasmidfinderInput onPmidSubmit={fetchPlasmidData} />
    </div>
  );
}

export default PlasmidfinderDriver;
