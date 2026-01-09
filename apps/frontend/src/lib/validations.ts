import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerConsumerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Invalid phone number'),
  addressZipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'Invalid ZIP code'),
  addressStreet: z.string().min(1, 'Street is required'),
  addressNumber: z.string().min(1, 'Number is required'),
  addressComplement: z.string().optional(),
  addressNeighborhood: z.string().min(1, 'Neighborhood is required'),
  addressCity: z.string().min(1, 'City is required'),
  addressState: z.string().length(2, 'State must be 2 characters'),
});

export const registerSupermarketSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  tradingName: z.string().min(2, 'Trading name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Invalid phone number'),
  cnpj: z.string().regex(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, 'Invalid CNPJ'),
  addressZipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'Invalid ZIP code'),
  addressStreet: z.string().min(1, 'Street is required'),
  addressNumber: z.string().min(1, 'Number is required'),
  addressComplement: z.string().optional(),
  addressNeighborhood: z.string().min(1, 'Neighborhood is required'),
  addressCity: z.string().min(1, 'City is required'),
  addressState: z.string().length(2, 'State must be 2 characters'),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  brand: z.string().optional(),
  barcode: z.string().length(13, 'Barcode must be 13 digits').optional().or(z.literal('')),
  priceCents: z.number().int().positive('Price must be positive'),
  promoPriceCents: z.number().int().positive().optional(),
  categoryId: z.string().uuid('Invalid category'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  unit: z.enum(['un', 'kg', 'g', 'l', 'ml']),
});

export const createListSchema = z.object({
  name: z.string().min(1, 'List name is required').max(100, 'Name too long'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Invalid phone number'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterConsumerFormData = z.infer<typeof registerConsumerSchema>;
export type RegisterSupermarketFormData = z.infer<typeof registerSupermarketSchema>;
export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type CreateListFormData = z.infer<typeof createListSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
