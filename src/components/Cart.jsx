import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore, useUIStore } from '../store/store';

export default function Cart() {
  const cartRef = useRef(null);
  const overlayRef = useRef(null);
  
  const { isCartOpen, closeCart } = useUIStore();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const clearCart = useCartStore((state) => state.clearCart);
  
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      gsap.to(cartRef.current, {
        x: 0,
        duration: 0.4,
        ease: 'power3.out'
      });
      
      // Stagger cart items
      const cartItems = cartRef.current?.querySelectorAll('.cart-item');
      gsap.fromTo(cartItems,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, delay: 0.2 }
      );
    } else {
      gsap.to(cartRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power2.in'
      });
      
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          document.body.style.overflow = '';
        }
      });
    }
  }, [isCartOpen]);
  
  const handleCheckout = () => {
    closeCart();
  };
  
  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 bg-black/50 z-50 opacity-0 ${
          isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        onClick={closeCart}
      />
      
      {/* Cart Drawer */}
      <div
        ref={cartRef}
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl translate-x-full flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cream-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-dark-100">Your Cart</h2>
              <p className="text-sm text-dark-100/60">{getTotalItems()} items</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-cream-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6 text-dark-100" />
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-cream-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-cream-400" />
              </div>
              <h3 className="font-display font-semibold text-lg text-dark-100 mb-2">
                Your cart is empty
              </h3>
              <p className="text-dark-100/60 mb-6">
                Add some delicious items to get started!
              </p>
              <button
                onClick={closeCart}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="cart-item flex gap-4 p-3 bg-cream-50 rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-dark-100 line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors text-red-500"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-primary-600 font-semibold mb-2">
                      ₹{item.price}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="w-7 h-7 flex items-center justify-center bg-white border border-cream-300 rounded-full hover:bg-cream-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-semibold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="w-7 h-7 flex items-center justify-center bg-primary-500 rounded-full hover:bg-primary-600 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                      <span className="ml-auto font-semibold text-dark-100">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="w-full py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-cream-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-dark-100/70">Subtotal</span>
              <span className="font-semibold text-dark-100">₹{getTotalPrice()}</span>
            </div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-cream-200">
              <span className="text-dark-100/70">Taxes & Charges</span>
              <span className="font-semibold text-dark-100">₹{Math.round(getTotalPrice() * 0.05)}</span>
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-display font-bold text-lg text-dark-100">Total</span>
              <span className="font-display font-bold text-xl text-primary-600">
                ₹{getTotalPrice() + Math.round(getTotalPrice() * 0.05)}
              </span>
            </div>
            <Link
              to="/checkout"
              onClick={handleCheckout}
              className="flex items-center justify-center gap-2 w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl font-semibold text-lg transition-colors btn-press"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
