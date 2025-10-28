import React from 'react';
import { LoadingProps } from '../types';

const Loading: React.FC<LoadingProps> = ({ message = 'Syncing with the Universe...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-10">
      <div className="relative w-30 h-30 mb-8">
        <div className="absolute w-full h-full border-3 border-transparent border-t-primary rounded-full animate-spin"></div>
        <div className="absolute w-4/5 h-4/5 top-[10%] left-[10%] border-3 border-transparent border-t-secondary rounded-full animate-spin-slow" style={{animationDirection: 'reverse'}}></div>
        <div className="absolute w-3/5 h-3/5 top-[20%] left-[20%] border-3 border-transparent border-t-accent rounded-full animate-spin"></div>
        <div className="absolute w-5 h-5 bg-gradient-primary rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-glow animate-pulse-slow"></div>
      </div>
      <p className="text-lg text-gray-400 font-medium animate-pulse-slow">
        {message}
      </p>
    </div>
  );
};

export default Loading;
