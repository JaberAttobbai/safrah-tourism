// src/pages/BlogPostPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/mockBlogPosts';

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundPost = blogPosts.find(p => p.id === parseInt(id));
    if (foundPost) {
      setPost(foundPost);
      setRelatedPosts(
        blogPosts
          .filter(p => p.id !== parseInt(id) && p.category === foundPost.category)
          .slice(0, 3)
      );
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">جاري التحميل...</div>;
  }

  if (!post) {
    return <div className="text-center py-20">المقال غير موجود</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* صورة المقال */}
        <div 
          className="h-96 rounded-2xl overflow-hidden mb-8"
          style={{ backgroundImage: `url(${post.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        ></div>
        
        {/* معلومات المقال */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="inline-block bg-accent text-white text-sm px-3 py-1 rounded-full mb-3">
              {post.category}
            </span>
            <h1 className="text-3xl font-bold text-primary">{post.title}</h1>
          </div>
          <div className="text-right">
            <div className="text-gray-600">
              <i className="fas fa-calendar-alt mr-2"></i>
              {post.date}
            </div>
            <div className="text-gray-600">
              <i className="fas fa-user mr-2"></i>
              {post.author}
            </div>
          </div>
        </div>
        
        {/* محتوى المقال */}
        <div className="prose max-w-none text-gray-700 mb-12">
          <p className="mb-4">{post.content}</p>
          
          <p className="mb-4">
            هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، 
            حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.
          </p>
          
          <h2 className="text-2xl font-bold text-primary my-6">عنوان فرعي</h2>
          
          <p className="mb-4">
            إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، 
            النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص، 
            حيث يحتاج العميل فى كثير من الأحيان أن يطلع على صورة حقيقية لتصميم الموقع.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            <div className="bg-light p-4 rounded-xl">
              <h3 className="text-xl font-bold text-primary mb-2">نصيحة مهمة</h3>
              <p>هذا النص يمكن أن يتم تركيبه على أي تصميم دون مشكلة فلن يبدو وكأنه نص منسوخ</p>
            </div>
            <div className="bg-light p-4 rounded-xl">
              <h3 className="text-xl font-bold text-primary mb-2">نصيحة أخرى</h3>
              <p>هذا النص يمكن أن يتم تركيبه على أي تصميم دون مشكلة فلن يبدو وكأنه نص منسوخ</p>
            </div>
          </div>
          
          <p className="mb-4">
            ومن هنا وجب على المصمم أن يضع نصوصا مؤقتة على التصميم ليظهر للعميل الشكل كاملاً،
            دور مولد النص العربى أن يوفر على المصمم عناء البحث عن نص بديل لا علاقة له بالموضوع 
            الذى يتحدث عنه التصميم فيظهر بشكل لا يليق.
          </p>
        </div>
        
        {/* مقالات ذات صلة */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6">مقالات ذات صلة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(related => (
              <Link 
                key={related.id} 
                to={`/blog/${related.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <div 
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${related.coverImage})` }}
                ></div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-primary">{related.title}</h3>
                  <p className="text-gray-600 text-sm mt-2">{related.content.substring(0, 80)}...</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* تعليقات */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-primary mb-6">التعليقات (3)</h2>
          
          <div className="space-y-6 mb-8">
            {/* تعليق 1 */}
            <div className="flex">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
              <div className="mr-4">
                <div className="font-bold">سارة محمد</div>
                <div className="text-gray-600 text-sm">منذ 3 أيام</div>
                <p className="mt-2 text-gray-700">مقال رائع ومفيد جداً، شكراً على هذه المعلومات القيمة</p>
              </div>
            </div>
            
            {/* تعليق 2 */}
            <div className="flex">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
              <div className="mr-4">
                <div className="font-bold">لمى عبدالله</div>
                <div className="text-gray-600 text-sm">منذ 5 أيام</div>
                <p className="mt-2 text-gray-700">أحببت المقال كثيراً، هل يمكنك تقديم المزيد من المقالات عن نفس الموضوع؟</p>
              </div>
            </div>
          </div>
          
          {/* نموذج إضافة تعليق */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">أضف تعليقاً</h3>
            <form>
              <div className="mb-4">
                <textarea 
                  className="form-input min-h-[120px]"
                  placeholder="اكتب تعليقك هنا..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/90 transition-all"
              >
                نشر التعليق
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;