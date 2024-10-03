import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import App from './App';
import PlasmidfinderDriver from './tools/plasmidfinder/PlasmidfinderDriver';
import DNAbuilder from './tools/DNAbuilder';
import Login from './leftsidebar/Login';
import Signup from './leftsidebar/Signup';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


let _csrfToken = null;

export async function getCsrfToken(forceRefresh = true) {
  if (_csrfToken === null || forceRefresh) {
    const response = await fetch(`/api/csrf`, {
      credentials: 'include',
    });
    const data = await response.json();
    _csrfToken = data.csrfToken;
  }
  return _csrfToken;
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/plasmidfinder" element={<PlasmidfinderDriver />} />
        <Route path="/dnabuilder" element={<DNAbuilder />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        {/* Other routes */}
      </Routes>
    </Router>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
