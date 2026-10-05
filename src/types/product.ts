export const COMPANIES = ["ikea", "liddy", "caressa", "marcos"] as const;
export type Company = (typeof COMPANIES)[number];

export type ProductFilter = {
  featured?: boolean;
  company?: Company;
  name?: string;
  price?: number;
  rating?: number;
  createdAt?: Date;
};
