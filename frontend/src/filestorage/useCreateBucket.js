// useCreateBucket.js
import { useCallback } from 'react';
import useFetchCall from './useFetchCall'; // Assuming this is the path to your custom fetch hook

const useCreateBucket = () => {
  const fetchCall = useFetchCall();

  const createBucket = useCallback(async (bucketName, listBucketsCallback) => {
    const response = await fetchCall('create_bucket', 'POST', { bucket_name: bucketName });
    if (response.ok) {
      console.log(`Bucket "${bucketName}" created successfully.`);
      if (listBucketsCallback) {
        await listBucketsCallback();
      }
    } else {
      console.error(`Failed to create bucket "${bucketName}".`);
    }
  }, [fetchCall]);

  return createBucket;
};

export default useCreateBucket;
