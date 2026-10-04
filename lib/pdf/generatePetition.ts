// lib/pdf/generatePetition.ts
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export type RequestType = 'bulletin' | 'parking' | 'certificate' | 'petition';

interface PetitionData {
  requestType: RequestType;
  fullName: string;
  cnp: string;
  address: string;
  institution: string;
  subject: string;
}

export async function generatePetitionPdf(data: PetitionData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // Formatul A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  let y = height - 60;

  // Antet Instituție
  page.drawText(`CĂTRE: ${data.institution.toUpperCase()}`, {
    x: 50,
    y,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= 50;

  // Titlul cererii în funcție de tip
  let title = 'CERERE GENERALĂ';
  if (data.requestType === 'bulletin') title = 'CERERE PENTRU ELIBERAREA ACTULUI DE IDENTITATE';
  if (data.requestType === 'parking') title = 'CERERE PENTRU ATRIBUIRE LOC DE PARCARE REZIDENȚIALĂ';
  if (data.requestType === 'certificate') title = 'CERERE PENTRU ELIBERARE ADEVERINȚĂ FISCALĂ / DOMICILIU';
  if (data.requestType === 'petition') title = 'PETIȚIE / SESIZARE CIVICĂ';

  page.drawText(title, {
    x: width / 2 - (title.length * 3.5),
    y,
    size: 13,
    font: boldFont,
  });
  y -= 45;

  // Conținutul cererii
  const textContent = `Subsemnatul(a) ${data.fullName}, domiciliat(ă) în ${data.address}, identificat(ă) prin CNP ${data.cnp}, vă solicit prin prezenta următoarele:\n\n${data.subject}\n\nMenționez că anexezi la prezenta cerere actele doveditoare solicitate de cadrul legal în vigoare.`;

  page.drawText(textContent, {
    x: 50,
    y,
    size: 11,
    font,
    maxWidth: 495,
    lineHeight: 18,
  });

  // Dată și Semnătură
  const today = new Date().toLocaleDateString('ro-RO');
  page.drawText(`Data: ${today}`, { x: 50, y: 120, size: 11, font });
  page.drawText(`Semnătura: ______________`, { x: 350, y: 120, size: 11, font: boldFont });

  return await pdfDoc.save();
}