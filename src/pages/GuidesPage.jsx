// src/pages/GuidesPage.jsx
import React, { useState } from 'react';
import GuideCard from '../components/guides/GuideCard';
import { guides } from '../data/mockGuides';

const GuidesPage = () => {
  const [activeRegion, setActiveRegion] = useState('all');
  
  const regions = [
    { id: 'all', name: 'جميع المناطق' },
    { id: 'north', name: 'شمال المملكة' },
    { id: 'west', name: 'غرب المملكة' },
    { id: 'center', name: 'وسط المملكة' },
    { id: 'south', name: 'جنوب المملكة' }
  ];
  
  const filteredGuides = activeRegion === 'all' 
    ? guides 
    : guides.filter(guide => guide.regions.includes(activeRegion));

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-primary mb-8 relative section-title">
        المرشدات السياحيات
      </h2>
      
      {/* أزرار التصفية */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {regions.map(region => (
          <button
            key={region.id}
            className={`px-5 py-2 rounded-full transition-all ${
              activeRegion === region.id
                ? 'bg-primary text-white'
                : 'bg-white border border-primary text-primary hover:bg-light'
            }`}
            onClick={() => setActiveRegion(region.id)}
          >
            {region.name}
          </button>
        ))}
      </div>
      
      {/* بطاقات المرشدات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGuides.map(guide => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </div>
  );
};

export default GuidesPage;