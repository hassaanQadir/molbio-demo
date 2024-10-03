// useDeleteObject.js
import { useCallback } from 'react';
import useFetchCall from './useFetchCall';
import { useFiles } from '../ContextProvider';

const useDeleteObject = () => {
  const { triggerUpdate } = useFiles();
  const fetchCall = useFetchCall();

  const deleteObject = useCallback(async ({ bucket_name, object_uuid }) => {
    const response = await fetchCall('delete_object', 'POST', {
      bucket_name,
      object_uuid,
    });
    if (response.ok) {
      console.log(`Object "${object_uuid}" deleted successfully.`);
      triggerUpdate();
      return true;
    } else {
      console.error(`Failed to delete object "${object_uuid}".`);
      return false;
    }
  }, [fetchCall, triggerUpdate]);

  return deleteObject;
};

export default useDeleteObject;
