export const COMPANIES = ["ikea", "liddy", "caressa", "marcos"] as const;
export type Company = (typeof COMPANIES)[number];
type Field = {
  [operator: string]: number;
};
export type Options = "price" | "rating";

export type ProductFilter = {
  featured?: boolean;
  company?: Company;
  name?: { $regex: string; $options: "i" };
  createdAt?: Date;
} & {
  [K in Options]?: number | Field;
};
