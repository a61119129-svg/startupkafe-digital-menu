// PhonePe Business Payment Gateway Configuration
// Replace these with your actual PhonePe Business credentials
// Get these from: PhonePe Business Dashboard

// For PRODUCTION, these should be server-side only!
// This is a client-side helper - actual payment initiation should happen on your backend

export const PHONEPE_CONFIG = {
  // Test/Sandbox Environment
  SANDBOX: {
    merchantId: import.meta.env.VITE_PHONEPE_MERCHANT_ID || "MERCHANTUAT",
    saltKey: import.meta.env.VITE_PHONEPE_SALT_KEY || "your-salt-key",
    saltIndex: import.meta.env.VITE_PHONEPE_SALT_INDEX || "1",
    baseUrl: "https://api-preprod.phonepe.com/apis/pg-sandbox",
    redirectUrl: window.location.origin + "/payment/callback",
    callbackUrl: window.location.origin + "/api/phonepe/callback", // Your backend webhook
  },
  
  // Production Environment (use after testing)
  PRODUCTION: {
    merchantId: import.meta.env.VITE_PHONEPE_MERCHANT_ID_PROD || "YOUR_MERCHANT_ID",
    saltKey: import.meta.env.VITE_PHONEPE_SALT_KEY_PROD || "your-prod-salt-key",
    saltIndex: import.meta.env.VITE_PHONEPE_SALT_INDEX_PROD || "1",
    baseUrl: "https://api.phonepe.com/apis/hermes",
    redirectUrl: window.location.origin + "/payment/callback",
    callbackUrl: "https://your-backend.com/api/phonepe/callback",
  },
};

// Use sandbox for development, production for live
export const ACTIVE_CONFIG = import.meta.env.PROD 
  ? PHONEPE_CONFIG.PRODUCTION 
  : PHONEPE_CONFIG.SANDBOX;

// Payment status codes
export const PAYMENT_STATUS = {
  SUCCESS: 'PAYMENT_SUCCESS',
  PENDING: 'PAYMENT_PENDING',
  FAILED: 'PAYMENT_ERROR',
  DECLINED: 'PAYMENT_DECLINED',
  CANCELLED: 'PAYMENT_CANCELLED',
};
