import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  website: text("website"),
  industry: text("industry"),
  businessType: text("business_type"), // 'B2B' or 'B2C'
  logo: text("logo"), // file path or URL
  primaryColor: text("primary_color").default("#2563EB"),
  brandFont: text("brand_font").default("Inter"),
  brandVoice: json("brand_voice").$type<string[]>(), // array of voice traits
  primaryObjective: text("primary_objective"), // 'leads', 'sales', 'awareness', 'traffic'
  monthlyBudget: integer("monthly_budget"), // in cents or dollars
  timeline: integer("timeline"), // in months
  icp: text("icp"), // ideal customer profile
  ageRange: text("age_range"),
  location: text("location"),
  painPoints: text("pain_points"),
  status: text("status").default("Active"), // 'Active', 'Onboarding', 'Paused'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export const strategies = pgTable("strategies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  clientId: varchar("client_id").references(() => clients.id),
  description: text("description"),
  sections: json("sections").$type<{ [key: string]: string }>(), // Store strategy sections as JSON
  status: text("status").default("Active"), // 'Active', 'Draft', 'Archived'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertStrategySchema = createInsertSchema(strategies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertStrategy = z.infer<typeof insertStrategySchema>;
export type Strategy = typeof strategies.$inferSelect;

export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  clientId: varchar("client_id").references(() => clients.id),
  strategyId: varchar("strategy_id").references(() => strategies.id),
  platform: text("platform"), // 'facebook', 'google', 'instagram', etc.
  status: text("status").default("Draft"), // 'Draft', 'Live', 'Paused', 'Completed'
  budget: integer("budget"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user: text("user").default("System"), // user name or "System"
  action: text("action").notNull(), // e.g., "created", "updated", "generated"
  target: text("target").notNull(), // e.g., "client", "strategy", "campaign"
  targetName: text("target_name"), // name of the target
  targetId: varchar("target_id"), // ID of the target
  clientId: varchar("client_id").references(() => clients.id), // associated client if applicable
  details: text("details"), // additional details
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export const clientAssets = pgTable("client_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => clients.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'document', 'image', 'url'
  url: text("url"), // file path or URL
  description: text("description"), // optional description
  fileSize: integer("file_size"), // in bytes
  mimeType: text("mime_type"), // MIME type for files
  isUrl: text("is_url").default("false"), // 'true' for URLs, 'false' for uploaded files
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertClientAssetSchema = createInsertSchema(clientAssets);
export type InsertClientAsset = z.infer<typeof insertClientAssetSchema>;
export type ClientAsset = typeof clientAssets.$inferSelect;
