// src/pages/BookingsPage.jsx
import React, { useState } from 'react';

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const bookings = [
    {
      id: 1,
      destination: "جدة الساحرة",
      date: "15 أكتوبر 2023",
      travelers: 2,
      price: 1600,
      status: "تم التأكيد",
      image: "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 2,
      destination: "العلا التراثية",
      date: "5 نوفمبر 2023",
      travelers: 3,
      price: 3600,
      status: "قيد المراجعة",
      image: "https://images.unsplash.com/photo-1543423029-04a98b0bed8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 3,
      destination: "الرياض العصرية",
      date: "20 سبتمبر 2023",
      travelers: 1,
      price: 900,
      status: "مكتمل",
      image: "https://images.unsplash.com/photo-1620121692029-d860b6d120f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    }
  ];
  
  const filteredBookings = activeTab === 'upcoming'
    ? bookings.filter(b => b.status !== "مكتمل")
    : bookings.filter(b => b.status === "مكتمل");

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-primary mb-8">حجوزاتي</h2>
      
      {/* علامات التبويب */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-3 px-6 font-medium relative ${
            activeTab === 'upcoming'
              ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-primary'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          الحجوزات القادمة
        </button>
        <button
          className={`py-3 px-6 font-medium relative ${
            activeTab === 'past'
              ? 'text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-primary'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('past')}
        >
          الحجوزات السابقة
        </button>
      </div>
      
      {/* قائمة الحجوزات */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-calendar-check text-5xl text-gray-300 mb-4"></i>
            <p className="text-xl text-gray-600">
              {activeTab === 'upcoming' 
                ? 'لا توجد حجوزات قادمة' 
                : 'لا توجد حجوزات سابقة'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredBookings.map(booking => (
              <div key={booking.id} className="p-6 flex flex-col md:flex-row items-start">
                <div 
                  className="w-full md:w-40 h-40 bg-cover bg-center rounded-lg mb-4 md:mb-0"
                  style={{ backgroundImage: `url(${booking.image})` }}
                ></div>
                
                <div className="md:mr-4 flex-grow">
                  <h3 className="text-xl font-bold text-primary">{booking.destination}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <div className="text-gray-600">تاريخ الرحلة</div>
                      <div className="font-medium">{booking.date}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">عدد المسافرين</div>
                      <div className="font-medium">{booking.travelers} أشخاص</div>
                    </div>
                    <div>
                      <div className="text-gray-600">السعر</div>
                      <div className="font-bold text-secondary">{booking.price} ر.س</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      booking.status === "تم التأكيد" ? "bg-green-100 text-green-800" :
                      booking.status === "قيد المراجعة" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <button className="px-4 py-2 bg-light rounded-lg hover:bg-gray-100 transition-all">
                    تفاصيل الحجز
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;