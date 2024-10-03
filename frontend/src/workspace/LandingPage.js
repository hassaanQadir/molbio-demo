import React, { useState } from 'react';
import Signup from '../leftsidebar/Signup';
import Login from '../leftsidebar/Login';

const LandingPage = ({ title, content }) => {
    const [currentComponent, setCurrentComponent] = useState('none'); // none, signup, login
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const showSignup = () => setCurrentComponent('signup');
    const showLogin = () => setCurrentComponent('login');
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setCurrentComponent('none');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
             <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to molbio.ai!</h1>
            <div className="text-center mb-8">
                <p>{content}</p>
            </div>

            {currentComponent === 'none' && !isLoggedIn && (
                <div>
                <button
                    onClick={showSignup}
                    className="px-10 py-4 mb-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Sign up for a free account!
                </button>
                <p className="mt-2 text-sm text-center">
                Already have an account?  
                <button 
                  onClick={showLogin}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                   Log in
                </button>
                </p>
                </div>
                
            )}

            {currentComponent === 'signup' && (
                <Signup onSwitchToLogin={showLogin} onLoginSuccess={handleLoginSuccess} />
            )}

            {currentComponent === 'login' && (
                <Login onSwitchToSignup={showSignup} onLoginSuccess={handleLoginSuccess} />
            )}

        </div>
    );
};

export default LandingPage;
