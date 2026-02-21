import { z } from 'zod';

// Auth validations
export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password too long'),
});

export const signupSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password too long'),
  displayName: z.string().trim().max(100, 'Name too long').optional(),
});

// Contact validations
export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name too long'),
  phone_number: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number. Use E.164 format (e.g., +919876543210)'),
  relationship: z.string().trim().max(50, 'Relationship too long').optional(),
});

// PIN validations
export const pinSchema = z.string().regex(/^\d{4}$/, 'PIN must be exactly 4 digits');

export const duressSetupSchema = z.object({
  pin: pinSchema,
  duressPin: pinSchema.optional(),
}).refine(
  (data) => !data.duressPin || data.pin !== data.duressPin,
  { message: 'Duress PIN must be different from your main PIN', path: ['duressPin'] }
);

// Emergency note validation
export const emergencyNoteSchema = z.object({
  content: z.string().trim().min(1, 'Note cannot be empty').max(2000, 'Note too long'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ContactFormInput = z.infer<typeof contactSchema>;
export type PinInput = z.infer<typeof pinSchema>;
