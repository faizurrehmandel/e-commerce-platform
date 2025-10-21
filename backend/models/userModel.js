const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @typedef User
 * @property {string} name.required - The user's full name.
 * @property {string} email.required - The user's email address (must be unique).
 * @property {string} password.required - The user's hashed password.
 * @property {string} role.required - The user's role (e.g., 'user', 'admin').
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name.'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address.',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password.'],
      minlength: [8, 'Password must be at least 8 characters long.'],
      // Do not select the password field by default when querying for a user
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either "user" or "admin".',
      },
      default: 'user',
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

/**
 * Mongoose pre-save middleware to hash the user's password before saving.
 * This function is automatically called before a user document is saved to the database.
 */
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a salt with a cost factor of 12
    const salt = await bcrypt.genSalt(12);
    // Hash the password with the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Mongoose instance method to compare a candidate password with the user's hashed password.
 * @param {string} candidatePassword - The plain-text password to compare.
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, otherwise false.
 */
userSchema.methods.matchPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;