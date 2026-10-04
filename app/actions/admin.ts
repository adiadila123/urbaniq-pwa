// app/actions/admin.ts
'use server';

import { db } from '@/lib/db';
import { reports } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// Preluare toate sesizările din Neon DB
export async function getAllReportsAction() {
  try {
    const data = await db
      .select()
      .from(reports)
      .orderBy(desc(reports.createdAt));

    return { success: true, reports: data };
  } catch (error) {
    console.error('Eroare încărcare sesizări admin:', error);
    return { success: false, reports: [] };
  }
}

// Actualizare status (pending | in_progress | resolved)
export async function updateReportStatusAction(reportId: string, status: string) {
  try {
    await db
      .update(reports)
      .set({ status })
      .where(eq(reports.id, reportId));

    return { success: true };
  } catch (error) {
    console.error('Eroare actualizare status:', error);
    return { success: false, message: 'Nu s-a putut schimba statusul.' };
  }
}