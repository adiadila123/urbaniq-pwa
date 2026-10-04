// lib/db/schema.ts
import { pgTable, uuid, text, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

// Baza de date pentru Rapoarte & Sesizări
export const reports = pgTable('reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  latitude: text('latitude').notNull(),
  longitude: text('longitude').notNull(),
  county: varchar('county', { length: 100 }),
  locality: varchar('locality', { length: 100 }),
  imageUrl: text('image_url'),
  resolvedImageUrl: text('resolved_image_url'),
  status: varchar('status', { length: 20 }).default('pending').notNull(), // 'pending', 'in_progress', 'resolved'
  upvotesCount: integer('upvotes_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tabel pentru Voturile Cetățenilor (+1)
export const reportUpvotes = pgTable('report_upvotes', {
  id: uuid('id').defaultRandom().primaryKey(),
  reportId: uuid('report_id').references(() => reports.id).notNull(),
  deviceToken: text('device_token').notNull(), // Amprentă unică utilizator local
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Abonamente Notificări Push PWA
export const pushSubscriptions = pgTable('push_subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  endpoint: text('endpoint').notNull().unique(),
  keys: text('keys').notNull(), // JSON stringify cu p256dh & auth
  createdAt: timestamp('created_at').defaultNow().notNull(),
});