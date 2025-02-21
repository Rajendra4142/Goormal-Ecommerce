export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "NoobStore";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A new ecommerce site";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const lATEST_PRODUCTS_LIMIT =
  Number(process.env.lATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: "admin@example.com",
  password: "123456",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValues = {
  fullName: "Ram Bahadur",
  streetAddress: "124 Main st",
  city: "anytown",
  postalCode: "12345",
  country: "Nepal",
};
