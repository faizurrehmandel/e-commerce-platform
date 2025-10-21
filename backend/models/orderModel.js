```javascript
import mongoose from 'mongoose';

/**
 * @description Mongoose schema for the Order collection.
 * This schema defines the structure of an order document in the database,
 * including details about the user, ordered items, shipping, payment, and prices.
 *
 * @property {mongoose.Schema.Types.ObjectId} user - Reference to the User who placed the order.
 * @property {Array<Object>} orderItems - An array of items included in the order.
 *   @property {string} orderItems.name - The name of the product.
 *   @property {number} orderItems.qty - The quantity of the product ordered.
 *   @property {string} orderItems.image - The image URL of the product.
 *   @property {number} orderItems.price - The price of the product at the time of order.
 *   @property {mongoose.Schema.Types.ObjectId} orderItems.product - Reference to the Product document.
 * @property {Object} shippingAddress - The shipping address for the order.
 *   @property {string} shippingAddress.address - Street address.
 *   @property {string} shippingAddress.city - City.
 *   @property {string} shippingAddress.postalCode - Postal or ZIP code.
 *   @property {string} shippingAddress.country - Country.
 * @property {string} paymentMethod - The method of payment (e.g., 'Stripe', 'PayPal').
 * @property {Object} paymentResult - Stores results from the payment gateway (e.g., Stripe).
 *   @property {string} paymentResult.id - The transaction ID from the payment provider.
 *   @property {string} paymentResult.status - The status of the payment (e.g., 'succeeded').
 *   @property {string} paymentResult.update_time - The timestamp when the payment was last updated.
 *   @property {string} paymentResult.email_address - The email address of the payer.
 * @property {number} itemsPrice - The subtotal for all items before tax and shipping.
 * @property {number} taxPrice - The amount of tax for the order.
 * @property {number} shippingPrice - The cost of shipping.
 * @property {number} totalPrice - The final total price for the order (itemsPrice + taxPrice + shippingPrice).
 * @property {boolean} isPaid - Flag indicating if the order has been paid.
 * @property {Date} paidAt - The timestamp when the order was paid.
 * @property {boolean} isDelivered - Flag indicating if the order has been delivered.
 * @property {Date} deliveredAt - The timestamp when the order was delivered.
 * @property {Date} createdAt - Automatically generated timestamp for when the document was created.
 * @property {Date} updatedAt - Automatically generated timestamp for when the document was last updated.
 */
const orderSchema = new mongoose.Schema(
  {
    // Reference to the user who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Establishes a relationship with the User model
    },
    // An array of items in the order
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product', // Establishes a relationship with the Product model
        },
      },
    ],
    // Shipping address details
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    // Payment method used
    paymentMethod: {
      type: String,
      required: true,
    },
    // Details returned from the payment gateway after a successful transaction
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    // Calculated prices for the order
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    // Status flags for the order
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// Create the Order model from the schema
const Order = mongoose.model('Order', orderSchema);

export default Order;
```