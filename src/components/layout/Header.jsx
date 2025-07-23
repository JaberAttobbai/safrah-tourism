import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gradient-to-r from-primary to-secondary text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* الشعار وزر القائمة للجوال */}
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
            <div className="flex items-center space-x-2">
              <i className="fas fa-map-marked-alt text-accent text-2xl"></i>
              <Link to="/" className="text-2xl font-bold">سفرة</Link>
            </div>
          </div>
          
          {/* أزرار التنقل (للشاشات المتوسطة فما فوق) */}
          <nav className="hidden md:flex flex-wrap justify-center gap-1">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-full hover:bg-white/10 transition-all ${isActive('/') ? 'bg-white/20 shadow' : ''}`}
            >
              <i className="fas fa-home ml-2"></i> الرئيسية
            </Link>
            <Link 
              to="/destinations" 
              className={`px-4 py-2 rounded-full hover:bg-white/10 transition-all ${isActive('/destinations') ? 'bg-white/20 shadow' : ''}`}
            >
              <i className="fas fa-map-marked-alt ml-2"></i> الوجهات
            </Link>
            <Link 
              to="/trips" 
              className={`px-4 py-2 rounded-full hover:bg-white/10 transition-all ${isActive('/trips') ? 'bg-white/20 shadow' : ''}`}
            >
              <i className="fas fa-suitcase-rolling ml-2"></i> الرحلات
            </Link>
            <Link 
              to="/guides" 
              className={`px-4 py-2 rounded-full hover:bg-white/10 transition-all ${isActive('/guides') ? 'bg-white/20 shadow' : ''}`}
            >
              <i className="fas fa-user-friends ml-2"></i> المرشدات
            </Link>
            <Link 
              to="/blog" 
              className={`px-4 py-2 rounded-full hover:bg-white/10 transition-all ${isActive('/blog') ? 'bg-white/20 shadow' : ''}`}
            >
              <i className="fas fa-newspaper ml-2"></i> المدونة
            </Link>
          </nav>
          
          {/* أزرار الحساب */}
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex space-x-2">
              <Link 
                to="/login" 
                className="px-4 py-2 border-2 border-white rounded-full hover:bg-white/10 transition-all"
              >
                <i className="fas fa-sign-in-alt ml-2"></i> تسجيل دخول
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 bg-accent rounded-full hover:bg-accent/90 transition-all font-bold"
              >
                <i className="fas fa-user-plus ml-2"></i> حساب جديد
              </Link>
            </div>
            
            <div className="flex space-x-2">
              <Link 
                to="/cart" 
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all relative"
              >
                <i className="fas fa-shopping-cart"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </Link>
              <Link 
                to="/profile" 
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
              >
                <i className="fas fa-user"></i>
              </Link>                 
              <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* قائمة الجوال */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-2">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-full hover:bg-white/10 transition-all ${isActive('/') ? 'bg-white/20 shadow' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fas fa-home ml-2"></i> الرئيسية
            </Link>
            <Link 
              to="/destinations" 
              className={`px-4 py-2 rounded-full hover:bg-white/10 transition-all ${isActive('/destinations') ? 'bg-white/20 shadow' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fas fa-map-marked-alt ml-2"></i> الوجهات
            </Link>
            <Link 
              to="/trips" 
              className={`px-4 py-2 rounded-full hover:bg-white/10 transition-all ${isActive('/trips') ? 'bg-white/20 shadow' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fas fa-suitcase-rolling ml-2"></i> الرحلات
            </Link>
            <Link 
              to="/guides" 
              className={`px-4 py-2 rounded-full hover:bg-white/10 transition-all ${isActive('/guides') ? 'bg-white/20 shadow' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fas fa-user-friends ml-2"></i> المرشدات
            </Link>
            <Link 
              to="/blog" 
              className={`px-4 py-2 rounded-full hover:bg-white/10 transition-all ${isActive('/blog') ? 'bg-white/20 shadow' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fas fa-newspaper ml-2"></i> المدونة
            </Link>
            <div className="flex gap-2 mt-2">
              <Link 
                to="/login" 
                className="flex-1 text-center px-4 py-2 border-2 border-white rounded-full hover:bg-white/10 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-sign-in-alt ml-2"></i> تسجيل دخول
              </Link>
              <Link 
                to="/signup" 
                className="flex-1 text-center px-4 py-2 bg-accent rounded-full hover:bg-accent/90 transition-all font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-user-plus ml-2"></i> حساب جديد
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;