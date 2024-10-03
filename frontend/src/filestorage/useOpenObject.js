// useOpenObject.js
import { useCallback } from 'react';
import useFetchCall from './useFetchCall'; // Ensure this path is correct
import PlasmidPage from '../workspace/PlasmidPage';
import { usePages } from '../ContextProvider';

const useOpenObject = () => {
  const fetchCall = useFetchCall();
  const { addPage } = usePages();


  const openObject = useCallback(async (bucketName, objectUuid) => {
    const response = await fetchCall('open_object', 'POST', {
      bucket_name: bucketName,
      object_uuid: objectUuid,
    });
    if (response.ok) {
      const responseData = await response.json();
      console.log(`Object opened with UUID "${objectUuid}":`, responseData);
      // Extracting `object_data` from the response
      const objectData = responseData.object_data;

      addPage({
        key: `Plasmid-${Date.now()}`,
        title: `Your Plasmid`,
        content: (
            <PlasmidPage results={objectData} />
        ),
      });
      return objectData; // Return the opened data
    } else {
      console.error(`Failed to open object with UUID "${objectUuid}" from bucket "${bucketName}".`);
      return null; // Indicate failure
    }
  }, [fetchCall, addPage]);

  return openObject;
};

export default useOpenObject;
