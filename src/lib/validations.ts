import { z } from "zod";

export const addressSchema = z.object({
  recipient: z.string().min(3, "Nama penerima minimal 3 karakter"),
  phone: z.string().min(9, "Nomor HP tidak valid"),
  province: z.string().min(2),
  city: z.string().min(2),
  district: z.string().min(2),
  postalCode: z.string().min(5),
  detail: z.string().min(10, "Alamat lengkap minimal 10 karakter"),
});

export const checkoutSchema = addressSchema.extend({
  courier: z.string().min(1, "Pilih kurir"),
  paymentMethod: z.string().min(1, "Pilih metode pembayaran"),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Konfirmasi password tidak sama",
    path: ["confirm"],
  });

export const productSchema = z.object({
  name: z.string().min(3),
  basePrice: z.coerce.number().min(1000),
  stock: z.coerce.number().min(0),
  categoryId: z.string().min(1),
  status: z.enum(["active", "draft"]),
});
