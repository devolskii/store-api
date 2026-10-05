export const COMPANIES = ["ikea", "liddy", "caressa", "marcos"] as const;
export type Company = (typeof COMPANIES)[number];

export type ProductFilter = {
  featured?: boolean;
  company?: Company;
  name?: { $regex: string; $options: "i" };
  price?: number;
  rating?: number;
  createdAt?: Date;
};
