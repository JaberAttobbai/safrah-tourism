import React from 'react';
import { Link } from 'react-router-dom';

const TripCard = ({ trip }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2">
      <div className="relative">
        <div 
          className="h-56 bg-cover bg-center"
          style={{ backgroundImage: `url(${trip.imageUrl})` }}
        ></div>
        
        {trip.discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white font-bold py-1 px-3 rounded-full">
            خصم {trip.discount}%
          </div>
        )}
        
        {trip.featured && (
          <div className="absolute top-4 right-4 bg-purple-500 text-white font-bold py-1 px-3 rounded-full">
            مميزة
          </div>
        )}
        
        {trip.popular && (
          <div className="absolute bottom-4 left-4 bg-accent text-white font-bold py-1 px-3 rounded-full">
            الأكثر طلباً
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-primary">{trip.title}</h3>
          <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            <i className="fas fa-star mr-1"></i>
            <span>{trip.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">{trip.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <i className="fas fa-map-marker-alt text-primary mr-2"></i>
            <span>{trip.region}</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-clock text-primary mr-2"></i>
            <span>{trip.duration}</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-users text-primary mr-2"></i>
            <span>{trip.travelers}</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-hiking text-primary mr-2"></i>
            <span>{trip.difficulty}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-bold text-primary mb-2">يشمل الرحلة:</h4>
          <ul className="grid grid-cols-2 gap-1">
            {trip.included.slice(0, 4).map((item, index) => (
              <li key={index} className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2 text-sm"></i>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            {trip.discount > 0 ? (
              <div>
                <span className="text-lg font-bold text-secondary">
                  {trip.price - (trip.price * trip.discount / 100)} ر.س
                </span>
                <span className="line-through text-gray-500 ml-2">
                  {trip.price} ر.س
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-secondary">
                {trip.price} ر.س
              </span>
            )}
            <div className="text-sm text-gray-500">لكل شخص</div>
          </div>
          
          <Link 
            to={`/trip/${trip.id}`}
            className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/90 transition-all"
          >
            التفاصيل
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;