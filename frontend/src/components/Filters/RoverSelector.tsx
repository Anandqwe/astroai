import React from 'react';

interface RoverSelectorProps {
  value: 'curiosity' | 'perseverance' | 'opportunity' | 'spirit';
  onChange: (value: 'curiosity' | 'perseverance' | 'opportunity' | 'spirit') => void;
  className?: string;
}

const RoverSelector: React.FC<RoverSelectorProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-gray-300 text-sm">Rover</span>
      <select
        className="bg-dark-card border border-primary/30 rounded-lg px-3 py-2 text-sm text-white"
        value={value}
        onChange={(e) => onChange(e.target.value as RoverSelectorProps['value'])}
      >
        <option value="curiosity">Curiosity</option>
        <option value="perseverance">Perseverance</option>
        <option value="opportunity">Opportunity</option>
        <option value="spirit">Spirit</option>
      </select>
    </div>
  );
};

export default RoverSelector;
