import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* معلومات الاتصال */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-accent inline-block">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-accent"></i>
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone mt-1 mr-3 text-accent"></i>
                <span>920003344</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-3 text-accent"></i>
                <span>info@safrah.com</span>
              </li>
            </ul>
            
            <div className="flex space-x-3 mt-6">
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center">
                <i className="fab fa-twitter"></i>
              </button>
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center">
                <i className="fab fa-instagram"></i>
              </button>
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center">
                <i className="fab fa-snapchat-ghost"></i>
              </button>
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center">
                <i className="fab fa-tiktok"></i>
              </button>
            </div>
          </div>
          
          {/* روابط سريعة */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-accent inline-block">روابط سريعة</h3>
            <ul className="space-y-3">
                <li><a href="/" className="hover:text-accent transition-all">الرئيسية</a></li>
                <li><a href="/destinations" className="hover:text-accent transition-all">الوجهات السياحية</a></li>
                <li><a href="/blog" className="hover:text-accent transition-all">المدونة</a></li>
                <li><a href="/guides" className="hover:text-accent transition-all">المرشدات</a></li>
                <li><a href="/contact" className="hover:text-accent transition-all">اتصل بنا</a></li>
            </ul>
          </div>
          
          {/* الوجهات */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-accent inline-block">الوجهات الشعبية</h3>
            <ul className="space-y-3">
              <li><a href="/destination/1" className="hover:text-accent transition-all">جدة</a></li>
              <li><a href="/destination/2" className="hover:text-accent transition-all">الرياض</a></li>
              <li><a href="/destination/3" className="hover:text-accent transition-all">الدمام</a></li>
              <li><a href="/destination/4" className="hover:text-accent transition-all">العلا</a></li>
              <li><a href="/destination/5" className="hover:text-accent transition-all">أبها</a></li>
              <li><a href="/destination/6" className="hover:text-accent transition-all">الطائف</a></li>
            </ul>
          </div>
          
          {/* النشرة البريدية */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b-2 border-accent inline-block">النشرة البريدية</h3>
            <p className="mb-4">اشتراك في النشرة البريدية للحصول على آخر العروض والتحديثات</p>
            <div className="flex mb-3">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none text-gray-800"
              />
              <button className="bg-accent px-4 py-2 rounded-r-lg hover:bg-accent/90 transition-all">
                اشتراك
              </button>
            </div>
            <div className="flex items-center mt-4">
              <input type="checkbox" id="terms" className="mr-2" />
              <label htmlFor="terms" className="text-sm">أوافق على شروط الخصوصية وسياسة الاستخدام</label>
            </div>
          </div>
        </div>
        
        {/* حقوق النشر */}
        <div className="pt-8 border-t border-white/10 text-center text-white/70">
          <p>جميع الحقوق محفوظة © 2023 سفرة - منصة السياحة النسائية السعودية</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;