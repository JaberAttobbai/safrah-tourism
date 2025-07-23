import React from 'react';
import BlogPostCard from '../components/blog/BlogPostCard';
import { blogPosts } from '../data/mockBlogPosts';

const BlogPage = () => {
  const blogFeatures = [
    {
      id: 1,
      icon: 'fas fa-umbrella-beach',
      title: 'الوجهات السياحية',
      description: 'اكتشفي أفضل الوجهات السياحية المناسبة للنساء داخل المملكة'
    },
    {
      id: 2,
      icon: 'fas fa-hotel',
      title: 'الإقامة والمنتجعات',
      description: 'أفضل أماكن الإقامة والمنتجعات النسائية في مختلف مدن المملكة'
    },
    {
      id: 3,
      icon: 'fas fa-utensils',
      title: 'المطاعم والمقاهي',
      description: 'تجارب طعام مميزة في أجواء مريحة وخاصة للنساء'
    },
    {
      id: 4,
      icon: 'fas fa-shopping-bag',
      title: 'التسوق',
      description: 'أماكن التسوق المميزة مع مراعاة خصوصية المرأة'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-primary mb-8 relative section-title">
        مدونة سفرة السياحية
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {blogPosts.map(post => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogFeatures.map(feature => (
          <div key={feature.id} className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-light rounded-full flex items-center justify-center mx-auto mb-4">
              <i className={`${feature.icon} text-primary text-2xl`}></i>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;