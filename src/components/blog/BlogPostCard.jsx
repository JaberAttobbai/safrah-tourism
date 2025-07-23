import React from 'react';
import { Link } from 'react-router-dom';

const BlogPostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div 
        className="h-48 bg-cover bg-center" 
        style={{ backgroundImage: `url(${post.coverImage})` }}
      ></div>
      <div className="p-6">
        <span className="inline-block bg-accent text-white text-xs px-2 py-1 rounded mb-3">{post.category}</span>
        <h3 className="text-xl font-bold text-primary mb-3">{post.title}</h3>
        <p className="text-gray-600 mb-4">{post.content.substring(0, 100)}...</p>
        <div className="flex items-center text-sm text-gray-500">
          <i className="fas fa-calendar-alt mr-2"></i>
          {post.date}
          <i className="fas fa-user ml-4 mr-2"></i>
          {post.author}
        </div>
      </div>
      <div className="px-6 pb-6">
        <Link 
          to={`/blog/${post.id}`} 
          className="w-full block py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all text-center"
        >
          قراءة المقال
        </Link>
      </div>
    </div>
  );
};

export default BlogPostCard;