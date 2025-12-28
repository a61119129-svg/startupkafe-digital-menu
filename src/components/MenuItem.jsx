import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Plus, Minus, Leaf, Star, Clock } from 'lucide-react';
import { useCartStore, useToastStore, useUIStore } from '../store/store';

export default function MenuItem({ item, index = 0 }) {
  const cardRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);
  const addToast = useToastStore((state) => state.addToast);
  const openItemDetail = useUIStore((state) => state.openItemDetail);
  
  const quantity = getItemQuantity(item.id);
  
  useEffect(() => {
    const card = cardRef.current;
    
    gsap.fromTo(card,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: index * 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=50',
          toggleActions: 'play none none none',
        }
      }
    );
  }, [index]);
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(item);
    addToast(`${item.name} added to cart`, 'success');
    
    // Button animation
    gsap.fromTo(cardRef.current,
      { scale: 1 },
      { scale: 1.02, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut' }
    );
  };
  
  const handleIncrement = (e) => {
    e.stopPropagation();
    incrementQuantity(item.id);
  };
  
  const handleDecrement = (e) => {
    e.stopPropagation();
    decrementQuantity(item.id);
    if (quantity === 1) {
      addToast(`${item.name} removed from cart`, 'info');
    }
  };
  
  const handleCardClick = () => {
    // GSAP animation when opening detail
    gsap.to(cardRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        openItemDetail(item);
      }
    });
  };
  
  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className="menu-card bg-white rounded-2xl overflow-hidden border border-cream-200 hover:border-primary-200 transition-colors cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-cream-100 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 skeleton" />
        )}
        <img
          src={imageError ? '/placeholder-food.svg' : item.image}
          alt={item.name}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          loading="lazy"
        />
        
        {/* Gradient overlay for premium look */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
        
        {/* Veg indicator */}
        {item.isVeg && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full p-1.5 shadow-md">
            <div className="w-4 h-4 border-2 border-green-600 rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
            </div>
          </div>
        )}
        
        {/* Popular badge */}
        {item.isPopular && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            <span>Popular</span>
          </div>
        )}
        
        {/* Quick info on hover */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-white/90 backdrop-blur-sm text-xs font-medium text-dark-100 px-2 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            10-15 min
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-semibold text-dark-100 line-clamp-1">
            {item.name}
          </h3>
        </div>
        
        <p className="text-sm text-dark-100/60 line-clamp-2 mb-3 min-h-[40px]">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-lg text-primary-600">
            ₹{item.price}
          </span>
          
          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-md shadow-primary-500/20 btn-press"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-primary-50 rounded-full p-1 shadow-sm">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-primary-100 transition-colors btn-press"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus className="w-4 h-4 text-primary-600" />
              </button>
              <span className="w-8 text-center font-bold text-primary-700">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-sm hover:from-primary-600 hover:to-primary-700 transition-all btn-press"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton loader for menu items
export function MenuItemSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-cream-200">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-2/3 skeleton rounded" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-16 skeleton rounded" />
          <div className="h-9 w-20 skeleton rounded-full" />
        </div>
      </div>
    </div>
  );
}
