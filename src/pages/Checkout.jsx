import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  ShoppingBag,
  CheckCircle,
  User,
  Phone,
  Mail,
  MessageSquare,
  Loader2,
  Wallet,
  Building2,
  QrCode,
  Banknote,
  MapPin,
  RefreshCw,
  LogIn,
  Shield
} from 'lucide-react';
import { useCartStore, useOrderStore, useToastStore, useUserStore, useUIStore } from '../store/store';
import Logo from '../components/Logo';
import { useLocation } from '../hooks/useLocation';
import { useAuth } from '../hooks/useAuth';
import { initiatePayment, generateUPIIntent } from '../services/paymentService';

export default function Checkout() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [step, setStep] = useState('details'); // details, payment, processing, success
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  
  const { address: locationAddress, loading: locationLoading, refresh: refreshLocation } = useLocation();
  const userPreferences = useUserStore((state) => state.preferences);
  const { openAuthModal } = useUIStore();
  const { isAuthenticated, user: authUser, phoneNumber: authPhone } = useAuth();
  
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = useOrderStore((state) => state.addOrder);
  const addToast = useToastStore((state) => state.addToast);
  
  const subtotal = getTotalPrice();
  const taxes = Math.round(subtotal * 0.05);
  const deliveryFee = 0; // Free delivery
  const total = subtotal + taxes + deliveryFee;
  
  // Payment options
  const paymentOptions = [
    {
      id: 'phonepe',
      name: 'PhonePe',
      description: 'UPI Payment',
      icon: Smartphone,
      color: '#5f259f',
      popular: true
    },
    {
      id: 'gpay',
      name: 'Google Pay',
      description: 'UPI Payment',
      icon: Wallet,
      color: '#4285F4',
      popular: true
    },
    {
      id: 'paytm',
      name: 'Paytm',
      description: 'UPI, Wallet, Cards',
      icon: Wallet,
      color: '#00BAF2',
      popular: false
    },
    {
      id: 'upi',
      name: 'Other UPI',
      description: 'Any UPI App',
      icon: QrCode,
      color: '#6366f1',
      popular: false
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, RuPay',
      icon: CreditCard,
      color: '#1a1a2e',
      popular: false
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All Indian Banks',
      icon: Building2,
      color: '#059669',
      popular: false
    },
    {
      id: 'cod',
      name: 'Pay at Counter',
      description: 'Cash or Card at pickup',
      icon: Banknote,
      color: '#d97706',
      popular: false
    }
  ];
  
  // Pre-fill form with user preferences and location
  useEffect(() => {
    if (userPreferences.name || userPreferences.phone || authPhone) {
      setFormData(prev => ({
        ...prev,
        name: userPreferences.name || prev.name,
        phone: authPhone?.replace('+91', '') || userPreferences.phone || prev.phone,
      }));
    }
  }, [userPreferences, authPhone]);
  
  useEffect(() => {
    if (locationAddress && !formData.address) {
      setFormData(prev => ({ ...prev, address: locationAddress }));
    }
  }, [locationAddress]);
  
  useEffect(() => {
    if (items.length === 0 && step !== 'success') {
      navigate('/');
    }
    
    gsap.fromTo(pageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [items.length, navigate, step]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleProceedToPayment = () => {
    if (validateForm()) {
      setStep('payment');
      gsap.fromTo('.payment-section',
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4 }
      );
    }
  };
  
  const handlePayment = async (paymentMethod) => {
    setSelectedPayment(paymentMethod);
    setStep('processing');
    
    try {
      // For UPI-based payments (PhonePe, GPay, etc.)
      if (['phonepe', 'gpay', 'paytm', 'upi'].includes(paymentMethod.id)) {
        // Create order object
        const orderData = {
          id: Date.now(),
          total,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          }))
        };
        
        // Initiate PhonePe payment
        const paymentResult = await initiatePayment(orderData, formData);
        
        if (paymentResult.success) {
          // In production, redirect to PhonePe payment page
          // For demo, we'll simulate success after delay
          addToast('Redirecting to payment...', 'info');
          
          // Simulate payment gateway redirect
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // On successful callback, create order
          const order = addOrder({
            items: orderData.items,
            subtotal,
            taxes,
            deliveryFee,
            total,
            customer: formData,
            paymentMethod: paymentMethod.name,
            paymentStatus: 'completed',
            transactionId: paymentResult.transactionId
          });
          
          clearCart();
          setStep('success');
          addToast('Payment successful!', 'success');
        } else {
          throw new Error(paymentResult.error);
        }
      } else if (paymentMethod.id === 'cod') {
        // Pay at counter - no payment processing needed
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const order = addOrder({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          subtotal,
          taxes,
          deliveryFee,
          total,
          customer: formData,
          paymentMethod: paymentMethod.name,
          paymentStatus: 'pending'
        });
        
        clearCart();
        setStep('success');
        addToast('Order placed! Pay at counter.', 'success');
      } else {
        // Card/NetBanking - would integrate with payment gateway
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        const order = addOrder({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          subtotal,
          taxes,
          deliveryFee,
          total,
          customer: formData,
          paymentMethod: paymentMethod.name,
          paymentStatus: 'completed'
        });
        
        clearCart();
        setStep('success');
        addToast('Payment successful!', 'success');
      }
      
      gsap.fromTo('.success-section',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    } catch (error) {
      console.error('Payment error:', error);
      addToast(error.message || 'Payment failed. Please try again.', 'error');
      setStep('payment');
    }
  };
  
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-cream-50 pt-20 pb-12">
        <div className="max-w-lg mx-auto px-4">
          <div className="success-section bg-white rounded-3xl p-8 shadow-xl text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="font-display text-3xl font-bold text-dark-100 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-dark-100/70 mb-8">
              Thank you for your order. We're preparing your delicious food!
            </p>
            
            <div className="bg-cream-50 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-dark-100/70">Order Total</span>
                <span className="font-display font-bold text-2xl text-primary-600">₹{total}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-100/70">Payment Method</span>
                <span className="font-medium text-dark-100">{selectedPayment?.name || 'Online'}</span>
              </div>
            </div>
            
            <div className="bg-primary-50 rounded-xl p-4 mb-8">
              <p className="text-sm text-primary-700">
                📱 You'll receive an SMS confirmation at <strong>{formData.phone}</strong>
              </p>
            </div>
            
            <div className="space-y-3">
              <Link
                to="/orders"
                className="flex items-center justify-center gap-2 w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl font-semibold transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>View Orders</span>
              </Link>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 w-full bg-cream-100 hover:bg-cream-200 text-dark-100 py-4 rounded-xl font-semibold transition-colors"
              >
                <span>Order More</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          </div>
          <h2 className="font-display text-2xl font-bold text-dark-100 mb-2">
            Processing Payment
          </h2>
          <p className="text-dark-100/70 mb-2">
            {selectedPayment?.name || 'Processing'}...
          </p>
          <p className="text-sm text-dark-100/50">
            Please wait while we confirm your payment
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div ref={pageRef} className="min-h-screen bg-cream-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => step === 'payment' ? setStep('details') : navigate(-1)}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-dark-100" />
          </button>
          <h1 className="font-display text-2xl font-bold text-dark-100">Checkout</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {step === 'details' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-display text-lg font-semibold text-dark-100 mb-6">
                  Your Details
                </h2>
                
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-dark-100 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                        errors.name ? 'border-red-500' : 'border-cream-300'
                      }`}
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-dark-100 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-cream-300'
                      }`}
                      placeholder="10-digit mobile number"
                      maxLength="10"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-dark-100 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors ${
                        errors.email ? 'border-red-500' : 'border-cream-300'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-dark-100 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Special Instructions (optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-none"
                      placeholder="Any special requests for your order..."
                    />
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-dark-100 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Your Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-12 border border-cream-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                        placeholder={locationLoading ? 'Getting your location...' : 'Your current location'}
                        readOnly={locationLoading}
                      />
                      <button
                        type="button"
                        onClick={refreshLocation}
                        disabled={locationLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Refresh location"
                      >
                        <RefreshCw className={`w-4 h-4 ${locationLoading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                    {locationLoading && (
                      <p className="text-xs text-primary-600 mt-1">Fetching your location...</p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleProceedToPayment}
                  className="w-full mt-6 bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl font-semibold transition-colors btn-press"
                >
                  Continue to Payment
                </button>
              </div>
            )}
            
            {step === 'payment' && (
              <div className="payment-section bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-display text-lg font-semibold text-dark-100 mb-2">
                  Choose Payment Method
                </h2>
                <p className="text-sm text-dark-100/60 mb-6">
                  Select your preferred payment option
                </p>
                
                {/* Popular Payment Options */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-dark-100/50 uppercase tracking-wide mb-3">
                    Popular
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentOptions.filter(p => p.popular).map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handlePayment(option)}
                        className="flex items-center gap-3 p-4 border-2 border-cream-200 hover:border-primary-500 rounded-xl transition-all hover:bg-primary-50"
                      >
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: option.color }}
                        >
                          <option.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-dark-100 text-sm">{option.name}</p>
                          <p className="text-xs text-dark-100/60">{option.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Other Payment Options */}
                <div>
                  <p className="text-xs font-medium text-dark-100/50 uppercase tracking-wide mb-3">
                    Other Options
                  </p>
                  <div className="space-y-2">
                    {paymentOptions.filter(p => !p.popular).map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handlePayment(option)}
                        className="w-full flex items-center gap-3 p-3 border border-cream-200 hover:border-primary-500 rounded-xl transition-all hover:bg-primary-50"
                      >
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: option.color }}
                        >
                          <option.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-dark-100 text-sm">{option.name}</p>
                          <p className="text-xs text-dark-100/60">{option.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Security Info */}
                <div className="mt-6 p-4 bg-cream-50 rounded-xl">
                  <p className="text-sm text-dark-100/70">
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    Your payment is secured with industry-standard 256-bit encryption.
                    We support all major payment methods.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <Logo className="w-10 h-10" />
                <div>
                  <h3 className="font-display font-semibold text-dark-100">Order Summary</h3>
                  <p className="text-sm text-dark-100/60">{items.length} items</p>
                </div>
              </div>
              
              {/* Items */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark-100 text-sm line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-dark-100/60">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-dark-100 text-sm">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Totals */}
              <div className="border-t border-cream-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-100/70">Subtotal</span>
                  <span className="font-medium text-dark-100">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-100/70">Taxes (5%)</span>
                  <span className="font-medium text-dark-100">₹{taxes}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-cream-200">
                  <span className="font-display font-bold text-dark-100">Total</span>
                  <span className="font-display font-bold text-xl text-primary-600">₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
