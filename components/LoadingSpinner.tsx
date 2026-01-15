
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="text-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-teal-500 mx-auto"></div>
        <h3 className="font-cinzel text-xl tracking-wider text-slate-300 mt-4">Generating Persona...</h3>
        <p className="text-slate-400">The AI is weaving your legend.</p>
    </div>
  );
};

export default LoadingSpinner;
