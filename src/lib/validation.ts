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
