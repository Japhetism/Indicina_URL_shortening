import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UrlList from './components/URLList';

const App = () => {
  useEffect(() => {
    document.title = "URL Shortening";
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<UrlList />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
