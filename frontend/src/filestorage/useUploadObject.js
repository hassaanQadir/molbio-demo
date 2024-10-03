// useUploadObject.js
import { useCallback } from 'react';
import useFetchCall from './useFetchCall';
import { useFiles } from '../ContextProvider';

const useUploadObject = () => {
  const { triggerUpdate } = useFiles();
  const fetchCall = useFetchCall();

  const uploadObject = useCallback(async ({ bucket_name, object_name, object_data, object_type, object_size }) => {
    const response = await fetchCall('upload_object', 'POST', {
      bucket_name,
      object_name,
      object_data,
      object_type,
      object_size,
    });
    if (response.ok) {
      console.log(`Object "${object_name}" uploaded successfully.`);
      triggerUpdate();
      return true;
    } else {
      console.error(`Failed to upload object "${object_name}".`);
      return false;
    }
  }, [fetchCall, triggerUpdate]); 

  return uploadObject;
};

export default useUploadObject;
