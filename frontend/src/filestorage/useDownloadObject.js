// useDownloadObject.js
import { useCallback } from 'react';
import useFetchCall from './useFetchCall'; // Ensure this path is correct

const useDownloadObject = () => {
  const fetchCall = useFetchCall();


  const downloadObject = useCallback(async (bucketName, objectUuid) => {
    const response = await fetchCall('download_object', 'POST', {
      bucket_name: bucketName,
      object_uuid: objectUuid,
    });
    if (response.ok) {
      const responseData = await response.json();
      console.log(`Object downloaded with UUID "${objectUuid}":`, responseData);
      // Extracting `object_data` from the response
      const objectData = responseData.object_data;

      // Creating a Blob from the `object_data` string
      const blob = new Blob([objectData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'plasmid.gb';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return responseData; // Return the downloaded data
    } else {
      console.error(`Failed to download object with UUID "${objectUuid}" from bucket "${bucketName}".`);
      return null; // Indicate failure
    }
  }, [fetchCall]);

  return downloadObject;
};

export default useDownloadObject;
