import React from 'react';
import { getCsrfToken } from '../../index';
import IntegrationhelperInputGenbanks from './IntegrationhelperInputGenbanks';
import IntegrationhelperInputSequences from './IntegrationhelperInputSequences';
import IntegrationhelperOutput from './IntegrationhelperOutput';
import { usePages, useMessages } from '../../ContextProvider';
import { v4 as uuidv4 } from 'uuid';

function IntegrationhelperDriver( { InputType } ) {
  const { addPage } = usePages();
  const { addMessage } = useMessages();

  const fetchCargoDataGenbanks = async (formData) => {
    const csrfToken = await getCsrfToken();

    try {
        const response = await fetch(`/api/integrationhelper/genbanks_driver`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

      const thePage = {
        key: `page__${uuidv4()}`,
        title: `Integrationhelper results`,
        content: (
          <IntegrationhelperOutput results={data} />
        ),
      }

      addPage(thePage);

      // Add a message after successfully fetching and setting results
      addMessage({
        key: `message__${uuidv4()}`,
        title: `Integrationhelper Results Ready!`,
        content: 'Your Integrationhelper analysis has completed. Click here to go to the page.',
        page: thePage
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };

  const fetchCargoDataSequences = async (formData) => {
    const csrfToken = await getCsrfToken();

    try {
        const response = await fetch(`/api/integrationhelper/sequences_driver`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

      const thePage = {
        key: `page__${uuidv4()}`,
        title: `Integrationhelper results`,
        content: (
          <IntegrationhelperOutput results={data} />
        ),
      }

      addPage(thePage);

      // Add a message after successfully fetching and setting results
      addMessage({
        key: `message__${uuidv4()}`,
        title: `Integrationhelper Results Ready!`,
        content: 'Your Integrationhelper analysis has completed. Click here to go to the page.',
        page: thePage
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };

  return (
    <>
      {InputType === "genbanks" ? (
        <IntegrationhelperInputGenbanks onCargoSubmit={fetchCargoDataGenbanks} />
      ) : (
        <IntegrationhelperInputSequences onCargoSubmit={fetchCargoDataSequences} />
      )}
    </>
  );
}


export default IntegrationhelperDriver;