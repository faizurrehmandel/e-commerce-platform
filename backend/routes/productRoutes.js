/**
 * @file Product routes for the E-Commerce Platform API.
 * @module routes/productRoutes
 * @requires express - Express framework for building router.
 * @requires ../controllers/productController - Controller functions for product logic.
 * @requires ../middleware/authMiddleware - Middleware for authentication and authorization.
 */

import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

/**
 * @route   GET /api/products
 * @desc    Fetch all products with optional search and pagination
 * @access  Public
 *
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private/Admin
 */
router.route('/').get(getProducts).post(protect, admin, createProduct);

/**
 * @route   GET /api/products/top
 * @desc    Get top rated products
 * @access  Public
 */
router.get('/top', getTopProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Fetch a single product by its ID
 * @access  Public
 *
 * @route   PUT /api/products/:id
 * @desc    Update a product by its ID
 * @access  Private/Admin
 *
 * @route   DELETE /api/products/:id
 * @desc    Delete a product by its ID
 * @access  Private/Admin
 */
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

/**
 * @route   POST /api/products/:id/reviews
 * @desc    Create a new review for a product
 * @access  Private
 */
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);

export default router;