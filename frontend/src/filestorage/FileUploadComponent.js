import React, { useState } from 'react';
import axios from 'axios';
import { getCsrfToken } from '../index';

const FileUploadComponent = () => {
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([]); // Use an array to store messages

  const addMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleFileChange = (event) => {
    setFiles(event.target.files);
    setMessages([]); // Clear messages when user selects new files
  };

  const uploadFiles = async () => {
    const csrftoken = await getCsrfToken();
    if (files.length === 0) {
      addMessage('Please select files to upload.');
      return;
    }

    addMessage('Starting upload...');
    const fileMetas = Array.from(files).map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
    }));

    try {
        const { data: { presigned_urls } } = await axios.post(`/api/data_hub/upload_files`, 
        { file_metas: fileMetas }, 
        {
          headers: {
            'X-CSRFToken': csrftoken,
          },
          withCredentials: true
        });
      addMessage('Received presigned URLs.');
      addMessage('Presigned URLs:', presigned_urls);

      // here is where files are matched with their presigned URLS
      const uploadPromises = Object.keys(presigned_urls).map(async (fileName) => {
        const file = Array.from(files).find(file => file.name === fileName);
        const { presigned_url, file_id } = presigned_urls[fileName];
      
      // here is the actual upload action
        await axios.put(presigned_url, file, {
          headers: {
            'Content-Type': file.type,
          },
        });
        addMessage(`Uploaded ${fileName} successfully.`);
        return file_id;
      });

      const fileIds = await Promise.all(uploadPromises);
      addMessage('All files uploaded successfully.');

      const confirmResponse = await axios.post(`/api/data_hub/confirm_upload`, 
        { file_ids: fileIds }, 
        {
          headers: {
            'X-CSRFToken': csrftoken,
          },
          withCredentials: true
        });
      addMessage(`Upload confirmed for ${confirmResponse.data.confirmed_files.length} files.`);
    } catch (error) {
      const errorMessage = `Error uploading files: ${error.response ? JSON.stringify(error.response.data) : error.message}`;
      addMessage(errorMessage);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <button className="px-10 py-4 mb-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
        onClick={uploadFiles}>Upload Files</button>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
};

export default FileUploadComponent;
