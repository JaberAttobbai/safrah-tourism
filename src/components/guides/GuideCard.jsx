// src/components/guides/GuideCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const GuideCard = ({ guide }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-light rounded-full flex items-center justify-center mr-4">
            {guide.profileImage ? (
              <img 
                src={guide.profileImage} 
                alt={guide.name} 
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <i className="fas fa-user text-primary text-2xl"></i>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">{guide.name}</h3>
            <div className="text-sm text-gray-500">{guide.city}</div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{guide.bio || 'مرشدة سياحية محترفة'}</p>
        
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2">التخصصات</div>
          <div className="flex flex-wrap gap-2">
            {guide.specialties && guide.specialties.slice(0, 3).map((specialty, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-light text-primary rounded-full text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <i className="fas fa-star text-yellow-400"></i>
            <span className="ml-1">{guide.rating || '4.9'}</span>
            <span className="mx-2 text-gray-300">|</span>
            <i className="fas fa-users text-gray-500"></i>
            <span className="ml-1">{guide.tripsCount || '24'} رحلة</span>
          </div>
          
          <Link 
            to={`/guides/${guide._id}`} 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
          >
            الملف الشخصي
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuideCard;