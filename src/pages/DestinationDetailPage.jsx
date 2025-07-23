import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { destinations } from '../data/mockDestinations';

const DestinationDetailPage = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundDestination = destinations.find(dest => dest.id === parseInt(id));
    setDestination(foundDestination);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">جاري التحميل...</div>;
  }

  if (!destination) {
    return <div className="text-center py-12">الوجهة غير موجودة</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div 
          className="h-96 bg-cover bg-center" 
          style={{ backgroundImage: `url(${destination.imageUrl})` }}
        ></div>
        <div className="p-8">
          <h1 className="text-3xl font-bold text-primary mb-4">{destination.title}</h1>
          <p className="text-gray-600 mb-6">{destination.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">الموقع</h3>
              <p className="text-gray-700">{destination.location}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">السعر</h3>
              <p className="text-2xl font-bold text-secondary">{destination.price} ر.س</p>
            </div>
          </div>
          
          <button className="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent/90 transition-all font-bold">
            احجز الآن
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;