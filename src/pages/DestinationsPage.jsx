import React, { useState } from 'react';
import DestinationCard from '../components/destinations/DestinationCard';
import FilterBar from '../components/destinations/FilterBar';
import { destinations } from '../data/mockDestinations';

const DestinationsPage = () => {
  const [filters, setFilters] = useState({
    region: '',
    featured: false,
    popular: false
  });
  
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };
  
  const filteredDestinations = destinations.filter(destination => {
    if (filters.region && destination.region !== filters.region) return false;
    if (filters.featured && !destination.featured) return false;
    if (filters.popular && !destination.popular) return false;
    return true;
  });
  
  const regions = [
    { id: '', name: 'جميع المناطق' },
    { id: 'north', name: 'شمال المملكة' },
    { id: 'west', name: 'غرب المملكة' },
    { id: 'center', name: 'وسط المملكة' },
    { id: 'south', name: 'جنوب المملكة' },
    { id: 'east', name: 'شرق المملكة' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-primary mb-8 relative section-title">
        وجهات سياحية للنساء
      </h2>
      
      <FilterBar 
        regions={regions} 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDestinations.map(destination => (
          <DestinationCard 
            key={destination.id}
            destination={destination}
          />
        ))}
      </div>
    </div>
  );
};

export default DestinationsPage;