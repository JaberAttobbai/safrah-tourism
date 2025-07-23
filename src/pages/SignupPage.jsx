import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup submitted', {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      agreeToTerms
    });
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">إنشاء حساب جديد</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">الاسم الأول</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="سارة"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required 
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">الاسم الأخير</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="أحمد"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">البريد الإلكتروني</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">رقم الجوال</label>
            <input 
              type="tel" 
              className="form-input" 
              placeholder="05XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">كلمة المرور</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">تأكيد كلمة المرور</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="flex items-start">
              <input 
                type="checkbox" 
                className="form-checkbox text-primary rounded mt-1" 
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <span className="mr-2 text-gray-700">أوافق على شروط الاستخدام وسياسة الخصوصية</span>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-accent text-white py-3 rounded-xl hover:bg-accent/90 transition-all font-bold mb-4"
          >
            إنشاء حساب
          </button>
          
          <div className="text-center mt-6">
            <span className="text-gray-600">لديك حساب بالفعل؟</span>
            <Link to="/login" className="text-secondary font-bold hover:underline mr-2">
              تسجيل الدخول
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;