import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { X, Plus, Minus, Heart, Share2, Clock, Flame, Leaf, ChevronRight, ShoppingBag } from 'lucide-react';
import { useUIStore, useCartStore, useToastStore, useUserStore } from '../store/store';

export default function ItemDetailModal() {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const { isItemDetailOpen, selectedItem, closeItemDetail } = useUIStore();
  const addItem = useCartStore((state) => state.addItem);
  const addToast = useToastStore((state) => state.addToast);
  const { isFavorite, addToFavorites, removeFromFavorites } = useUserStore();
  
  const isLiked = selectedItem ? isFavorite(selectedItem.id) : false;
  
  useEffect(() => {
    if (isItemDetailOpen && selectedItem) {
      document.body.style.overflow = 'hidden';
      setQuantity(1);
      setImageLoaded(false);
      
      // Opening animation
      const tl = gsap.timeline();
      
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
      .fromTo(contentRef.current,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.5, ease: 'power3.out' },
        '-=0.1'
      )
      .fromTo(imageRef.current,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo('.detail-info > *',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo('.detail-action-bar',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
        '-=0.2'
      );
      
    } else {
      // Closing animation
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
        }
      });
      
      tl.to(contentRef.current, {
        y: '100%',
        duration: 0.3,
        ease: 'power2.in'
      })
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
      }, '-=0.1');
    }
  }, [isItemDetailOpen, selectedItem]);
  
  const handleAddToCart = () => {
    if (!selectedItem) return;
    
    // Add multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem(selectedItem);
    }
    
    // Success animation
    gsap.fromTo('.add-to-cart-btn',
      { scale: 1 },
      { 
        scale: 1.05, 
        duration: 0.15, 
        yoyo: true, 
        repeat: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          addToast(`${quantity}x ${selectedItem.name} added to cart!`, 'success');
          closeItemDetail();
        }
      }
    );
  };
  
  const handleLikeToggle = () => {
    if (!selectedItem) return;
    
    if (isLiked) {
      removeFromFavorites(selectedItem.id);
      addToast('Removed from favorites', 'info');
    } else {
      addToFavorites(selectedItem.id);
      addToast('Added to favorites!', 'success');
    }
    
    // Heart animation
    gsap.fromTo('.like-btn',
      { scale: 1 },
      { scale: 1.3, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.inOut' }
    );
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
    gsap.fromTo('.quantity-display',
      { scale: 1.2 },
      { scale: 1, duration: 0.2, ease: 'power2.out' }
    );
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
    gsap.fromTo('.quantity-display',
      { scale: 1.2 },
      { scale: 1, duration: 0.2, ease: 'power2.out' }
    );
  };
  
  if (!selectedItem) return null;
  
  return (
    <div 
      ref={modalRef}
      className={`fixed inset-0 z-[60] ${isItemDetailOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0"
        onClick={closeItemDetail}
      />
      
      {/* Content */}
      <div
        ref={contentRef}
        className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-white rounded-t-[2rem] overflow-hidden shadow-2xl translate-y-full"
      >
        {/* Close handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Close button */}
        <button
          onClick={closeItemDetail}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <X className="w-5 h-5 text-dark-100" />
        </button>
        
        {/* Image */}
        <div ref={imageRef} className="relative h-64 sm:h-80 overflow-hidden bg-cream-100">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}
          <img
            src={selectedItem.image}
            alt={selectedItem.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {selectedItem.isVeg && (
              <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                <div className="w-4 h-4 border-2 border-green-600 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                </div>
                <span className="text-xs font-semibold text-green-700">Veg</span>
              </div>
            )}
            {selectedItem.isPopular && (
              <div className="bg-primary-500 text-white rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                <Flame className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">Popular</span>
              </div>
            )}
          </div>
          
          {/* Action buttons on image */}
          <div className="absolute top-4 right-16 flex gap-2">
            <button
              onClick={handleLikeToggle}
              className={`like-btn w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 backdrop-blur-sm text-dark-100 hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Details */}
        <div className="detail-info px-6 py-5 max-h-[45vh] overflow-y-auto">
          {/* Category */}
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium mb-3">
            <Leaf className="w-3.5 h-3.5" />
            <span>{selectedItem.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </div>
          
          {/* Name & Price */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark-100">
              {selectedItem.name}
            </h2>
            <div className="text-right shrink-0">
              <span className="font-display text-2xl sm:text-3xl font-bold text-primary-600">
                ₹{selectedItem.price}
              </span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-dark-100/70 text-base leading-relaxed mb-5">
            {selectedItem.description}
          </p>
          
          {/* Info cards */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-cream-50 rounded-xl p-3 text-center">
              <Clock className="w-5 h-5 text-primary-500 mx-auto mb-1" />
              <span className="text-xs text-dark-100/60 block">Prep Time</span>
              <span className="text-sm font-semibold text-dark-100">10-15 min</span>
            </div>
            <div className="bg-cream-50 rounded-xl p-3 text-center">
              <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <span className="text-xs text-dark-100/60 block">Calories</span>
              <span className="text-sm font-semibold text-dark-100">~250 kcal</span>
            </div>
            <div className="bg-cream-50 rounded-xl p-3 text-center">
              <ShoppingBag className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <span className="text-xs text-dark-100/60 block">Serves</span>
              <span className="text-sm font-semibold text-dark-100">1 person</span>
            </div>
          </div>
          
          {/* Customization hint */}
          <button className="w-full flex items-center justify-between p-4 bg-cream-50 rounded-xl hover:bg-cream-100 transition-colors mb-4 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary-600" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-dark-100 block">Add Special Instructions</span>
                <span className="text-sm text-dark-100/60">Extra spicy, no onions, etc.</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-dark-100/40 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        {/* Action Bar */}
        <div className="detail-action-bar sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-cream-200 flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2 bg-cream-50 rounded-xl p-2">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-cream-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4 text-dark-100" />
            </button>
            <span className="quantity-display w-10 text-center font-bold text-lg text-dark-100">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              disabled={quantity >= 10}
              className="w-10 h-10 flex items-center justify-center bg-primary-500 rounded-lg shadow-sm hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="add-to-cart-btn flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary-500/25 flex items-center justify-center gap-3 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Add to Cart</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              ₹{selectedItem.price * quantity}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
