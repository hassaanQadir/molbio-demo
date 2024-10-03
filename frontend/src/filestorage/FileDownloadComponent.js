import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCsrfToken } from '../index';

const FileDownloadComponent = () => {
  const [fileList, setFileList] = useState([]);
  const [downloadMessage, setDownloadMessage] = useState('');

  useEffect(() => {
    const fetchFileList = async () => {
        const csrftoken = await getCsrfToken();

      try {
        const response = await axios.get(`/api/data_hub/list_files`, {
            headers: {
                'X-CSRFToken': csrftoken,
              },
            withCredentials: true
        });
        setFileList(response.data.files);
      } catch (error) {
        setDownloadMessage(`Error fetching file list: ${error.message}`);
      }
    };

    fetchFileList();
  }, []);

  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(`/api/data_hub/download_file/${fileId}`, {
        responseType: 'blob', // Important
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // or any other extension
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setDownloadMessage(`Downloaded ${fileName} successfully.`);
    } catch (error) {
      setDownloadMessage(`Error downloading file: ${error.message}`);
    }
  };

  return (
    <div>
      <h3>Available Files</h3>
      {fileList.length > 0 ? (
        <ul>
          {fileList.map(({ fileId, name }) => (
            <li key={fileId}>
              {name} <button onClick={() => downloadFile(fileId, name)}>Download</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No files available for download.</p>
      )}
      {downloadMessage && <p>{downloadMessage}</p>}
    </div>
  );
};

export default FileDownloadComponent;
