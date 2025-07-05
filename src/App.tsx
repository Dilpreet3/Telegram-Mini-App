import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { WebApp } from '@twa-dev/sdk';
import HomePage from './pages/HomePage';
import OfferPage from './pages/OfferPage';
import ReferralPage from './pages/ReferralPage';
import AdminPage from './pages/AdminPage';

function App() {
  useEffect(() => {
    // Expand the app to full height
    WebApp.expand();
    
    // Set up theme change listener
    WebApp.onEvent('themeChanged', () => {
      document.documentElement.setAttribute(
        'data-theme', 
        WebApp.colorScheme
      );
    });
    
    // Initialize theme
    document.documentElement.setAttribute(
      'data-theme', 
      WebApp.colorScheme
    );
    
    return () => {
      WebApp.offEvent('themeChanged');
    };
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/offer/:id" element={<OfferPage />} />
        <Route path="/referral/:offerId" element={<ReferralPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;
