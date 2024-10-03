import React, { useEffect } from 'react';
import { useFiles } from '../ContextProvider';
import useUploadObject from '../filestorage/useUploadObject';
// import useDownloadObject from './useDownloadObject';
import useListBuckets from '../filestorage/useListBuckets';
import useListObjects from '../filestorage/useListObjects';
import useDeleteObject from '../filestorage/useDeleteObject';
import useOpenObject from '../filestorage/useOpenObject';

const MockDatabaseDemo = () => {
  const { listBuckets } = useListBuckets();
  const { objects, listObjects } = useListObjects();
  
  const defaultBucketName = 'bucket001';

  const uploadObject = useUploadObject();
  // const downloadObject = useDownloadObject();
  const deleteObject = useDeleteObject();
  const openObject = useOpenObject();

  const defaultObject = {
    bucket_name: defaultBucketName,
    object_name: 'test object',
    object_data: 'test-data',
    object_type: 'text/plain',
    object_size: 1024,
  };

  const { updateTrigger } = useFiles(); 
  
  

  useEffect(() => {
    listBuckets();
    listObjects(defaultBucketName);
  }, [listBuckets, listObjects, updateTrigger]);

  const handleUpload = async () => {
    await uploadObject(defaultObject);
  };

  // const handleDownload = async (objectName, objectUuid) => {
  //   await downloadObject(defaultBucketName, objectUuid);
  // };

  const handleOpen = async (objectName, objectUuid) => {
    await openObject(defaultBucketName, objectUuid);
  };

  const handleDelete = async (objectName, objectUuid, event) => {
    event.stopPropagation();
    await deleteObject({ bucket_name: defaultBucketName, object_uuid: objectUuid });
  };


  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">File Directory</h2>
      <div className="flex space-x-2 mt-4">
        <button onClick={() => handleUpload(defaultObject)} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Upload test object
        </button>
      </div>
      <div>
        {Object.entries(objects).map(([bucketName, bucketObjects]) => (
          <div key={bucketName} className="mt-2">
            <ul className="list-none">
              {bucketObjects.map(object => (
                <li key={object.uuid} className="flex items-center justify-between p-2 hover:bg-blue-100 dark:hover:bg-gray-700 border-b last:border-b-0 cursor-pointer" 
                onClick={() => handleOpen(object.name, object.uuid)}>
                  <span>{object.name}</span>
                  <button onClick={(e) => handleDelete(object.name, object.uuid, e)} className="ml-4">✕</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MockDatabaseDemo;
