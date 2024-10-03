// useFetchCall.js
import { useCallback } from 'react';
import { getCsrfToken } from '../index'; // Adjust the import path as necessary

const useFetchCall = () => {
  const fetchCall = useCallback(async (endpoint, method, body) => {
    const csrfToken = await getCsrfToken();
    const response = await fetch(`/api/data_hub/${endpoint}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(body),
    });
    return response;
  }, []);

  return fetchCall;
};

export default useFetchCall;
