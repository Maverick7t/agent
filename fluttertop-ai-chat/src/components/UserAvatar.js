import React from 'react';

const UserAvatar = ({ src, className = '' }) => (
  <div
    className={`w-12 h-12 rounded-full border-2 border-white/50 overflow-hidden shadow-lg ${className}`}
  >
    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold">
      {src || 'U'}
    </div>
  </div>
);

export default UserAvatar;