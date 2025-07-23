import React, { useState } from 'react';
import DestinationCard from '../components/destinations/DestinationCard';
import { destinations } from '../data/mockDestinations';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const features = [
    {
      id: 1,
      icon: 'fas fa-shield-alt',
      title: 'خصوصية وأمان',
      description: 'جميع خدماتنا مخصصة للنساء فقط مع سائقات ومرشدات سياحيات لتضمني راحتكِ وأمانكِ'
    },
    {
      id: 2,
      icon: 'fas fa-umbrella-beach',
      title: 'تجارب حصرية',
      description: 'استمتعي برحلات مصممة خصيصاً للنساء في أفضل الوجهات السياحية بالمملكة'
    },
    {
      id: 3,
      icon: 'fas fa-hands-helping',
      title: 'دعم متكامل',
      description: 'فريق دعم نسائي متاح 24/7 لمساعدتكِ في أي استفسار أو طوارئ خلال رحلتكِ'
    }
  ];
  
  const filteredDestinations = destinations.filter(destination => 
    destination.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      {/* القسم الرئيسي */}
      <section 
        className="bg-cover bg-center text-white py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(106, 27, 154, 0.8), rgba(171, 71, 188, 0.8)), url('https://images.unsplash.com/photo-1580502304784-8985b7eb7260?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">رحلات سياحية خاصة بالنساء في السعودية</h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto">استمتعي بتجارب سفر فريدة مع ضمان الخصوصية والأمان والراحة</p>
          
          {/* شريط البحث */}
          <div className="bg-white rounded-full p-1 shadow-xl max-w-3xl mx-auto flex">
            <input 
              type="text" 
              placeholder="ابحثي عن وجهة أو رحلة..." 
              className="flex-grow px-6 py-3 rounded-full text-gray-800 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-accent text-white rounded-full px-8 py-3 font-bold hover:bg-accent/90 transition-all">
              <i className="fas fa-search ml-2"></i> ابحثي الآن
            </button>
          </div>
          
          {/* أزرار إضافية في القسم الرئيسي */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all">
              <i className="fas fa-umbrella-beach ml-2"></i> رحلات شاطئية
            </button>
            <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all">
              <i className="fas fa-mountain ml-2"></i> رحلات جبلية
            </button>
            <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all">
              <i className="fas fa-kaaba ml-2"></i> رحلات دينية
            </button>
            <button className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all">
              <i className="fas fa-shopping-bag ml-2"></i> رحلات تسوق
            </button>
          </div>
        </div>
      </section>

      {/* مميزات المنصة */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-16 relative section-title">لماذا تختارين سفرة؟</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(feature => (
              <div 
                key={feature.id}
                className="bg-white rounded-xl shadow-lg p-8 text-center transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-20 h-20 bg-light rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className={`${feature.icon} text-primary text-3xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          
          {/* أزرار إضافية */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <button className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-all font-medium">
              <i className="fas fa-video ml-2"></i> جولة افتراضية
            </button>
            <button className="px-6 py-3 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all font-medium">
              <i className="fas fa-calendar-alt ml-2"></i> حجز موعد
            </button>
            <button className="px-6 py-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-all font-medium">
              <i className="fas fa-headset ml-2"></i> دعم مباشر
            </button>
          </div>
        </div>
      </section>

      {/* الوجهات السياحية */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-16 relative section-title">أشهر الوجهات للنساء</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredDestinations.slice(0, 3).map(destination => (
              <DestinationCard 
                key={destination.id}
                destination={destination}
              />
            ))}
          </div>
          
          {/* أزرار تصفية */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            <button className="px-5 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-all">
              جميع الوجهات
            </button>
            <button className="px-5 py-2 bg-white border border-primary text-primary rounded-full hover:bg-light transition-all">
              الأكثر طلباً
            </button>
            <button className="px-5 py-2 bg-white border border-primary text-primary rounded-full hover:bg-light transition-all">
              العروض الخاصة
            </button>
            <button className="px-5 py-2 bg-white border border-primary text-primary rounded-full hover:bg-light transition-all">
              الوجهات الجديدة
            </button>
            <button className="px-5 py-2 bg-white border border-primary text-primary rounded-full hover:bg-light transition-all">
              رحلات اقتصادية
            </button>
          </div>
        </div>
      </section>

      {/* قسم التطبيق */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-right">
              <h2 className="text-3xl font-bold mb-4">حملي تطبيق سفرة الآن</h2>
              <p className="text-xl mb-8 max-w-md mx-auto md:mr-0">احصلي على تجربة مميزة وعروض حصرية من خلال تطبيقنا المخصص للنساء</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button className="px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-all flex items-center">
                  <i className="fab fa-apple text-2xl mr-2"></i>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="font-bold">App Store</div>
                  </div>
                </button>
                
                <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all flex items-center">
                  <i className="fab fa-google-play text-2xl mr-2"></i>
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="font-bold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-accent/20 rounded-full"></div>
                <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-accent/20 rounded-full"></div>
                <div className="relative bg-gray-800 border-8 border-gray-900 rounded-3xl w-64 h-96">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl"></div>
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-4">سفرة</div>
                      <div className="text-sm opacity-75">منصة السياحة السعودية للنساء</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;