import {
  insertProductSchema,
  insertCardSchema,
  cartItemSchema,
  paymentResultSchema,
  shippingAddressSchema,
  insertOrderItemSchema,
  insertOrderSchema,
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
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderItems: OrderItem[];
  user: {
    name: string;
    email: string;
  };
};

export type PaymentResult = z.infer<typeof paymentResultSchema>;
