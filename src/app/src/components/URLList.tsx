import React, { useCallback, useEffect, useState } from 'react';
import Notification from './Notification';
import useURLStore from '../store/urlStore';
import Modal from './Modal';
import UrlForm from './URLForm';
import { URLItemType } from '../types';
import { formatDateTime, formatOtherDetails } from '../utils/helper';
import Loader from './Loader';

const UrlList = () => {

  const { listUrls } = useURLStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [urls, setUrls] = useState<URLItemType[]>([]);
  const [filteredUrls, setFilteredUrls] = useState<URLItemType[]>([]);
  
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 3) {
      const filtered = urls.filter(
        (url) =>
          url.longUrl.toLowerCase().includes(query.toLowerCase()) ||
          url.shortUrl.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUrls(filtered);
    } else {
      setFilteredUrls(urls);
    }
  };

  const fetchUrls = useCallback(async () => {
    setErrorMessage(null);
    setIsFetching(true);
    try {
      const listResponse = await listUrls();
      if (listResponse?.data) {
        setUrls(listResponse.data);
        setFilteredUrls(listResponse.data);
      }
    } catch (err) {
      setErrorMessage((err as Error)?.message || "Something went wrong, please try again");
    } finally {
      setIsFetching(false);
    }
  }, [listUrls]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 sm:px-0">
      {(errorMessage || successMessage) && (
        <div className="mb-5">
          <Notification
            type="error"
            message={errorMessage || successMessage || ""}
            onClose={() => {
              setErrorMessage(null)
              setSuccessMessage(null)
            }}
          />
        </div>
      )}

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

      {isFetching ? (
        <Loader />
      ) : filteredUrls.length <=0 ? (
        <div className="mt-10">
          <p>{searchQuery ? `No URL found that matches ${searchQuery}` : "No URL has been added/encoded"}</p>
        </div>
      ) : (
        <div className="overflow-x-auto mt-10">
          <table className="min-w-full table-auto border-collapse border border-gray-300 mt-10">
            <thead>
              <tr className="bg-gray-100">
                {[
                  "S/N", "Original URL", "Short URL", "Date Created",
                  "Visited", "Date Last Accessed", "Other Details"
                ].map((item: string, index: number) => (
                  <th key={index} className="border border-gray-300 px-4 py-2 text-left">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUrls.map((url, index) => (
                <tr key={++index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{`#${++index}`}</td>
                  <td className="border border-gray-300 px-4 py-2">{url.longUrl}</td>
                  <td className="border border-gray-300 px-4 py-2">{url.shortUrl}</td>
                  <td className="border border-gray-300 px-4 py-2">{formatDateTime(url.stats.createdAt)}</td>
                  <td className="border border-gray-300 px-4 py-2">{url.stats.visits}</td>
                  <td className="border border-gray-300 px-4 py-2">{url.stats.lastAccessedAt ? formatDateTime(url.stats.lastAccessedAt) : null}</td>
                  <td className="border border-gray-300 px-4 py-2">{formatOtherDetails(url)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <UrlForm
            onSuccess={() => {
              fetchUrls()
              setIsModalOpen(false)
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default UrlList;
