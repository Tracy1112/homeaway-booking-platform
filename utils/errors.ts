import { ERROR_MESSAGES } from '@/constants'

// Custom error classes
export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.AUTH.LOGIN_REQUIRED) {
    super(message, 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.AUTH.ADMIN_REQUIRED) {
    super(message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404)
  }
}

// Error handling utilities
export const handleError = (
  error: unknown
): { message: string; statusCode?: number } => {
  console.error('Error occurred:', error)

  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }

  return {
    message: ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR,
  }
}

// Async error wrapper
export const asyncHandler = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      throw handleError(error)
    }
  }
}

// Validation helpers
export const validateRequired = (value: any, fieldName: string): void => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new ValidationError(`${fieldName} is required`)
  }
}

export const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL)
  }
}

export const validateDateRange = (checkIn: Date, checkOut: Date): void => {
  if (checkOut <= checkIn) {
    throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_DATE_RANGE)
  }
}

export const validatePrice = (price: number): void => {
  if (price <= 0) {
    throw new ValidationError('Price must be greater than 0')
  }
}

