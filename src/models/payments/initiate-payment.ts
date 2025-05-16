import { z } from "zod";

export const cartItemSchema = z.object({
  Article: z.string(),
  Quantity: z.number(),
  Price: z.number(),
  Currency: z.enum(["EUR", "BGN"])
});

export const initiatePaymentOptionsSchema = z.object({
  WalletNumber: z.string(),
  Amount: z.number(),
  Currency: z.string().length(3),
  OrderID: z.string(),
  SID: z.string(),
  URL_OK: z.string().url(),
  URL_Cancel: z.string().url(),
  URL_Notify: z.string().url(),
  CardTokenRequest: z.number().min(0).max(2),
  KeyIndex: z.number(),
  CustomerEmail: z.string().email(),
  CustomerFirstNames: z.string(),
  CustomerFamilyName: z.string(),
  CustomerPhone: z.string(),
  CustomerCountry: z.string().length(3),
  CustomerCity: z.string(),
  CustomerZIPCode: z.string(),
  CustomerAddress: z.string(),
  CartItems: z.number(),
  Cart: z.array(cartItemSchema)
});

export type   InitiatePaymentOptions = z.infer<typeof initiatePaymentOptionsSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;