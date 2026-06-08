import { boolean, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // We use text because Supabase Auth IDs are UUID strings
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  phone: text("phone"),
  isBanned: boolean("is_banned").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull().default("Admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  imageBack: text("image_back"),
  priceGhs: integer("price_ghs").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  details: jsonb("details").notNull().$type<string[]>(),
  colors: jsonb("colors").$type<{id: string, name: string, hex: string}[]>(),
  stock: integer("stock"),
  isHidden: boolean("is_hidden").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(), // Using YG-YYYYMMDD-XXXX format
  userId: text("user_id"), // from Supabase Auth
  status: text("status").notNull().default("confirmed"),
  paymentMethod: text("payment_method").notNull(),
  paymentLabel: text("payment_label").notNull(),
  customer: jsonb("customer").notNull(), // We will cast this dynamically
  lines: jsonb("lines").notNull(), // We will cast this dynamically
  subtotal: integer("subtotal").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
