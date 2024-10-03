import { useCallback, useEffect, useState } from 'react';
import { useFiles } from '../ContextProvider'; // Adjust the import path as necessary
import useFetchCall from './useFetchCall';

const useListObjects = () => {
  const [objects, setObjects] = useState({});
  const { triggerUpdate } = useFiles(); // Assuming triggerUpdate function toggles a state that causes re-render
  const fetchCall = useFetchCall();

  // Define listObjects using useCallback
  const listObjects = useCallback(async (bucketName) => {
    const response = await fetchCall('list_objects', 'POST', { bucket_name: bucketName });
    if (response.ok) {
      const data = await response.json();
      setObjects(prevObjects => ({ ...prevObjects, [bucketName]: data.objects }));
    } else {
      console.error(`Failed to fetch objects for bucket "${bucketName}".`);
    }
  }, [fetchCall]);

  // Use useEffect to call listObjects when triggerUpdate changes
  useEffect(() => {
    const defaultBucketName = 'bucket001';
    listObjects(defaultBucketName);
  }, [listObjects, triggerUpdate]); // React to triggerUpdate changes

  return { objects, listObjects };
};

export default useListObjects;
