import React, { useState } from 'react';
import Modal from './Modal';
import UrlForm from './URLForm';

const UrlList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    
  };

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="flex flex-end mb-5 justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-4 px-8 py-2 bg-blue-500 text-white rounded-lg"
        >
          Add URL
        </button>
      </div>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search for a long URL"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <UrlForm onSuccess={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default UrlList;
