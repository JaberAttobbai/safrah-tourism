import React from 'react';

const FilterBar = ({ regions, filters, onFilterChange }) => {
  const handleRegionChange = (e) => {
    onFilterChange({ region: e.target.value });
  };

  const handleFeatureToggle = (filterKey) => {
    onFilterChange({ [filterKey]: !filters[filterKey] });
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      <select 
        value={filters.region} 
        onChange={handleRegionChange}
        className="px-5 py-2 bg-white border border-primary text-primary rounded-full hover:bg-light transition-all"
      >
        {regions.map(region => (
          <option key={region.id} value={region.id}>{region.name}</option>
        ))}
      </select>
      
      <button 
        onClick={() => handleFeatureToggle('featured')}
        className={`px-5 py-2 rounded-full transition-all ${
          filters.featured 
            ? 'bg-primary text-white' 
            : 'bg-white border border-primary text-primary hover:bg-light'
        }`}
      >
        مميز
      </button>
      
      <button 
        onClick={() => handleFeatureToggle('popular')}
        className={`px-5 py-2 rounded-full transition-all ${
          filters.popular 
            ? 'bg-primary text-white' 
            : 'bg-white border border-primary text-primary hover:bg-light'
        }`}
      >
        الأكثر شعبية
      </button>
    </div>
  );
};

export default FilterBar;