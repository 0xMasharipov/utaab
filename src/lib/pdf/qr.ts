import QRCode from 'qrcode';

export async function qrPngDataUrl(text: string, size = 512): Promise<string> {
  return QRCode.toDataURL(text, {
    width: size,
    margin: 1,
    color: { dark: '#061A3A', light: '#FFFFFF' },
    errorCorrectionLevel: 'M',
  });
}

export async function qrPngBytes(text: string, size = 512): Promise<Uint8Array> {
  const buf = await QRCode.toBuffer(text, {
    width: size,
    margin: 1,
    color: { dark: '#061A3A', light: '#FFFFFF' },
    errorCorrectionLevel: 'M',
  });
  return new Uint8Array(buf);
}
