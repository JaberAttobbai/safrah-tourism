// src/pages/CartPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "رحلة إلى جدة الساحرة",
      price: 800,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 2,
      name: "رحلة إلى العلا التراثية",
      price: 1200,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1543423029-04a98b0bed8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    }
  ]);
  
  const updateQuantity = (id, quantity) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity} : item
    ));
  };
  
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-primary mb-8">سلة التسوق</h2>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <i className="fas fa-shopping-cart text-5xl text-gray-300 mb-4"></i>
          <p className="text-xl text-gray-600">سلة التسوق فارغة</p>
          <Link 
            to="/destinations" 
            className="mt-6 inline-block bg-primary text-white py-3 px-8 rounded-lg hover:bg-primary/90 transition-all"
          >
            تصفح الوجهات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* قائمة العناصر */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-100">
                {cartItems.map(item => (
                  <div key={item.id} className="p-6 flex items-center">
                    <div 
                      className="w-24 h-24 bg-cover bg-center rounded-lg"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    
                    <div className="mr-4 flex-grow">
                      <h3 className="text-lg font-bold text-primary">{item.name}</h3>
                      <div className="text-xl font-bold text-secondary mt-2">{item.price} ر.س</div>
                    </div>
                    
                    <div className="flex items-center">
                      <button 
                        className="w-8 h-8 rounded-full bg-light flex items-center justify-center"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        <i className="fas fa-minus text-sm"></i>
                      </button>
                      <span className="mx-3 w-8 text-center">{item.quantity}</span>
                      <button 
                        className="w-8 h-8 rounded-full bg-light flex items-center justify-center"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <i className="fas fa-plus text-sm"></i>
                      </button>
                    </div>
                    
                    <button 
                      className="ml-6 text-red-500 hover:text-red-700"
                      onClick={() => removeItem(item.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* ملخص الطلب */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-primary mb-6">ملخص الطلب</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span>{subtotal} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span>الضريبة (15%)</span>
                  <span>{tax.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-4 font-bold text-lg">
                  <span>الإجمالي</span>
                  <span>{total.toFixed(2)} ر.س</span>
                </div>
              </div>
              
              <button className="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent/90 transition-all font-bold mb-4">
                إتمام الشراء
              </button>
              
              <Link 
                to="/destinations" 
                className="block text-center text-primary hover:underline"
              >
                استمر بالتسوق
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;