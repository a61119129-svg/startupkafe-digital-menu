import CryptoJS from 'crypto-js';
import { ACTIVE_CONFIG, PAYMENT_STATUS } from '../config/phonepe';

/**
 * PhonePe Payment Service
 * 
 * IMPORTANT: In production, payment initiation should happen on your backend server
 * for security. This service is for demonstration and should be moved to a secure backend.
 */

// Generate unique transaction ID
export const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `TXN${timestamp}${random}`.toUpperCase();
};

// Generate SHA256 checksum
const generateChecksum = (payload, saltKey, saltIndex) => {
  const base64Payload = btoa(JSON.stringify(payload));
  const stringToHash = base64Payload + '/pg/v1/pay' + saltKey;
  const sha256Hash = CryptoJS.SHA256(stringToHash).toString();
  return sha256Hash + '###' + saltIndex;
};

// Create payment payload
export const createPaymentPayload = (order, customerInfo) => {
  const transactionId = generateTransactionId();
  
  const payload = {
    merchantId: ACTIVE_CONFIG.merchantId,
    merchantTransactionId: transactionId,
    merchantUserId: customerInfo.phone || 'GUEST_USER',
    amount: order.total * 100, // Amount in paise
    redirectUrl: `${ACTIVE_CONFIG.redirectUrl}?txnId=${transactionId}`,
    redirectMode: 'REDIRECT',
    callbackUrl: ACTIVE_CONFIG.callbackUrl,
    mobileNumber: customerInfo.phone,
    paymentInstrument: {
      type: 'PAY_PAGE'
    }
  };
  
  return { payload, transactionId };
};

/**
 * Initiate PhonePe Payment
 * 
 * In production, this should call your backend API which then calls PhonePe
 * Backend handles the salt key securely
 */
export const initiatePayment = async (order, customerInfo) => {
  try {
    const { payload, transactionId } = createPaymentPayload(order, customerInfo);
    
    // For demo purposes - In production, call your backend API
    // const response = await fetch('/api/phonepe/initiate', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ order, customerInfo })
    // });
    
    const base64Payload = btoa(JSON.stringify(payload));
    const checksum = generateChecksum(payload, ACTIVE_CONFIG.saltKey, ACTIVE_CONFIG.saltIndex);
    
    // Store transaction details locally for verification
    localStorage.setItem('pending_transaction', JSON.stringify({
      transactionId,
      orderId: order.id,
      amount: order.total,
      timestamp: Date.now(),
      status: 'INITIATED'
    }));
    
    // In production, make API call to PhonePe
    // For now, return the payment page URL structure
    const paymentUrl = `${ACTIVE_CONFIG.baseUrl}/pg/v1/pay`;
    
    return {
      success: true,
      transactionId,
      paymentUrl,
      payload: base64Payload,
      checksum,
      // This data would be used to redirect or open PhonePe
      redirectData: {
        url: paymentUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        },
        body: { request: base64Payload }
      }
    };
  } catch (error) {
    console.error('Payment initiation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to initiate payment'
    };
  }
};

/**
 * Check Payment Status
 */
export const checkPaymentStatus = async (transactionId) => {
  try {
    // In production, call your backend to check status
    // Your backend calls PhonePe status API
    
    const stringToHash = `/pg/v1/status/${ACTIVE_CONFIG.merchantId}/${transactionId}` + ACTIVE_CONFIG.saltKey;
    const sha256Hash = CryptoJS.SHA256(stringToHash).toString();
    const checksum = sha256Hash + '###' + ACTIVE_CONFIG.saltIndex;
    
    // This would be your backend API call
    // const response = await fetch(`/api/phonepe/status/${transactionId}`);
    
    // For demo, check local storage
    const pendingTxn = localStorage.getItem('pending_transaction');
    if (pendingTxn) {
      const txn = JSON.parse(pendingTxn);
      if (txn.transactionId === transactionId) {
        return {
          success: true,
          status: txn.status,
          transactionId,
          amount: txn.amount
        };
      }
    }
    
    return {
      success: false,
      status: 'NOT_FOUND'
    };
  } catch (error) {
    console.error('Status check error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Handle Payment Callback/Redirect
 */
export const handlePaymentCallback = (params) => {
  const { code, transactionId, merchantId } = params;
  
  // Update local storage
  const pendingTxn = localStorage.getItem('pending_transaction');
  if (pendingTxn) {
    const txn = JSON.parse(pendingTxn);
    if (txn.transactionId === transactionId) {
      txn.status = code === PAYMENT_STATUS.SUCCESS ? 'SUCCESS' : 'FAILED';
      txn.responseCode = code;
      localStorage.setItem('pending_transaction', JSON.stringify(txn));
    }
  }
  
  return {
    success: code === PAYMENT_STATUS.SUCCESS,
    status: code,
    transactionId
  };
};

/**
 * Generate UPI Intent URL (for direct UPI app opening)
 */
export const generateUPIIntent = (order, customerInfo) => {
  const transactionId = generateTransactionId();
  const upiUrl = new URL('upi://pay');
  
  // UPI parameters
  upiUrl.searchParams.set('pa', ACTIVE_CONFIG.merchantId + '@ybl'); // Your UPI VPA
  upiUrl.searchParams.set('pn', 'Startup Kafe');
  upiUrl.searchParams.set('tr', transactionId);
  upiUrl.searchParams.set('am', order.total.toString());
  upiUrl.searchParams.set('cu', 'INR');
  upiUrl.searchParams.set('tn', `Order at Startup Kafe`);
  
  return {
    url: upiUrl.toString(),
    transactionId
  };
};

export default {
  initiatePayment,
  checkPaymentStatus,
  handlePaymentCallback,
  generateUPIIntent,
  generateTransactionId
};
