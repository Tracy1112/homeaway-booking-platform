// Booking constants
export const BOOKING_CONSTANTS = {
  CLEANING_FEE: 21,
  SERVICE_FEE: 40,
  TAX_RATE: 0.1, // 10%
} as const

// File upload constants
export const FILE_CONSTANTS = {
  MAX_UPLOAD_SIZE: 1024 * 1024, // 1MB
  ACCEPTED_FILE_TYPES: ['image/'],
  SUPABASE_BUCKET: 'home-away-draft',
} as const

// UI constants
export const UI_CONSTANTS = {
  TEXT_TRUNCATION: {
    PROPERTY_NAME: 30,
    PROPERTY_TAGLINE: 40,
  },
  IMAGE_SIZES: {
    PROPERTY_CARD_HEIGHT: 300,
    PROFILE_IMAGE_SIZE: 24,
    REVIEW_IMAGE_SIZE: 48,
  },
} as const

// API constants
export const API_CONSTANTS = {
  DEBOUNCE_DELAY: 500,
  CACHE_CONTROL: '3600',
} as const

// Validation constants
export const VALIDATION_CONSTANTS = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_USERNAME_LENGTH: 2,
  MAX_USERNAME_LENGTH: 30,
  MIN_PROPERTY_NAME_LENGTH: 3,
  MAX_PROPERTY_NAME_LENGTH: 100,
  MIN_PROPERTY_DESCRIPTION_LENGTH: 10,
  MAX_PROPERTY_DESCRIPTION_LENGTH: 1000,
  MIN_PRICE: 1,
  MAX_PRICE: 10000,
  MIN_GUESTS: 1,
  MAX_GUESTS: 20,
  MIN_BEDROOMS: 0,
  MAX_BEDROOMS: 10,
  MIN_BEDS: 1,
  MAX_BEDS: 20,
  MIN_BATHS: 0,
  MAX_BATHS: 10,
} as const

// Error messages
export const ERROR_MESSAGES = {
  AUTH: {
    LOGIN_REQUIRED: 'You must be logged in to access this route',
    PROFILE_REQUIRED: 'Please create a profile first',
    ADMIN_REQUIRED: 'Admin access required',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_FILE_TYPE: 'File must be an image',
    FILE_TOO_LARGE: 'File size must be less than 1 MB',
    INVALID_DATE_RANGE: 'Check-out date must be after check-in date',
  },
  GENERAL: {
    UNKNOWN_ERROR: 'An unexpected error occurred',
    NETWORK_ERROR: 'Network error. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
  },
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  PROFILE_CREATED: 'Profile created successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PROPERTY_CREATED: 'Property created successfully',
  PROPERTY_UPDATED: 'Property updated successfully',
  BOOKING_CREATED: 'Booking created successfully',
  REVIEW_SUBMITTED: 'Review submitted successfully',
  FAVORITE_ADDED: 'Added to favorites',
  FAVORITE_REMOVED: 'Removed from favorites',
} as const

// Route paths
export const ROUTES = {
  HOME: '/',
  PROFILE: '/profile',
  PROFILE_CREATE: '/profile/create',
  PROPERTIES: '/properties',
  BOOKINGS: '/bookings',
  FAVORITES: '/favorites',
  RENTALS: '/rentals',
  REVIEWS: '/reviews',
  CHECKOUT: '/checkout',
  ADMIN: '/admin',
} as const

// Environment variables
export const ENV_VARS = {
  ADMIN_USER_ID: process.env.ADMIN_USER_ID,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
} as const

