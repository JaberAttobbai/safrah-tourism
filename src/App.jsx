import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/Homepage';
import DestinationsPage from './pages/DestinationsPage';
import BlogPage from './pages/BlogPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GuidesPage from './pages/GuidesPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import CartPage from './pages/CartPage';
import TripsPage from './pages/TripsPage';
import ProfilePage from './pages/ProfilePage';
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-light">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/guides" element={<GuidesPage />} />
            {/* <Route path="/guides/:id" element={<GuideProfile />} />  */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/CartPage" element={<CartPage />} />
             <Route path="/trips" element={<TripsPage />} /> 
            <Route path="/destination/:id" element={<DestinationDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;