import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const role = pgEnum("Role", [
  "USER",
  "ADMIN",
  "SUPERADMIN",
  "SUPERVISOR",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fname: varchar("fname", { length: 255 }).notNull(),
  lname: varchar("lname", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: role().notNull().default("USER"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const timeSlots = pgTable("time_slots", {
  id: serial("id").primaryKey(),
  activityId: integer("activity_id")
    .notNull()
    .references(() => activities.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  maxParticipants: integer("max_participants"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  timeSlotId: integer("time_slot_id")
    .notNull()
    .references(() => timeSlots.id),
  createdAt: timestamp("created_at").defaultNow(),
});
