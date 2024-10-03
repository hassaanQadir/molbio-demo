// useListBuckets.js
import { useCallback, useState } from 'react';
import useFetchCall from './useFetchCall';

const useListBuckets = () => {
  const [buckets, setBuckets] = useState([]);
  const fetchCall = useFetchCall();

  const listBuckets = useCallback(async () => {
    const response = await fetchCall('list_buckets', 'GET');
    if (response.ok) {
      const data = await response.json();
      setBuckets(data.buckets);
    } else {
      console.error('Failed to fetch buckets.');
    }
  }, [fetchCall]);

  return { buckets, listBuckets };
};

export default useListBuckets;
