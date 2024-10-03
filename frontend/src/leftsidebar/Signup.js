import React, { useState } from 'react';
import '../main.css';
import axios from 'axios'; // Import axios for making HTTP requests
import { getCsrfToken } from '../index';



function Signup({ onSwitchToLogin, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const [successMessage, setSuccessMessage] = useState('');


  const handleSubmit = async (event) => {
    event.preventDefault();
    const csrftoken = await getCsrfToken();
    const formData = new FormData();
    setErrorMessage({});
    setSuccessMessage('');
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password1', password1);
    formData.append('password2', password2);
  
    try {
      const response = await axios.post(`/api/accounts/signup`, formData, {
        headers: {
        'X-CSRFToken': csrftoken,
        },
        withCredentials: true,
    });

      // Check if the login was successful
      if (response.data.status === 'success') {
        setSuccessMessage('Signup successful!'); // Set success message
        setTimeout(() => onLoginSuccess(), 1500);
      } else {
        setErrorMessage(response.data.errors || {'form': 'Signup failed'});
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.errors || {'form': 'An error occurred'});
    }
  };

  return (
    <div className="p-4">
              {Object.keys(errorMessage).length > 0 && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error! </strong>
                <ul>
                  {Object.entries(errorMessage).map(([field, message]) => (
                    <li key={field}>{field}: {message}</li>
                  ))}
                </ul>
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
                <label htmlFor="id_email" className="block text-sm font-medium text-gray-700">Email:</label>
                <input 
                    type="email" 
                    id="id_email" 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-field">
                <label htmlFor="id_password1" className="block text-sm font-medium text-gray-700">Password:</label>
                <input
                    type="password"
                    id="id_password1"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={password1}
                    onChange={(e) => setPassword1(e.target.value)} />
            </div>
            <div className="form-field">
                <label htmlFor="id_password2" className="block text-sm font-medium text-gray-700">Confirm Password:</label>
                <input
                    type="password"
                    id="id_password2"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)} />
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Create Account</button>
        </form>

        <p className="mt-2 text-sm text-center">
        Already have an account?  
        <button 
          onClick={onSwitchToLogin}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
           Log in
        </button>
        </p>
    </div>
);
}

export default Signup;