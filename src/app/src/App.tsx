import React, { useEffect } from 'react';
import UrlList from './components/URLList';

const App = () => {

  useEffect(() => {
    document.title = "URL Shortening";
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <UrlList />
      </div>
    </div>
  );
};

export default App;
