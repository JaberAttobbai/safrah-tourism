import React from 'react';
import { Link } from 'react-router-dom';

const DestinationCard = ({ destination }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2">
      <div 
        className="h-56 bg-cover bg-center" 
        style={{ backgroundImage: `url(${destination.imageUrl})` }}
      ></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-primary">{destination.title}</h3>
          {destination.popular && (
            <span className="bg-accent text-white text-sm px-3 py-1 rounded-full">الأكثر طلباً</span>
          )}
        </div>
        <p className="text-gray-600 mb-4">{destination.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-secondary">
            {destination.price} ر.س
          </span>
          <div className="flex items-center">
            <i className="fas fa-star text-yellow-400"></i>
            <span className="ml-1">{destination.rating}</span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-6 flex gap-2">
        <Link 
          to={`/destination/${destination.id}`}
          className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all text-center"
        >
          التفاصيل
        </Link>
        <button className="flex-1 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all">
          الحجز
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;