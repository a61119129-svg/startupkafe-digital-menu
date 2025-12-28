import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, User, ChevronDown, Heart, Package } from 'lucide-react';
import { gsap } from 'gsap';
import { useCartStore, useUIStore, useUserStore } from '../store/store';
import Logo from './Logo';

export default function Header() {
  const headerRef = useRef(null);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { openCart, openSearch, openUserModal } = useUIStore();
  const { preferences, isLoggedIn } = useUserStore();
  const favoritesCount = preferences.favoriteItems?.length || 0;
  
  useEffect(() => {
    const header = headerRef.current;
    
    gsap.fromTo(header, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );
    
    // Header scroll effect
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 100) {
        header.classList.add('shadow-lg');
        header.style.backgroundColor = 'rgba(254, 253, 251, 0.97)';
      } else {
        header.classList.remove('shadow-lg');
        header.style.backgroundColor = 'rgba(254, 253, 251, 1)';
      }
      
      lastScroll = currentScroll;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 glass transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <Logo className="h-12 sm:h-16 w-auto transition-transform group-hover:scale-105" />
          </Link>
          
          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Button */}
            <button
              onClick={openUserModal}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-primary-50 transition-colors group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white shadow-md">
                {preferences.name ? (
                  <span className="font-bold text-sm">
                    {preferences.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              {preferences.name && (
                <span className="hidden md:block text-sm font-medium text-dark-100 max-w-[100px] truncate">
                  {preferences.name}
                </span>
              )}
              <ChevronDown className="hidden sm:block w-4 h-4 text-dark-100/50 group-hover:text-primary-500 transition-colors" />
            </button>
            
            {/* Orders Button */}
            <Link
              to="/orders"
              className="p-2.5 rounded-full hover:bg-primary-50 transition-colors btn-press"
              aria-label="My Orders"
            >
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-dark-100" />
            </Link>
            
            {/* Favorites Button */}
            <Link
              to="/favorites"
              className="relative p-2.5 rounded-full hover:bg-primary-50 transition-colors btn-press"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-dark-100" />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg">
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </Link>
            
            {/* Search Button */}
            <button
              onClick={openSearch}
              className="p-2.5 rounded-full hover:bg-primary-50 transition-colors btn-press"
              aria-label="Search menu"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-dark-100" />
            </button>
            
            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full hover:bg-primary-50 transition-colors btn-press"
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-dark-100" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-scale-in shadow-lg shadow-primary-500/30">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
