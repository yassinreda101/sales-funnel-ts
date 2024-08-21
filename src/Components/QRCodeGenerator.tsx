import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode.react';

interface QRCodeGeneratorProps {
  link: string;
  setQrCode: (qrCode: string) => void;
  color: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ link, setQrCode, color }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (link && qrRef.current) {
      const svg = qrRef.current.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL('image/png');
          setQrCode(pngFile);
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    }
  }, [link, setQrCode]);

  const fgColor = color.replace('text-', '').replace('-400', '');

  return (
    <div className="mt-2" ref={qrRef}>
      {link ? (
        <QRCode
          value={link}
          size={200}
          fgColor={fgColor}
          bgColor="#ffffff"
          level="H"
          includeMargin={false}
          renderAs="svg"
        />
      ) : (
        <p>Enter a link to generate QR code</p>
      )}
    </div>
  );
};

export default QRCodeGenerator;