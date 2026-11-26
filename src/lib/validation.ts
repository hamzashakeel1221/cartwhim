import { z } from "zod";

// Pakistani mobile numbers: 03XXXXXXXXX or +923XXXXXXXXX
export const pkPhone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .refine((v) => /^(\+92|0092|92|0)3\d{9}$/.test(v), "Enter a valid mobile number, e.g. 0300 1234567");

export const checkoutSchema = z.object({
  name: z.string().trim().min(3, "Please enter your full name").max(80),
  phone: pkPhone,
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  city: z.string({ error: "Please choose your city" }).trim().min(2, "Please choose your city"),
  address: z.string().trim().min(10, "Please enter your full address with house and street").max(300),
  notes: z.string().trim().max(300).optional(),
  items: z.array(z.object({ slug: z.string(), qty: z.number().int().min(1).max(50) })).min(1, "Your cart is empty"),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;

const password = z.string().min(8, "Use at least 8 characters").max(100);

export const registerSchema = z.object({
  name: z.string().trim().min(3, "Please enter your full name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  phone: pkPhone,
  password,
});

export const loginSchema = z.object({
  login: z.string().trim().min(3, "Enter your email or mobile number"),
  password: z.string().min(1, "Enter your password"),
});

export const profileSchema = z.object({
  name: z.string().trim().min(3, "Please enter your full name").max(80),
  phone: pkPhone,
  city: z.string().trim().max(60).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
});

const optionalMoney = z.preprocess((v) => (v === "" || v == null ? null : v), z.coerce.number().int().min(0).max(10_000_000).nullable());

export const productInputSchema = z.object({
  name: z.string().trim().min(3, "Enter the product name").max(120),
  category: z.string().trim().min(1, "Choose a category"),
  supplier: z.string().trim().min(1, "Choose a supplier"),
  supplierSku: z.string().trim().max(60).optional(),
  cost: optionalMoney,
  price: z.coerce.number({ error: "Enter the price" }).int().min(1, "Enter the price").max(10_000_000),
  compareAt: optionalMoney,
  stock: z.coerce.number({ error: "Enter the stock" }).int().min(0).max(100_000),
  description: z.string().trim().min(10, "Write a short description (at least 10 characters)").max(3000),
  highlights: z.array(z.string().trim().min(1).max(120)).max(8),
  tags: z.array(z.enum(["trending", "deal", "new"])).max(3),
  scroll3d: z.boolean(),
  published: z.boolean(),
});
