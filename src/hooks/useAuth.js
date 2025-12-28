import { useState, useEffect, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signOut,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../config/firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationId, setVerificationId] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Setup reCAPTCHA verifier
  const setupRecaptcha = useCallback((elementId) => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          },
          'expired-callback': () => {
            // Reset if expired
            setError('reCAPTCHA expired. Please try again.');
          }
        });
      }
      return window.recaptchaVerifier;
    } catch (err) {
      console.error('Recaptcha setup error:', err);
      setError('Failed to setup verification. Please refresh and try again.');
      return null;
    }
  }, []);

  // Send OTP to phone number
  const sendOTP = useCallback(async (phoneNumber, recaptchaElementId = 'recaptcha-container') => {
    setError(null);
    setLoading(true);

    try {
      // Ensure phone number is in correct format (+91XXXXXXXXXX for India)
      const formattedPhone = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+91${phoneNumber.replace(/^0+/, '')}`;

      const appVerifier = setupRecaptcha(recaptchaElementId);
      
      if (!appVerifier) {
        throw new Error('Failed to setup reCAPTCHA');
      }

      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      setIsOtpSent(true);
      setLoading(false);
      
      // Store confirmation result for verification
      window.confirmationResult = confirmationResult;
      
      return { success: true, message: 'OTP sent successfully' };
    } catch (err) {
      setLoading(false);
      console.error('Send OTP error:', err);
      
      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (err.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number. Please enter a valid number.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      } else if (err.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS quota exceeded. Please try again later.';
      }
      
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, [setupRecaptcha]);

  // Verify OTP
  const verifyOTP = useCallback(async (otp) => {
    setError(null);
    setLoading(true);

    try {
      if (!window.confirmationResult) {
        throw new Error('No verification in progress');
      }

      const result = await window.confirmationResult.confirm(otp);
      setUser(result.user);
      setIsOtpSent(false);
      setLoading(false);
      
      // Clear confirmation result
      window.confirmationResult = null;
      
      return { success: true, user: result.user };
    } catch (err) {
      setLoading(false);
      console.error('Verify OTP error:', err);
      
      let errorMessage = 'Invalid OTP. Please try again.';
      
      if (err.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid OTP. Please check and try again.';
      } else if (err.code === 'auth/code-expired') {
        errorMessage = 'OTP expired. Please request a new one.';
      }
      
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, []);

  // Sign out
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsOtpSent(false);
      setVerificationId(null);
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      return { success: false, message: 'Failed to logout' };
    }
  }, []);

  // Reset state
  const resetAuth = useCallback(() => {
    setError(null);
    setIsOtpSent(false);
    setVerificationId(null);
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    window.confirmationResult = null;
  }, []);

  return {
    user,
    loading,
    error,
    isOtpSent,
    isAuthenticated: !!user,
    sendOTP,
    verifyOTP,
    logout,
    resetAuth,
    phoneNumber: user?.phoneNumber || null,
  };
}

export default useAuth;
