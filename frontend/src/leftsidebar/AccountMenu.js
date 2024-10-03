import React, { useState } from 'react';
import Signup from './Signup.js';
import Login from './Login.js';

const AccountMenu = () => {
    const [menuState, setMenuState] = useState('closed'); // 'signup', 'login', 'closed'
    // eslint-disable-next-line
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const openSignup = () => setMenuState('signup');
    const openLogin = () => setMenuState('login');

    const menuBottomPosition = 'bottom-14'; 

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setMenuState('closed');
    };

    return (
        <div className="absolute bottom-0 left-0 mb-4 ml-4">
            <div className="relative">
                {/* User Icon Button */}
                <button
                    onClick={() => setMenuState(menuState !== 'closed' ? 'closed' : 'open')}
                    className="z-10 flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full hover:bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="User Account"
                >
                    {/* Placeholder for Profile Icon */}
                    <span className="text-xl">👤</span>
                </button>

                {/* Menu for Signup/Login */}
                {menuState === 'open' && (
                    <div className={`absolute left-0 ${menuBottomPosition} w-48 py-2 bg-white rounded-lg shadow-lg`}>
                        <button
                            onClick={openSignup}
                            className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                        >
                            Signup
                        </button>
                        <button
                            onClick={openLogin}
                            className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                        >
                            Login
                        </button>
                    </div>
                )}

                {/* Signup or Login Component */}
                {menuState === 'signup' && (
                    <div className={`absolute left-0 ${menuBottomPosition} w-48 py-2 bg-white rounded-lg shadow-lg`}>
                        <Signup onSwitchToLogin={openLogin} onLoginSuccess={handleLoginSuccess}/>
                    </div>
                )}
                {menuState === 'login' && (
                    <div className={`absolute left-0 ${menuBottomPosition} w-48 py-2 bg-white rounded-lg shadow-lg`}>
                        <Login onSwitchToSignup={openSignup} onLoginSuccess={handleLoginSuccess} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountMenu;
