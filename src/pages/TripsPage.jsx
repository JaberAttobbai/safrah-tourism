import React, { useState, useEffect } from 'react';
import TripCard from '../components/trips/TripCard';
import TripFilterBar from '../components/trips/TripFilterBar';
import { trips } from '../data/mockTrips';

const TripsPage = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    region: 'all',
    difficulty: 'all',
    minPrice: 0,
    maxPrice: 5000
  });
  
  const [filteredTrips, setFilteredTrips] = useState(trips);
  
  const handleFilterChange = (filter, value) => {
    if (filter === 'reset') {
      setFilters({
        category: 'all',
        region: 'all',
        difficulty: 'all',
        minPrice: 0,
        maxPrice: 5000
      });
    } else {
      setFilters({ ...filters, [filter]: value });
    }
  };
  
  useEffect(() => {
    let result = [...trips];
    
    if (filters.category !== 'all') {
      result = result.filter(trip => trip.category === filters.category);
    }
    
    if (filters.region !== 'all') {
      result = result.filter(trip => trip.region === filters.region);
    }
    
    if (filters.difficulty !== 'all') {
      result = result.filter(trip => trip.difficulty === filters.difficulty);
    }
    
    result = result.filter(trip => {
      const discountedPrice = trip.discount > 0 
        ? trip.price - (trip.price * trip.discount / 100)
        : trip.price;
      return discountedPrice >= filters.minPrice && discountedPrice <= filters.maxPrice;
    });
    
    setFilteredTrips(result);
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-primary mb-4 relative section-title">
          الرحلات السياحية
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          اكتشفي مجموعة واسعة من الرحلات السياحية المصممة خصيصاً للنساء، مع ضمان الخصوصية والأمان والراحة
        </p>
      </div>
      
      {/* شريط التصفية */}
      <TripFilterBar filters={filters} onFilterChange={handleFilterChange} />
      
      {/* بطاقات الرحلات */}
      {filteredTrips.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <i className="fas fa-compass text-5xl text-gray-300 mb-6"></i>
          <h3 className="text-xl font-bold text-primary mb-2">لا توجد رحلات متطابقة</h3>
          <p className="text-gray-600 mb-6">
            لم نعثر على رحلات تطابق معايير البحث الخاصة بك، جربي تعديل الفلاتر
          </p>
          <button 
            className="bg-primary text-white py-3 px-8 rounded-lg hover:bg-primary/90 transition-all"
            onClick={() => handleFilterChange('reset')}
          >
            إعادة الضبط
          </button>
        </div>
      ) : (
        <>
          <p className="text-right text-sm text-gray-500 mb-4">
            {filteredTrips.length} رحلة متاحة
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </>
      )}
      
      {/* شريط الترويج */}
      <div className="mt-16 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
            <h3 className="text-2xl font-bold mb-4">هل تبحثين عن رحلة خاصة؟</h3>
            <p className="mb-6">
              فريق سفرة جاهز لتصميم رحلة خاصة تناسب احتياجاتك وتوقعاتك، مع مراعاة أعلى معايير الخصوصية والأمان
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-primary py-3 px-6 rounded-lg hover:bg-gray-100 transition-all font-bold">
                تواصلي معنا
              </button>
              <button className="bg-accent text-white py-3 px-6 rounded-lg hover:bg-accent/90 transition-all font-bold">
                اطلبي رحلة مخصصة
              </button>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-center">
                <i className="fas fa-crown text-4xl mb-4"></i>
                <h4 className="text-xl font-bold mb-2">رحلات VIP</h4>
                <p>تجارب فاخرة بمعايير خاصة</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripsPage;
