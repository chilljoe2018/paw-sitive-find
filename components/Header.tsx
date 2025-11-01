import React from 'react';
import { User } from 'firebase/auth';

interface HeaderProps {
    onLogoClick: () => void;
    user: User | null;
    onSignIn: () => void;
    onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, user, onSignIn, onSignOut }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="text-2xl font-bold text-indigo-600 cursor-pointer"
          onClick={onLogoClick}
        >
          🐾 Paw-sitive Find
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Resources</a>
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Nearby Pets</a>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Hi, {user.displayName?.split(' ')[0]}</span>
              <button onClick={onSignOut} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={onSignIn} className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors">
              Sign In with Google
            </button>
          )}
        </nav>
        <button className="md:hidden text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;