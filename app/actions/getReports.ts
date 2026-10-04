'use server';

import { db } from '@/lib/db';
import { reports } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function getReports() {
  try {
    return await db.select().from(reports).orderBy(desc(reports.createdAt));
  } catch (error) {
    console.error('Eroare la preluarea raportărilor din Neon:', error);
    return [];
  }
}