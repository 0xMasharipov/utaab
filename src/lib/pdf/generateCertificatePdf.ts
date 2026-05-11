import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib';
import { qrPngBytes } from './qr';

export interface CertificatePdfInput {
  participantName: string;
  eventName: string;
  speakerName: string | null;
  eventDate: string | null; // YYYY-MM-DD
  location: string | null;
  issuedBy: string;
  organizer?: string | null;
  partners?: string[] | null;
  serialNumber: string;
  certificateTitle: string;
  template?: {
    background_color?: string | null;
    primary_color?: string | null;
    secondary_color?: string | null;
    body_text?: string | null;
    signature_text?: string | null;
    footer_text?: string | null;
    show_qr?: boolean | null;
  } | null;
  verificationUrl: string;
}

function hexToRgb(hex?: string | null) {
  if (!hex) return rgb(1, 1, 1);
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(v.slice(0, 2), 16) / 255;
  const g = parseInt(v.slice(2, 4), 16) / 255;
  const b = parseInt(v.slice(4, 6), 16) / 255;
  return rgb(r, g, b);
}

/** Generate a UTAAB certificate PDF. Returns the PDF bytes. */
export async function generateCertificatePdf(input: CertificatePdfInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage(PageSizes.A4); // portrait
  // landscape: rotate
  page.setSize(PageSizes.A4[1], PageSizes.A4[0]);
  const { width, height } = page.getSize();

  const bgColor = hexToRgb(input.template?.background_color || '#061A3A');
  const fgColor = hexToRgb(input.template?.primary_color || '#FFFFFF');
  const accent = hexToRgb(input.template?.secondary_color || '#2D8CFF');

  // Background
  page.drawRectangle({ x: 0, y: 0, width, height, color: bgColor });
  // Inner border
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: accent,
    borderWidth: 2,
  });
  // Top accent bar
  page.drawRectangle({ x: 30, y: height - 80, width: width - 60, height: 4, color: accent });

  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const helvOblique = await pdf.embedFont(StandardFonts.HelveticaOblique);

  // Header — UTAAB
  page.drawText('UTAAB', {
    x: 60,
    y: height - 70,
    size: 22,
    font: helvBold,
    color: fgColor,
  });
  page.drawText('Blockchain-Verified Certificate', {
    x: width - 60 - helv.widthOfTextAtSize('Blockchain-Verified Certificate', 11),
    y: height - 65,
    size: 11,
    font: helv,
    color: fgColor,
  });

  // Title
  const title = input.certificateTitle || 'Certificate of Participation';
  const titleSize = 36;
  const titleW = helvBold.widthOfTextAtSize(title, titleSize);
  page.drawText(title, {
    x: (width - titleW) / 2,
    y: height - 160,
    size: titleSize,
    font: helvBold,
    color: fgColor,
  });

  // Subtitle "This certificate is proudly presented to"
  const subtitle = 'This certificate is proudly presented to';
  const subW = helv.widthOfTextAtSize(subtitle, 14);
  page.drawText(subtitle, {
    x: (width - subW) / 2,
    y: height - 200,
    size: 14,
    font: helv,
    color: fgColor,
  });

  // Participant name
  const name = input.participantName || 'Participant';
  let nameSize = 44;
  let nameW = helvBold.widthOfTextAtSize(name, nameSize);
  while (nameW > width - 160 && nameSize > 20) {
    nameSize -= 2;
    nameW = helvBold.widthOfTextAtSize(name, nameSize);
  }
  page.drawText(name, {
    x: (width - nameW) / 2,
    y: height - 260,
    size: nameSize,
    font: helvBold,
    color: accent,
  });
  // Underline
  page.drawLine({
    start: { x: (width - nameW) / 2 - 10, y: height - 270 },
    end: { x: (width + nameW) / 2 + 10, y: height - 270 },
    thickness: 1,
    color: fgColor,
    opacity: 0.6,
  });

  // Body
  const body =
    input.template?.body_text ||
    'is hereby awarded for active participation and successful engagement in the event.';
  const bodyW = helv.widthOfTextAtSize(body, 13);
  page.drawText(body, {
    x: (width - bodyW) / 2,
    y: height - 305,
    size: 13,
    font: helv,
    color: fgColor,
  });

  // Event line
  const eventLine = `${input.eventName}${input.speakerName ? ' — ' + input.speakerName : ''}`;
  const eventW = helvBold.widthOfTextAtSize(eventLine, 16);
  page.drawText(eventLine, {
    x: (width - eventW) / 2,
    y: height - 340,
    size: 16,
    font: helvBold,
    color: fgColor,
  });

  // Date / location
  const meta = [input.eventDate, input.location].filter(Boolean).join(' • ');
  if (meta) {
    const metaW = helvOblique.widthOfTextAtSize(meta, 12);
    page.drawText(meta, {
      x: (width - metaW) / 2,
      y: height - 365,
      size: 12,
      font: helvOblique,
      color: fgColor,
    });
  }

  // Issued by (left bottom)
  page.drawText('Issued by', { x: 80, y: 130, size: 10, font: helv, color: fgColor, opacity: 0.7 });
  page.drawText(input.issuedBy, { x: 80, y: 110, size: 14, font: helvBold, color: fgColor });
  if (input.template?.signature_text) {
    page.drawText(input.template.signature_text, {
      x: 80,
      y: 90,
      size: 10,
      font: helvOblique,
      color: fgColor,
      opacity: 0.8,
    });
  }
  if (input.partners && input.partners.length) {
    page.drawText(`In partnership with: ${input.partners.join(', ')}`, {
      x: 80,
      y: 70,
      size: 9,
      font: helv,
      color: fgColor,
      opacity: 0.7,
    });
  }

  // Serial (center bottom)
  const serialLabel = 'Serial Number';
  const serialW = helvBold.widthOfTextAtSize(input.serialNumber, 12);
  page.drawText(serialLabel, {
    x: (width - helv.widthOfTextAtSize(serialLabel, 9)) / 2,
    y: 95,
    size: 9,
    font: helv,
    color: fgColor,
    opacity: 0.7,
  });
  page.drawText(input.serialNumber, {
    x: (width - serialW) / 2,
    y: 75,
    size: 12,
    font: helvBold,
    color: accent,
  });

  // QR (right bottom)
  if (input.template?.show_qr !== false) {
    const qrBytes = await qrPngBytes(input.verificationUrl, 512);
    const qrImg = await pdf.embedPng(qrBytes);
    const qrSize = 90;
    page.drawImage(qrImg, {
      x: width - 80 - qrSize,
      y: 70,
      width: qrSize,
      height: qrSize,
    });
    page.drawText('Scan to verify', {
      x: width - 80 - qrSize,
      y: 55,
      size: 8,
      font: helv,
      color: fgColor,
      opacity: 0.7,
    });
  }

  // Footer
  if (input.template?.footer_text) {
    const f = input.template.footer_text;
    const fw = helv.widthOfTextAtSize(f, 8);
    page.drawText(f, {
      x: (width - fw) / 2,
      y: 40,
      size: 8,
      font: helv,
      color: fgColor,
      opacity: 0.6,
    });
  }

  return pdf.save();
}
