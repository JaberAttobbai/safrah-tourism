// src/pages/ProfilePage.jsx
import React, { useState } from 'react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    firstName: "سارة",
    lastName: "أحمد",
    email: "sara.ahmed@example.com",
    phone: "0551234567",
    password: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-primary mb-8">الملف الشخصي</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* لوحة التحكم الجانبية */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4"></div>
              <h3 className="text-xl font-bold">سارة أحمد</h3>
              <p className="text-gray-600">عضو منذ أكتوبر 2022</p>
            </div>
            
            <div className="mt-8 space-y-2">
              <button
                className={`w-full text-right py-3 px-4 rounded-lg ${
                  activeTab === 'personal' ? 'bg-light text-primary font-bold' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('personal')}
              >
                <i className="fas fa-user ml-2"></i> المعلومات الشخصية
              </button>
              <button
                className={`w-full text-right py-3 px-4 rounded-lg ${
                  activeTab === 'security' ? 'bg-light text-primary font-bold' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('security')}
              >
                <i className="fas fa-shield-alt ml-2"></i> الأمان
              </button>
              <button
                className={`w-full text-right py-3 px-4 rounded-lg ${
                  activeTab === 'bookings' ? 'bg-light text-primary font-bold' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('bookings')}
              >
                <i className="fas fa-suitcase ml-2"></i> الحجوزات
              </button>
              <button
                className={`w-full text-right py-3 px-4 rounded-lg ${
                  activeTab === 'favorites' ? 'bg-light text-primary font-bold' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('favorites')}
              >
                <i className="fas fa-heart ml-2"></i> المفضلة
              </button>
              <button
                className="w-full text-right py-3 px-4 rounded-lg text-red-500 hover:bg-red-50"
              >
                <i className="fas fa-sign-out-alt ml-2"></i> تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
        
        {/* محتوى التبويب */}
        <div className="md:w-3/4">
          {activeTab === 'personal' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-primary mb-6">المعلومات الشخصية</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2">الاسم الأول</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">الاسم الأخير</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">رقم الجوال</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="bg-primary text-white py-3 px-8 rounded-lg hover:bg-primary/90 transition-all"
                >
                  حفظ التغييرات
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-primary mb-6">الأمان</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">كلمة المرور الحالية</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">تأكيد كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="bg-primary text-white py-3 px-8 rounded-lg hover:bg-primary/90 transition-all"
                >
                  تغيير كلمة المرور
                </button>
              </form>
            </div>
          )}
          
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-primary mb-6">حجوزاتي</h3>
              <p className="text-gray-600">عرض جميع الحجوزات في صفحة الحجوزات</p>
            </div>
          )}
          
          {activeTab === 'favorites' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-primary mb-6">المفضلة</h3>
              <p className="text-gray-600">عرض الوجهات المفضلة سيتم إضافتها هنا</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;