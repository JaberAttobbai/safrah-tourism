import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted', { email, password, rememberMe });
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">تسجيل الدخول</h2>
        
        <form onSubmit={handleSubmit}>
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
          
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox text-primary rounded" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="mr-2 text-gray-700">تذكرني</span>
            </label>
            
            <a href="#" className="text-secondary hover:underline">نسيت كلمة المرور؟</a>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-primary text-white py-3 rounded-xl hover:bg-primary/90 transition-all font-bold mb-4"
          >
            تسجيل الدخول
          </button>
          
          <div className="text-center text-gray-600 mb-4">أو</div>
          
          <button 
            type="button" 
            className="w-full flex items-center justify-center bg-white border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition-all mb-4"
          >
            <i className="fab fa-google text-red-500 text-xl mr-2"></i>
            تسجيل الدخول بواسطة Google
          </button>
          
          <div className="text-center mt-6">
            <span className="text-gray-600">ليس لديك حساب؟</span>
            <Link to="/signup" className="text-secondary font-bold hover:underline mr-2">
              أنشئ حساب جديد
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;