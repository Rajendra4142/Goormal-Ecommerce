import {
  insertProductSchema,
  insertCardSchema,
  cartItemSchema,
  paymentResultSchema,
  shippingAddressSchema,
} from "@/lib/validators";
import { z } from "zod";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCardSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type paymentResult = z.infer<typeof paymentResultSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
