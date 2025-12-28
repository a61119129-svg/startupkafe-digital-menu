import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  Heart, 
  ArrowLeft, 
  Plus, 
  ShoppingBag,
  Trash2,
  Sparkles 
} from 'lucide-react';
import { useUserStore, useCartStore, useToastStore, useUIStore } from '../store/store';
import { menuItems } from '../data/menuData';

export default function Favorites() {
  const pageRef = useRef(null);
  const itemsRef = useRef([]);
  
  const favoriteIds = useUserStore((state) => state.preferences.favoriteItems);
  const removeFromFavorites = useUserStore((state) => state.removeFromFavorites);
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);
  const openItemDetail = useUIStore((state) => state.openItemDetail);
  
  // Get favorite items from menu data
  const favoriteItems = menuItems.filter(item => favoriteIds.includes(item.id));
  
  useEffect(() => {
    // Page entrance animation
    gsap.fromTo(pageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
    
    // Stagger animate items
    if (itemsRef.current.length > 0) {
      gsap.fromTo(itemsRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.4, 
          stagger: 0.08,
          ease: 'back.out(1.2)' 
        }
      );
    }
  }, [favoriteItems.length]);
  
  const handleAddToCart = (item, e) => {
    e.stopPropagation();
    addItem(item);
    addToast(`${item.name} added to cart`, 'success');
    
    // Button animation
    const btn = e.currentTarget;
    gsap.to(btn, {
      scale: 1.2,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });
  };
  
  const handleRemoveFavorite = (itemId, itemName, e) => {
    e.stopPropagation();
    removeFromFavorites(itemId);
    addToast(`${itemName} removed from wishlist`, 'info');
  };
  
  return (
    <div ref={pageRef} className="min-h-screen bg-cream-50 pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-dark-100" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-dark-100 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              My Wishlist
            </h1>
            <p className="text-dark-100/60 text-sm">
              {favoriteItems.length} item{favoriteItems.length !== 1 ? 's' : ''} saved
            </p>
          </div>
        </div>
        
        {favoriteItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-red-300" />
            </div>
            <h2 className="font-display text-2xl font-bold text-dark-100 mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-dark-100/60 mb-8 max-w-sm mx-auto">
              Start adding your favorite items by tapping the heart icon on any menu item
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Explore Menu
            </Link>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favoriteItems.map((item, index) => (
              <div
                key={item.id}
                ref={el => itemsRef.current[index] = el}
                onClick={() => openItemDetail(item)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex">
                  {/* Image */}
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.isVeg !== undefined && (
                      <div className={`absolute top-2 left-2 w-4 h-4 border ${
                        item.isVeg ? 'border-green-600' : 'border-red-600'
                      } bg-white flex items-center justify-center`}>
                        <div className={`w-2 h-2 rounded-full ${
                          item.isVeg ? 'bg-green-600' : 'bg-red-600'
                        }`} />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-semibold text-dark-100 line-clamp-1 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-dark-100/60 text-xs line-clamp-2 mb-2">
                        {item.description}
                      </p>
                      <p className="font-display font-bold text-primary-600">
                        ₹{item.price}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={(e) => handleAddToCart(item, e)}
                        className="flex-1 flex items-center justify-center gap-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                      <button
                        onClick={(e) => handleRemoveFavorite(item.id, item.name, e)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Quick add all to cart */}
        {favoriteItems.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                favoriteItems.forEach(item => addItem(item));
                addToast(`${favoriteItems.length} items added to cart`, 'success');
              }}
              className="inline-flex items-center gap-2 bg-dark-100 hover:bg-dark-100/90 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Add All to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
