import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { X, Phone, Shield, ArrowRight, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { useUIStore, useUserStore, useToastStore } from '../store/store';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';

export default function AuthModal() {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const otpInputsRef = useRef([]);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  
  const { isAuthModalOpen, closeAuthModal } = useUIStore();
  const { updatePreferences } = useUserStore();
  const addToast = useToastStore((state) => state.addToast);
  
  const {
    user,
    loading,
    error,
    isOtpSent,
    isAuthenticated,
    sendOTP,
    verifyOTP,
    resetAuth
  } = useAuth();
  
  // Animation on open/close
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      gsap.fromTo(contentRef.current,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    } else {
      gsap.to(contentRef.current, {
        y: '100%',
        duration: 0.3,
        ease: 'power2.in'
      });
      
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          document.body.style.overflow = '';
        }
      });
    }
  }, [isAuthModalOpen]);
  
  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);
  
  // Auto close on successful auth
  useEffect(() => {
    if (isAuthenticated && isAuthModalOpen) {
      addToast('Successfully logged in!', 'success');
      updatePreferences({ phone: user.phoneNumber });
      closeAuthModal();
      resetAuth();
    }
  }, [isAuthenticated, isAuthModalOpen]);
  
  const handleSendOTP = async () => {
    if (phoneNumber.length !== 10) {
      addToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }
    
    const result = await sendOTP(phoneNumber);
    if (result.success) {
      setResendTimer(30);
      addToast('OTP sent to your phone', 'success');
      // Focus first OTP input
      setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
    } else {
      addToast(result.message, 'error');
    }
  };
  
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      const lastIndex = Math.min(digits.length, 5);
      otpInputsRef.current[lastIndex]?.focus();
      return;
    }
    
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, '');
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };
  
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };
  
  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      addToast('Please enter the complete OTP', 'error');
      return;
    }
    
    const result = await verifyOTP(otpString);
    if (!result.success) {
      addToast(result.message, 'error');
      setOtp(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
    }
  };
  
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    const result = await sendOTP(phoneNumber);
    if (result.success) {
      setResendTimer(30);
      setOtp(['', '', '', '', '', '']);
      addToast('New OTP sent', 'success');
    }
  };
  
  const handleClose = () => {
    closeAuthModal();
    resetAuth();
    setPhoneNumber('');
    setOtp(['', '', '', '', '', '']);
  };
  
  return (
    <div 
      ref={modalRef}
      className={`fixed inset-0 z-[80] ${isAuthModalOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0"
        onClick={handleClose}
      />
      
      {/* reCAPTCHA container (invisible) */}
      <div id="recaptcha-container" />
      
      {/* Content */}
      <div
        ref={contentRef}
        className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-white rounded-t-[2rem] overflow-hidden shadow-2xl translate-y-full"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center hover:bg-cream-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-dark-100" />
        </button>
        
        <div className="px-6 pb-8 pt-4">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-primary-50 rounded-2xl p-3">
              <Logo className="h-12 w-auto" />
            </div>
          </div>
          
          {!isOtpSent ? (
            /* Phone Number Entry */
            <div>
              <h2 className="font-display text-2xl font-bold text-dark-100 text-center mb-2">
                Login to Continue
              </h2>
              <p className="text-dark-100/60 text-center mb-8">
                Enter your phone number to receive an OTP
              </p>
              
              {/* Phone Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark-100 mb-2">
                  Phone Number
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-cream-50 px-4 py-3.5 rounded-xl border border-cream-200">
                    <span className="text-lg">🇮🇳</span>
                    <span className="font-medium text-dark-100">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit number"
                    className="flex-1 px-4 py-3.5 bg-cream-50 border border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg tracking-wider"
                    maxLength={10}
                  />
                </div>
              </div>
              
              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              {/* Send OTP Button */}
              <button
                onClick={handleSendOTP}
                disabled={loading || phoneNumber.length !== 10}
                className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white py-4 rounded-xl font-semibold transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Get OTP</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              {/* Info */}
              <div className="mt-6 flex items-start gap-3 p-4 bg-cream-50 rounded-xl">
                <Shield className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-dark-100/70">
                  We'll send you a 6-digit OTP to verify your number. Standard SMS rates may apply.
                </p>
              </div>
            </div>
          ) : (
            /* OTP Verification */
            <div>
              <h2 className="font-display text-2xl font-bold text-dark-100 text-center mb-2">
                Verify OTP
              </h2>
              <p className="text-dark-100/60 text-center mb-8">
                Enter the 6-digit code sent to <span className="font-medium text-dark-100">+91 {phoneNumber}</span>
              </p>
              
              {/* OTP Input */}
              <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => otpInputsRef.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-cream-50 border-2 border-cream-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    maxLength={6}
                  />
                ))}
              </div>
              
              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              {/* Verify Button */}
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.join('').length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white py-4 rounded-xl font-semibold transition-colors mb-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Verify & Login</span>
                  </>
                )}
              </button>
              
              {/* Resend OTP */}
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-dark-100/60">
                    Resend OTP in <span className="font-medium text-primary-600">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1 mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Resend OTP
                  </button>
                )}
              </div>
              
              {/* Change Number */}
              <button
                onClick={() => {
                  resetAuth();
                  setOtp(['', '', '', '', '', '']);
                }}
                className="w-full mt-4 text-sm text-dark-100/60 hover:text-dark-100 transition-colors"
              >
                ← Change phone number
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
