import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Search, X } from 'lucide-react';
import { useUIStore } from '../store/store';
import { searchItems } from '../data/menuData';
import MenuItem from './MenuItem';

export default function SearchModal() {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const inputRef = useRef(null);
  
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery } = useUIStore();
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (searchQuery.trim()) {
      const searchResults = searchItems(searchQuery);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [searchQuery]);
  
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
      
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.2,
      });
      
      gsap.fromTo(modalRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
      
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      gsap.to(modalRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.2,
      });
      
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          document.body.style.overflow = '';
        }
      });
    }
  }, [isSearchOpen]);
  
  const handleClose = () => {
    setSearchQuery('');
    closeSearch();
  };
  
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchOpen) {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);
  
  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 opacity-0 ${
          isSearchOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={`fixed top-4 left-4 right-4 max-w-2xl mx-auto z-50 opacity-0 ${
          isSearchOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Search Input */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-cream-200">
            <Search className="w-5 h-5 text-dark-100/40" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for dishes..."
              className="flex-1 text-lg outline-none bg-transparent placeholder:text-dark-100/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 hover:bg-cream-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-dark-100/60" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="ml-2 px-4 py-2 text-sm font-medium text-dark-100/60 hover:text-dark-100 transition-colors"
            >
              Cancel
            </button>
          </div>
          
          {/* Search Results */}
          {searchQuery && (
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-dark-100/60 text-lg">
                    No items found for "{searchQuery}"
                  </p>
                  <p className="text-dark-100/40 text-sm mt-2">
                    Try searching for something else
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-dark-100/60 mb-4">
                    {results.length} items found
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results.slice(0, 8).map((item, index) => (
                      <MenuItem key={item.id} item={item} index={index} />
                    ))}
                  </div>
                  {results.length > 8 && (
                    <p className="text-center text-sm text-dark-100/60 mt-4">
                      Showing 8 of {results.length} results
                    </p>
                  )}
                </>
              )}
            </div>
          )}
          
          {/* Quick Suggestions */}
          {!searchQuery && (
            <div className="p-4">
              <p className="text-sm text-dark-100/60 mb-3">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {['Coffee', 'Burger', 'Momos', 'Pasta', 'Shake'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-4 py-2 bg-cream-100 hover:bg-cream-200 rounded-full text-sm font-medium text-dark-100 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
