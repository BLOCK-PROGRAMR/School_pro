import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search, Calendar, X, Loader, Image } from 'lucide-react';
import Allapi from '../../common';
import { mycon } from "../../store/Mycontext";


const Gallery = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { branchdet } = useContext(mycon);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      console.log("Fetching galleries");
      const response = await fetch(
        `${Allapi.backapi}/api/gallery`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();
      console.log("Galleries response:", data);

      if (data.success) {
        // Sort by date (newest first)
        const sortedGalleries = data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setGalleries(sortedGalleries);
      } else {
        console.error('Failed to fetch galleries:', data);
        toast.error('Failed to fetch galleries');
      }
    } catch (err) {
      console.error('Error fetching galleries:', err);
      toast.error('Error fetching galleries');
      setError('Error fetching galleries');
    } finally {
      setLoading(false);
    }
  };

  // Filter galleries based on search term
  const filteredGalleries = galleries.filter(gallery =>
    gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gallery.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date to a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openGalleryModal = (gallery) => {
    setSelectedGallery(gallery);
    setIsModalOpen(true);
  };

  const closeGalleryModal = () => {
    setSelectedGallery(null);
    setIsModalOpen(false);
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="mt-4 text-gray-600">Loading galleries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 text-red-500 bg-red-100 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">School Gallery</h1>
          <p className="text-gray-600">
            Browse through our collection of school events, activities, and memories.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search galleries by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredGalleries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGalleries.map((gallery) => (
              <div
                key={gallery._id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => openGalleryModal(gallery)}
              >
                <div className="relative h-48 overflow-hidden">
                  {gallery.images && gallery.images.length > 0 ? (
                    <img
                      src={gallery.images[0].url}
                      alt={gallery.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Image className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h2 className="text-white font-bold text-lg truncate">{gallery.title}</h2>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(gallery.createdAt)}</span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">{gallery.description || 'No description available'}</p>
                  <div className="mt-3 flex items-center">
                    <span className="text-sm text-blue-600">{gallery.images.length} {gallery.images.length === 1 ? 'image' : 'images'}</span>
                    <span className="ml-auto text-sm text-blue-600 font-medium">View Gallery</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            {searchTerm ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No matching galleries found</h3>
                <p className="text-gray-600">Try adjusting your search terms or clear the search to see all available galleries.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No galleries available</h3>
                <p className="text-gray-600">There are currently no galleries available. Please check back later.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gallery Modal */}
      {isModalOpen && selectedGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">{selectedGallery.title}</h2>
              <button
                onClick={closeGalleryModal}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="mb-4">
                <p className="text-gray-600 mb-2">{selectedGallery.description || 'No description available'}</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(selectedGallery.createdAt)}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedGallery.images.map((image, index) => (
                  <div
                    key={image._id || index}
                    className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => openImageModal(image)}
                  >
                    <img
                      src={image.url}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
          onClick={closeImageModal}
        >
          <div
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 p-1 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <img
              src={selectedImage.url}
              alt="Full size image"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;