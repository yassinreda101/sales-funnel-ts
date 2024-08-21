import React, { useEffect } from 'react';

interface QRCodeGeneratorProps {
  link: string;
  setQrCode: (qrCode: string) => void;
  addQrCode: boolean;
  color: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ link, setQrCode, addQrCode, color }) => {
  useEffect(() => {
    if (addQrCode && link) {
      const qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${link}&color=${color}`;
      setQrCode(qrCodeImage);
    }
  }, [addQrCode, link, color, setQrCode]);

  return null;
};

export default QRCodeGenerator;
