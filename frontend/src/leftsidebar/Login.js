import React, { useState } from 'react';
import '../main.css';
import axios from 'axios';
import { getCsrfToken } from '../index';


function Login({ onSwitchToSignup, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const csrftoken = await getCsrfToken();
    setErrorMessage('');
    setSuccessMessage('');
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await axios.post(`/api/accounts/login`, formData, {
            headers: {
            'X-CSRFToken': csrftoken,
            },
            withCredentials: true,
        });


      // Check if the login was successful
      if (response.data.status === 'success') {
        setSuccessMessage('Login successful!'); // Set success message
        setTimeout(() => onLoginSuccess(), 1500);
      } else {
        setErrorMessage(response.data.message || 'Login failed'); // Set error message from response
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred during login'); // Set error message from catch block
    }
  };

  return (
    <div className="p-4">
        {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}
          {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{successMessage}</span>
              </div>
            )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-field">
          <label htmlFor="id_username" className="block text-sm font-medium text-gray-700">Username:</label>
          <input 
            type="text" 
            id="id_username" 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={username} 
            onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="id_password" className="block text-sm font-medium text-gray-700">Password:</label>
          <input 
            type="password" 
            id="id_password" 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Log In</button>
      </form>
      
      <p className="mt-2 text-sm text-center">
        Don't have an account?  
        <button 
          onClick={onSwitchToSignup}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
            Sign up
        </button>
        </p>
    </div>
  );
}

export default Login;
