import React, { useRef, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaSnapchat } from 'react-icons/fa';
import { TbLetterX } from 'react-icons/tb';

const socialMediaIcons: { [key: string]: JSX.Element } = {
  facebook: <FaFacebook className="text-2xl" />,
  x: <TbLetterX className="text-2xl" />,
  instagram: <FaInstagram className="text-2xl" />,
  linkedin: <FaLinkedin className="text-2xl" />,
  github: <FaGithub className="text-2xl" />,
  snapchat: <FaSnapchat className="text-2xl" />,
};

interface CardProps {
  name: string;
  font: string;
  size: number;
  color: string;
  cardColor: string;
  socialMedia: string[];
  isFlipped: boolean;
  addQrCode: boolean;
  qrCode: string;
  isDefault: boolean;
  handleSwipe: () => void;
  setError: (error: string) => void;
}

const Card: React.FC<CardProps> = ({
  name,
  font,
  size,
  color,
  cardColor,
  socialMedia,
  isFlipped,
  addQrCode,
  qrCode,
  isDefault,
  handleSwipe,
  setError,
}) => {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (nameRef.current && cardRef.current) {
      const cardWidth = cardRef.current.offsetWidth;
      const nameWidth = nameRef.current.scrollWidth;

      if (nameWidth > cardWidth) {
        setError('Name exceeds the card size.');
      } else {
        setError('');
      }
    }
  }, [name, setError]);

  return (
    <div className="fixed-card-wrapper">
      <div className="fixed-card">
        <div
          ref={cardRef}
          className={`card w-96 h-56 rounded-lg shadow-lg transition-transform transform ${
            isFlipped ? 'rotate-y-180' : ''
          } flex flex-col items-center justify-center ${cardColor}`}
          style={{ perspective: '1000px' }}
          onClick={handleSwipe}
        >
          <div className={`absolute w-full h-full flex flex-col items-center justify-center front`}>
            {isDefault ? (
              <h2 className="text-2xl font-bold text-blue-500">
                Hi! Let's Customize your card
              </h2>
            ) : (
              <>
                <h2
                  ref={nameRef}
                  className={`font-bold mb-2 ${color}`}
                  style={{ fontFamily: font, fontSize: `${size}px` }}
                >
                  {name}
                </h2>
                <div className="flex space-x-4">
                  {socialMedia.map((icon) => (
                    <div key={icon} className={color}>
                      {socialMediaIcons[icon]}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className={`absolute w-full h-full flex flex-col items-center justify-center back`}>
            {addQrCode && qrCode && (
              <img src={qrCode} alt="QR Code" className="w-32 h-32" />
            )}
          </div>
        </div>
        <div className="mt-2 flex flex-col items-center">
          <div className="arrow text-blue-500" />
          <div className="text-blue-500 font-bold">
            {isFlipped ? 'Tap to see front' : 'Tap to see back'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
