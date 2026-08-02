/**
 * Service to manage Razorpay payments (Test Mode)
 */
const createOrder = async (amountInINR, receiptId) => {
  // Placeholder implementation for Razorpay order creation
  return {
    orderId: 'order_test_9988776655',
    amount: amountInINR * 100,
    currency: 'INR'
  };
};

module.exports = {
  createOrder
};
