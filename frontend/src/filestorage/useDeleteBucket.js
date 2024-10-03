// useDeleteBucket.js
import { useCallback } from 'react';
import useFetchCall from './useFetchCall'; // Assuming this is the path to your custom fetch hook

const useDeleteBucket = (listBucketsCallback) => {
  const fetchCall = useFetchCall();

  const deleteBucket = useCallback(async (bucketName) => {
    const response = await fetchCall('delete_bucket', 'POST', { bucket_name: bucketName });
    if (response.ok) {
      console.log(`Bucket "${bucketName}" deleted successfully.`);
      if (listBucketsCallback) {
        await listBucketsCallback(); // Refresh the list of buckets if provided
      }
    } else {
      console.error(`Failed to delete bucket "${bucketName}".`);
    }
  }, [fetchCall, listBucketsCallback]);

  return deleteBucket;
};

export default useDeleteBucket;
