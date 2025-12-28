import { ShoppingCart, ChevronRight } from 'lucide-react';
import { useCartStore, useUIStore } from '../store/store';

export default function FloatingCartButton() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const { openCart } = useUIStore();
  
  if (totalItems === 0) return null;
  
  return (
    <button
      onClick={openCart}
      className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-auto z-40 flex items-center justify-between sm:justify-center gap-3 sm:gap-4 bg-primary-600 hover:bg-primary-700 text-white px-4 sm:pl-5 sm:pr-6 py-3.5 sm:py-3.5 rounded-2xl sm:rounded-full shadow-xl shadow-primary-600/30 transition-all btn-press animate-slide-up"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-primary-600 text-xs font-bold rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        </div>
        <div className="h-5 w-px bg-white/30 hidden sm:block" />
        <span className="font-semibold text-sm sm:text-base">{totalItems} item{totalItems > 1 ? 's' : ''}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg">₹{totalPrice}</span>
        <ChevronRight className="w-5 h-5" />
      </div>
    </button>
  );
}
