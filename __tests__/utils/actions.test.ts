/**
 * Tests for utils/actions.ts
 * 
 * This test file covers Server Actions which are critical business logic.
 * Focus areas:
 * - Profile management (create, update, fetch)
 * - Property management (create, update, delete)
 * - Booking operations
 * - Review system
 * - Error handling
 */

import {
  createProfileAction,
  fetchProfile,
  updateProfileAction,
  fetchProfileImage,
  fetchProperties,
  fetchPropertyDetails,
} from '@/utils/actions';
import {
  ValidationError,
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '@/utils/errors';
import db from '@/utils/db';
import { currentUser, clerkClient } from '@clerk/nextjs/server';

// Mock dependencies
jest.mock('@/utils/db', () => ({
  __esModule: true,
  default: {
    profile: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    property: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    booking: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    review: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('@clerk/nextjs/server', () => ({
  currentUser: jest.fn(),
  clerkClient: {
    users: {
      updateUserMetadata: jest.fn(),
    },
  },
  auth: jest.fn(),
}));

jest.mock('@/utils/supabase', () => ({
  uploadImage: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
  unstable_cache: jest.fn((fn) => fn),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Profile Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProfileAction', () => {
    const mockFormData = new FormData();
    mockFormData.append('firstName', 'John');
    mockFormData.append('lastName', 'Doe');
    mockFormData.append('username', 'johndoe');

    const mockUser = {
      id: 'user_123',
      emailAddresses: [{ emailAddress: 'john@example.com' }],
      imageUrl: 'https://example.com/avatar.jpg',
    };

    it('should create a profile successfully', async () => {
      const { redirect } = require('next/navigation');
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      (db.profile.findFirst as jest.Mock).mockResolvedValue(null);
      (db.profile.create as jest.Mock).mockResolvedValue({
        id: 'profile_123',
        clerkId: 'user_123',
        username: 'johndoe',
      });
      (clerkClient.users.updateUserMetadata as jest.Mock).mockResolvedValue({});

      await createProfileAction({}, mockFormData);

      expect(db.profile.findFirst).toHaveBeenCalledWith({
        where: { username: 'johndoe' },
      });
      expect(db.profile.create).toHaveBeenCalledWith({
        data: {
          clerkId: 'user_123',
          email: 'john@example.com',
          profileImage: 'https://example.com/avatar.jpg',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
        },
      });
      expect(clerkClient.users.updateUserMetadata).toHaveBeenCalledWith(
        'user_123',
        {
          privateMetadata: {
            hasProfile: true,
          },
        }
      );
      // createProfileAction redirects on success
      expect(redirect).toHaveBeenCalledWith('/');
    });

    it('should throw ConflictError if username already exists', async () => {
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      (db.profile.findFirst as jest.Mock).mockResolvedValue({
        id: 'existing_profile',
        username: 'johndoe',
      });

      const result = await createProfileAction({}, mockFormData);

      expect(result).toHaveProperty('message');
      expect(result.message).toContain('Username already exists');
      expect(db.profile.create).not.toHaveBeenCalled();
    });

    it('should handle authentication error when user is not logged in', async () => {
      (currentUser as jest.Mock).mockResolvedValue(null);

      const result = await createProfileAction({}, mockFormData);

      expect(result).toHaveProperty('message');
      expect(db.profile.create).not.toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      
      const invalidFormData = new FormData();
      invalidFormData.append('firstName', ''); // Invalid: empty

      const result = await createProfileAction({}, invalidFormData);

      expect(result).toHaveProperty('message');
      expect(db.profile.create).not.toHaveBeenCalled();
    });
  });

  describe('fetchProfile', () => {
    const mockUser = {
      id: 'user_123',
      privateMetadata: { hasProfile: true },
    };

    it('should fetch profile successfully', async () => {
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      (db.profile.findUnique as jest.Mock).mockResolvedValue({
        id: 'profile_123',
        clerkId: 'user_123',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
      });

      const profile = await fetchProfile();

      expect(db.profile.findUnique).toHaveBeenCalledWith({
        where: { clerkId: 'user_123' },
      });
      expect(profile).toHaveProperty('username', 'johndoe');
    });

    it('should redirect if profile does not exist', async () => {
      const { redirect } = require('next/navigation');
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      (db.profile.findUnique as jest.Mock).mockResolvedValue(null);

      await fetchProfile();

      expect(redirect).toHaveBeenCalledWith('/profile/create');
    });

    it('should handle authentication error', async () => {
      (currentUser as jest.Mock).mockResolvedValue(null);

      await expect(fetchProfile()).rejects.toThrow(AuthenticationError);
    });
  });

  describe('updateProfileAction', () => {
    const mockUser = {
      id: 'user_123',
      privateMetadata: { hasProfile: true },
    };

    const mockFormData = new FormData();
    mockFormData.append('firstName', 'Jane');
    mockFormData.append('lastName', 'Smith');
    mockFormData.append('username', 'janesmith');

    it('should update profile successfully', async () => {
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      (db.profile.findFirst as jest.Mock).mockResolvedValue(null); // No conflict
      (db.profile.update as jest.Mock).mockResolvedValue({
        id: 'profile_123',
        username: 'janesmith',
        firstName: 'Jane',
        lastName: 'Smith',
      });

      const result = await updateProfileAction({}, mockFormData);

      expect(db.profile.update).toHaveBeenCalledWith({
        where: { clerkId: 'user_123' },
        data: {
          firstName: 'Jane',
          lastName: 'Smith',
          username: 'janesmith',
        },
      });
      expect(result).toHaveProperty('message');
    });

    it('should throw ConflictError if username is taken by another user', async () => {
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      (db.profile.findFirst as jest.Mock).mockResolvedValue({
        id: 'other_profile',
        username: 'janesmith',
      });

      const result = await updateProfileAction({}, mockFormData);

      expect(result).toHaveProperty('message');
      expect(result.message).toContain('Username already exists');
      expect(db.profile.update).not.toHaveBeenCalled();
    });
  });

  describe('fetchProfileImage', () => {
    it('should return profile image when user is logged in', async () => {
      const mockUser = {
        id: 'user_123',
      };
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      (db.profile.findUnique as jest.Mock).mockResolvedValue({
        profileImage: 'https://example.com/image.jpg',
      });

      const image = await fetchProfileImage();

      expect(image).toBe('https://example.com/image.jpg');
      expect(db.profile.findUnique).toHaveBeenCalledWith({
        where: { clerkId: 'user_123' },
        select: { profileImage: true },
      });
    });

    it('should return null when user is not logged in', async () => {
      (currentUser as jest.Mock).mockResolvedValue(null);

      const image = await fetchProfileImage();

      expect(image).toBeNull();
      expect(db.profile.findUnique).not.toHaveBeenCalled();
    });
  });
});

describe('Property Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProperties', () => {
    it('should fetch properties with search and category filters', async () => {
      const mockProperties = [
        {
          id: 'prop_1',
          name: 'Beach House',
          price: 100,
          image: 'https://example.com/image.jpg',
        },
        {
          id: 'prop_2',
          name: 'Mountain Cabin',
          price: 150,
          image: 'https://example.com/image2.jpg',
        },
      ];

      (db.property.findMany as jest.Mock).mockResolvedValue(mockProperties);

      const properties = await fetchProperties({
        search: 'beach',
        category: 'house',
      });

      expect(db.property.findMany).toHaveBeenCalled();
      expect(properties).toHaveLength(2);
    });

    it('should return empty array when no properties found', async () => {
      (db.property.findMany as jest.Mock).mockResolvedValue([]);

      const properties = await fetchProperties({});

      expect(properties).toEqual([]);
    });
  });

  describe('fetchPropertyDetails', () => {
    it('should fetch property details with all relations', async () => {
      const mockProperty = {
        id: 'prop_123',
        name: 'Test Property',
        price: 100,
        profile: {
          id: 'profile_123',
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      (db.property.findUnique as jest.Mock).mockResolvedValue(mockProperty);

      const property = await fetchPropertyDetails('prop_123');

      // Verify the function was called (exact structure may vary)
      expect(db.property.findUnique).toHaveBeenCalled();
      const callArgs = (db.property.findUnique as jest.Mock).mock.calls[0][0];
      expect(callArgs.where.id).toBe('prop_123');
      expect(callArgs.include).toBeDefined();
      expect(property).toEqual(mockProperty);
    });

    it('should return null when property not found', async () => {
      (db.property.findUnique as jest.Mock).mockResolvedValue(null);

      const property = await fetchPropertyDetails('nonexistent');

      expect(property).toBeNull();
    });
  });
});

describe('Booking Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    id: 'user_123',
    privateMetadata: { hasProfile: true },
  };

  describe('createBookingAction', () => {
    it('should create booking successfully', async () => {
      const { createBookingAction } = require('@/utils/actions');
      const { redirect } = require('next/navigation');
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      
      const mockProperty = {
        id: 'prop_123',
        price: 100,
      };
      
      const prevState = {
        propertyId: 'prop_123',
        checkIn: new Date('2024-01-01'),
        checkOut: new Date('2024-01-04'),
      };
      
      (db.booking.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });
      (db.property.findUnique as jest.Mock).mockResolvedValue(mockProperty);
      (db.booking.findFirst as jest.Mock).mockResolvedValue(null); // No conflict
      (db.booking.create as jest.Mock).mockResolvedValue({
        id: 'booking_123',
        propertyId: 'prop_123',
        totalNights: 3,
      });

      await createBookingAction(prevState, new FormData());

      expect(db.property.findUnique).toHaveBeenCalled();
      expect(db.booking.create).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalled();
    });

    it('should handle property not found', async () => {
      const { createBookingAction } = require('@/utils/actions');
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      
      const prevState = {
        propertyId: 'nonexistent',
        checkIn: new Date('2024-01-01'),
        checkOut: new Date('2024-01-04'),
      };
      
      (db.booking.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });
      (db.property.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await createBookingAction(prevState, new FormData());

      expect(result).toHaveProperty('message');
      expect(db.booking.create).not.toHaveBeenCalled();
    });

    it('should handle booking conflicts', async () => {
      const { createBookingAction } = require('@/utils/actions');
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      
      const mockProperty = {
        id: 'prop_123',
        price: 100,
      };
      
      const prevState = {
        propertyId: 'prop_123',
        checkIn: new Date('2024-01-01'),
        checkOut: new Date('2024-01-04'),
      };
      
      (db.booking.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });
      (db.property.findUnique as jest.Mock).mockResolvedValue(mockProperty);
      (db.booking.findFirst as jest.Mock).mockResolvedValue({
        id: 'existing_booking',
      }); // Conflict exists

      const result = await createBookingAction(prevState, new FormData());

      expect(result).toHaveProperty('message');
      expect(result.message).toContain('booked');
      expect(db.booking.create).not.toHaveBeenCalled();
    });

    it('should validate date range', async () => {
      const { createBookingAction } = require('@/utils/actions');
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      
      const prevState = {
        propertyId: 'prop_123',
        checkIn: new Date('2024-01-04'),
        checkOut: new Date('2024-01-01'), // Invalid: checkOut before checkIn
      };
      
      (db.booking.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });

      const result = await createBookingAction(prevState, new FormData());

      expect(result).toHaveProperty('message');
      expect(result.message).toContain('after');
      expect(db.booking.create).not.toHaveBeenCalled();
    });
  });
});

