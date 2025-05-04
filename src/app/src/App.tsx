import React from 'react';
import UrlList from './components/URLList';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <UrlList />
      </div>
    </div>
  );
};

export default App;
