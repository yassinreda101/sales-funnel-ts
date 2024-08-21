import React, { useRef, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaSnapchat } from 'react-icons/fa';
import { TbLetterX } from 'react-icons/tb';

interface CardProps {
  companyName: string;
  employeeName: string;
  font: string;
  size: number;
  color: string;
  cardColor: string;
  socialMedia: string[];
  isFlipped: boolean;
  addQrCode: boolean;
  showQrCode: boolean;
  qrCode: string;
  isDefault: boolean;
  handleSwipe: () => void;
  setError: (error: string) => void;
  userType: 'individual' | 'business';
  logo: string | null;
  logoScale: number;
  iconSize: number;
}

const Card: React.FC<CardProps> = ({
  companyName,
  employeeName,
  font,
  size,
  color,
  cardColor,
  socialMedia,
  isFlipped,
  addQrCode,
  showQrCode,
  qrCode,
  isDefault,
  handleSwipe,
  setError,
  userType,
  logo,
  logoScale,
  iconSize,
}) => {
  const companyNameRef = useRef<HTMLHeadingElement>(null);
  const employeeNameRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const socialMediaIcons: { [key: string]: JSX.Element } = {
    facebook: <FaFacebook style={{ fontSize: `${iconSize}px` }} />,
    x: <TbLetterX style={{ fontSize: `${iconSize}px` }} />,
    instagram: <FaInstagram style={{ fontSize: `${iconSize}px` }} />,
    linkedin: <FaLinkedin style={{ fontSize: `${iconSize}px` }} />,
    github: <FaGithub style={{ fontSize: `${iconSize}px` }} />,
    snapchat: <FaSnapchat style={{ fontSize: `${iconSize}px` }} />,
  };

  useEffect(() => {
    if (cardRef.current) {
      const cardWidth = cardRef.current.offsetWidth;
      const companyNameWidth = companyNameRef.current?.scrollWidth || 0;
      const employeeNameWidth = employeeNameRef.current?.scrollWidth || 0;

      if (companyNameWidth > cardWidth || employeeNameWidth > cardWidth) {
        setError('Name exceeds the card size.');
      } else {
        setError('');
      }
    }
  }, [companyName, employeeName, setError]);
  
  return (
    <div className="fixed-card-wrapper">
      <div 
        className={`fixed-card ${isFlipped ? 'flipped' : ''}`} 
        onClick={handleSwipe}
      >
        <div ref={cardRef} className={`card ${cardColor}`}>
          <div className="card-inner">
            <div className={`card-face card-front ${cardColor}`}>
              {isDefault ? (
                <h2 className="text-2xl font-bold text-indigo-600">
                  Hi! Let's Customize your card
                </h2>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  {userType === 'business' && logo && (
                    <img 
                      src={logo} 
                      alt="Company Logo" 
                      className="w-24 h-24 object-contain mb-4" 
                      style={{ transform: `scale(${logoScale})` }}
                    />
                  )}
                  <h2
                    ref={companyNameRef}
                    className={`font-bold text-center ${color}`}
                    style={{ fontFamily: font, fontSize: `${size}px` }}
                  >
                    {companyName}
                  </h2>
                  {employeeName && (
                    <h3
                      ref={employeeNameRef}
                      className={`font-medium text-center mt-1 ${color}`}
                      style={{ fontFamily: font, fontSize: `${size * 0.8}px` }}
                    >
                      {employeeName}
                    </h3>
                  )}
                  {socialMedia.length > 0 && (
                    <div className="flex space-x-4 mt-4">
                      {socialMedia.map((icon) => (
                        <div key={icon} className={color}>
                          {socialMediaIcons[icon as keyof typeof socialMediaIcons]}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className={`card-face card-back ${cardColor}`}>
              {addQrCode && showQrCode && qrCode ? (
                <img 
                  src={qrCode} 
                  alt="QR Code" 
                  className={`w-32 h-32 ${color}`} 
                />
              ) : (
                <p className="text-center text-gray-500">
                  {addQrCode ? "QR Code will appear here" : "Back of the card"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col items-center">
        <div className="arrow" />
        <div className="text-indigo-600 font-bold">
          {isFlipped ? 'Tap to see front' : 'Tap to see back'}
        </div>
      </div>
    </div>
  );
};

export default Card;