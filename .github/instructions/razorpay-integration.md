# Razorpay Integration Guide

This guide provides instructions for integrating Razorpay payments in your frontend application.

## Backend Setup

The backend has been configured with the following endpoints:

- `POST /api/orders`: Creates a new order and returns Razorpay order details
- `POST /api/payments/razorpay/callback`: Handles Razorpay payment verification callback
- `GET /api/payments/:orderId`: Gets payment status for a specific order

## Frontend Integration

### 1. Install Razorpay Checkout

```bash
npm install razorpay
# OR
yarn add razorpay
```

### 2. Load Razorpay Script

Add the Razorpay script to your HTML:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 3. Implement Payment Flow

Here's an example implementation in React:

```jsx
import React, { useState } from 'react';
import axios from 'axios';

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  
  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      // Create order on your backend
      const response = await axios.post('/api/orders', {
        items: [
          { productId: 'product-id-1', quantity: 1 },
          { productId: 'product-id-2', quantity: 2 }
        ]
      });
      
      const { paymentInfo } = response.data.data;
      
      if (!paymentInfo || !paymentInfo.orderId) {
        console.error('Payment initialization failed');
        return;
      }
      
      // Initialize Razorpay
      const options = {
        key: paymentInfo.key_id,
        amount: paymentInfo.amount * 100, // Convert to paisa
        currency: paymentInfo.currency,
        name: 'Your Company Name',
        description: 'Order Payment',
        order_id: paymentInfo.orderId,
        handler: function(response) {
          // Handle successful payment
          verifyPayment(response);
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#3399cc'
        }
      };
      
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const verifyPayment = async (paymentResponse) => {
    try {
      const response = await axios.post('/api/payments/razorpay/callback', {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature
      });
      
      if (response.data.success) {
        alert('Payment successful!');
        // Redirect to order confirmation page
        // window.location.href = `/order-confirmation/${response.data.data.orderId}`;
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      alert('Payment verification failed. Please contact support.');
    }
  };
  
  return (
    <div>
      <h1>Checkout</h1>
      <button 
        onClick={handleCheckout} 
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default CheckoutPage;
```

### 4. Order Status Checking

You can check the payment status of an order using:

```jsx
const checkOrderStatus = async (orderId) => {
  try {
    const response = await axios.get(`/api/payments/${orderId}`);
    const paymentStatus = response.data.data;
    
    // Handle different payment statuses
    switch(paymentStatus.status) {
      case 'PAID':
        // Order successfully paid
        break;
      case 'PENDING':
        // Payment pending
        break;
      case 'PAYMENT_FAILED':
        // Payment failed
        break;
      default:
        // Other statuses
    }
    
    return paymentStatus;
  } catch (error) {
    console.error('Failed to check order status:', error);
  }
};
```

## Testing

For testing, you can use Razorpay's test mode with the following credentials:

- Test Card Number: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

Test UPI: success@razorpay

## Security Considerations

1. Always verify payments on your server-side using signature verification
2. Store sensitive payment info securely
3. Use HTTPS for all API calls
4. Implement proper error handling and logging