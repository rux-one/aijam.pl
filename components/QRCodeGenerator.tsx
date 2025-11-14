'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
}

export default function QRCodeGenerator({ url, size = 256 }: QRCodeGeneratorProps) {
  return (
    <div className="inline-block p-4 bg-white rounded-lg">
      <QRCodeSVG
        value={url}
        size={size}
        level="H"
        includeMargin={true}
        fgColor="#0369a1"
        bgColor="#ffffff"
      />
    </div>
  );
}
