// app/actions/reports.ts
'use server';

import { db } from '@/lib/db';
import { reports, reportUpvotes } from '@/lib/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { Resend } from 'resend';
import { getInstitutionEmail } from '@/lib/institutionsEmailMap';

// Inițializare Resend cu cheia din .env.local
const resend = new Resend(process.env.RESEND_API_KEY || '');

// Action 1: Creare sesizare nouă + Trimitere e-mail automat către Registratură
export async function createReportAction(formData: {
  title: string;
  description: string;
  category: string;
  county: string;
  locality: string;
  latitude?: string;
  longitude?: string;
  imageUrl?: string;
}) {
  try {
    // 1. Salvare în baza de date Neon DB
    const [newReport] = await db
      .insert(reports)
      .values({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        county: formData.county,
        locality: formData.locality,
        latitude: formData.latitude || '0.0',
        longitude: formData.longitude || '0.0',
        imageUrl: formData.imageUrl || null,
        status: 'pending',
      })
      .returning();

    // 2. Identificăm instituția competentă / registratura primăriei
    const institution = getInstitutionEmail(formData.county, formData.locality);

    // 3. Trimitere e-mail automat pe fundal către registratura instituției
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Urbaniq Sesizari <sesizari@urbaniq.ro>',
          to: [institution.email],
          subject: `[Sesizare Civică OG 27/2002] ${formData.title} - ${formData.locality}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #18181b; background-color: #f4f4f5; border-radius: 12px;">
              <h2 style="color: #2563eb; margin-bottom: 4px;">SESIZARE CIVICĂ OFICIALĂ</h2>
              <p style="font-size: 12px; color: #71717a; margin-top: 0;">Transmisă prin intermediul platformei Urbaniq</p>
              
              <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e4e4e7; margin-top: 16px;">
                <p><b>Către:</b> ${institution.name}</p>
                <p><b>Subiect:</b> ${formData.title}</p>
                <p><b>Categorie:</b> ${formData.category}</p>
                <p><b>Locație:</b> ${formData.locality}, Jud. ${formData.county}</p>
                <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 12px 0;" />
                <p><b>Descrierea problemei din teren:</b></p>
                <p style="white-space: pre-line; color: #3f3f46;">${formData.description || 'Fără descriere detaliată.'}</p>
                ${
                  formData.imageUrl
                    ? `<p style="margin-top: 12px;"><b>Fotografie atașată:</b> <br /><a href="${formData.imageUrl}" style="color: #2563eb;">Deschide Imaginea din Teren</a></p>`
                    : ''
                }
              </div>

              <p style="font-size: 11px; color: #a1a1aa; margin-top: 20px;">
                Prezenta comunicare reprezintă o petiție/sesizare civică transmisă conform cadrului legal din România (OG nr. 27/2002).
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Atenție: E-mailul automat Resend nu a putut fi trimis:', emailErr);
      }
    }

    return {
      success: true,
      reportId: newReport?.id,
      institutionEmail: institution.email,
      institutionName: institution.name,
    };
  } catch (error) {
    console.error('Eroare salvare sesizare:', error);
    return { success: false, message: 'Nu s-a putut salva sesizarea.' };
  }
}

// Action 2: Votare / Susținere sesizare (+1)
export async function upvoteReportAction(reportId: string, deviceToken: string) {
  try {
    // Verificăm dacă utilizatorul a votat deja de pe acest dispozitiv
    const existing = await db
      .select()
      .from(reportUpvotes)
      .where(
        and(
          eq(reportUpvotes.reportId, reportId),
          eq(reportUpvotes.deviceToken, deviceToken)
        )
      );

    if (existing.length > 0) {
      return { success: false, message: 'Ai susținut deja această sesizare.' };
    }

    // Înregistrăm votul
    await db.insert(reportUpvotes).values({ reportId, deviceToken });

    // Incrementăm contorul de susțineri în tabelul principal
    await db
      .update(reports)
      .set({ upvotesCount: sql`${reports.upvotesCount} + 1` })
      .where(eq(reports.id, reportId));

    return { success: true };
  } catch (error) {
    console.error('Eroare votare sesizare:', error);
    return { success: false, message: 'Eroare la salvarea votului.' };
  }
}