describe('Review Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    id: 'user_123',
    privateMetadata: { hasProfile: true },
  };

  describe('createReviewAction', () => {
    const mockFormData = new FormData();
    mockFormData.append('propertyId', 'prop_123');
    mockFormData.append('rating', '5');
    mockFormData.append('comment', 'Great place!');

    it('should create review successfully', async () => {
      const { createReviewAction } = require('@/utils/actions');
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      
      (db.property.findUnique as jest.Mock).mockResolvedValue({ id: 'prop_123' });
      (db.review.findFirst as jest.Mock).mockResolvedValue(null); // No existing review
      (db.review.create as jest.Mock).mockResolvedValue({
        id: 'review_123',
        rating: 5,
      });

      const result = await createReviewAction({}, mockFormData);

      expect(db.review.create).toHaveBeenCalled();
      expect(result).toHaveProperty('message');
    });

    it('should prevent duplicate reviews', async () => {
      const { createReviewAction } = require('@/utils/actions');
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      
      (db.property.findUnique as jest.Mock).mockResolvedValue({ id: 'prop_123' });
      (db.review.findFirst as jest.Mock).mockResolvedValue({
        id: 'existing_review',
      }); // Review already exists

      const result = await createReviewAction({}, mockFormData);

      expect(result).toHaveProperty('message');
      expect(result.message).toContain('already');
      expect(db.review.create).not.toHaveBeenCalled();
    });

    it('should handle property not found', async () => {
      const { createReviewAction } = require('@/utils/actions');
      (currentUser as jest.Mock).mockResolvedValue(mockUser);
      
      (db.property.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await createReviewAction({}, mockFormData);

      expect(result).toHaveProperty('message');
      expect(result.message).toContain('not found');
      expect(db.review.create).not.toHaveBeenCalled();
    });
  });
});

