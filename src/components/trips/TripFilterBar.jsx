import React from 'react';

const TripFilterBar = ({ filters, onFilterChange }) => {
  const categories = [
    { id: 'all', name: 'جميع الرحلات', icon: 'fas fa-globe' },
    { id: 'beach', name: 'رحلات شاطئية', icon: 'fas fa-umbrella-beach' },
    { id: 'mountain', name: 'رحلات جبلية', icon: 'fas fa-mountain' },
    { id: 'shopping', name: 'رحلات تسوق', icon: 'fas fa-shopping-bag' },
    { id: 'religious', name: 'رحلات دينية', icon: 'fas fa-kaaba' },
    { id: 'cultural', name: 'رحلات ثقافية', icon: 'fas fa-landmark' }
  ];
  
  const regions = [
    { id: 'all', name: 'جميع المناطق' },
    { id: 'west', name: 'غرب المملكة' },
    { id: 'east', name: 'شرق المملكة' },
    { id: 'center', name: 'وسط المملكة' },
    { id: 'south', name: 'جنوب المملكة' },
    { id: 'north', name: 'شمال المملكة' }
  ];
  
  const difficulties = [
    { id: 'all', name: 'جميع المستويات' },
    { id: 'easy', name: 'سهلة' },
    { id: 'medium', name: 'متوسطة' },
    { id: 'hard', name: 'صعبة' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* التصنيفات */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-3">نوع الرحلة</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category.id}
                className={`w-full text-right py-2 px-4 rounded-lg flex items-center justify-between ${
                  filters.category === category.id
                    ? 'bg-primary text-white'
                    : 'bg-light hover:bg-gray-100'
                }`}
                onClick={() => onFilterChange('category', category.id)}
              >
                <span>{category.name}</span>
                <i className={`${category.icon} ml-2`}></i>
              </button>
            ))}
          </div>
        </div>
        
        {/* المناطق */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-3">المنطقة</h3>
          <div className="space-y-2">
            {regions.map(region => (
              <button
                key={region.id}
                className={`w-full text-right py-2 px-4 rounded-lg ${
                  filters.region === region.id
                    ? 'bg-primary text-white'
                    : 'bg-light hover:bg-gray-100'
                }`}
                onClick={() => onFilterChange('region', region.id)}
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* المستوى */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-3">مستوى الصعوبة</h3>
          <div className="space-y-2">
            {difficulties.map(difficulty => (
              <button
                key={difficulty.id}
                className={`w-full text-right py-2 px-4 rounded-lg ${
                  filters.difficulty === difficulty.id
                    ? 'bg-primary text-white'
                    : 'bg-light hover:bg-gray-100'
                }`}
                onClick={() => onFilterChange('difficulty', difficulty.id)}
              >
                {difficulty.name}
              </button>
            ))}
          </div>
          
          {/* فلتر السعر */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-primary mb-3">السعر</h3>
            <div className="bg-light p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">السعر الأدنى: {filters.minPrice} ر.س</span>
                <span className="text-gray-600">السعر الأقصى: {filters.maxPrice} ر.س</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="5000" 
                value={filters.maxPrice}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <button 
          className="px-5 py-2 bg-white border border-primary text-primary rounded-lg hover:bg-light"
          onClick={() => onFilterChange('reset')}
        >
          إعادة الضبط
        </button>
        <div className="text-gray-600">
          {filters.count} رحلة متاحة
        </div>
      </div>
    </div>
  );
};

export default TripFilterBar;