import React, { useState, useEffect } from 'react';

export interface AsteroidFilterState {
  hazardous: 'all' | 'yes' | 'no';
  sizeMaxKm: number; // upper bound
  velocityMinKmh: number; // lower bound
  searchName: string;
}

interface AsteroidFilterProps {
  value?: AsteroidFilterState;
  onChange: (value: AsteroidFilterState) => void;
  className?: string;
}

const DEFAULT: AsteroidFilterState = {
  hazardous: 'all',
  sizeMaxKm: 10,
  velocityMinKmh: 0,
  searchName: '',
};

const AsteroidFilter: React.FC<AsteroidFilterProps> = ({ value, onChange, className = '' }) => {
  const [state, setState] = useState<AsteroidFilterState>(value || DEFAULT);

  useEffect(() => {
    if (value) setState(value);
  }, [value]);

  useEffect(() => {
    onChange(state);
  }, [state]);

  return (
    <div className={`flex flex-wrap items-end gap-3 ${className}`}>
      <div className="flex flex-col">
        <label className="text-xs text-gray-400 mb-1">Hazardous</label>
        <select
          className="bg-dark-card border border-primary/30 rounded-lg px-3 py-2 text-sm text-white"
          value={state.hazardous}
          onChange={(e) => setState({ ...state, hazardous: e.target.value as AsteroidFilterState['hazardous'] })}
        >
          <option value="all">All</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-400 mb-1">Max Size (km)</label>
        <input
          type="number"
          min={0}
          step={0.1}
          value={state.sizeMaxKm}
          onChange={(e) => setState({ ...state, sizeMaxKm: Number(e.target.value || 0) })}
          className="bg-dark-card border border-primary/30 rounded-lg px-3 py-2 text-sm text-white w-32"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-400 mb-1">Min Velocity (km/h)</label>
        <input
          type="number"
          min={0}
          step={1000}
          value={state.velocityMinKmh}
          onChange={(e) => setState({ ...state, velocityMinKmh: Number(e.target.value || 0) })}
          className="bg-dark-card border border-primary/30 rounded-lg px-3 py-2 text-sm text-white w-40"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-400 mb-1">Search Name</label>
        <input
          type="text"
          placeholder="e.g. 2024 AB"
          value={state.searchName}
          onChange={(e) => setState({ ...state, searchName: e.target.value })}
          className="bg-dark-card border border-primary/30 rounded-lg px-3 py-2 text-sm text-white w-48"
        />
      </div>
    </div>
  );
};

export default AsteroidFilter;
