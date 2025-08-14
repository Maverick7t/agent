import React from 'react';

const FeatureCard = ({ icon, title, description, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500/20 to-purple-600/20 border-blue-500/30',
    purple: 'from-purple-500/20 to-pink-600/20 border-purple-500/30',
    pink: 'from-pink-500/20 to-red-600/20 border-pink-500/30',
  };

  return (
    <div
      className={`relative p-6 rounded-2xl backdrop-blur-lg bg-gradient-to-br ${colorClasses[color]} border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
    >
      <div className="flex items-center mb-4">
        <div
          className={`p-3 rounded-xl bg-gradient-to-r ${color === 'blue'
              ? 'from-blue-500 to-purple-600'
              : color === 'purple'
                ? 'from-purple-500 to-pink-600'
                : 'from-pink-500 to-red-600'
            } shadow-lg`}
        >
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
        {title}
      </h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;