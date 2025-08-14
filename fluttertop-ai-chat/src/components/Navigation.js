import React from 'react';

const Navigation = () => {
  return (
    <nav className="relative z-50 flex items-center justify-between p-6 lg:px-12">
      <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        FLUTTERTOP
      </div>
      <div className="hidden md:flex items-center space-x-8">
        <a href="#" className="hover:text-blue-400 transition-colors">
          Home page
        </a>
        <a href="#" className="hover:text-blue-400 transition-colors">
          About us
        </a>
        <a href="#" className="hover:text-blue-400 transition-colors">
          Pricing plans
        </a>
        <a href="#" className="hover:text-blue-400 transition-colors">
          Contact us
        </a>
      </div>
    </nav>
  );
};

export default Navigation;