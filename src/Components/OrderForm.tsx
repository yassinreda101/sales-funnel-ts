import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaSnapchat } from 'react-icons/fa';
import { TbLetterX } from 'react-icons/tb';
import Card from './Card';
import QRCodeGenerator from './QRCodeGenerator';
import '../styles.css';

const socialMediaOptions = [
  { value: 'facebook', label: 'Facebook', icon: <FaFacebook /> },
  { value: 'x', label: 'X', icon: <TbLetterX /> },
  { value: 'instagram', label: 'Instagram', icon: <FaInstagram /> },
  { value: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin /> },
  { value: 'github', label: 'GitHub', icon: <FaGithub /> },
  { value: 'snapchat', label: 'Snapchat', icon: <FaSnapchat /> },
];

const fontOptions = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Brush Script MT', label: 'Cursive' },
];

const colorOptionsWhiteCard = [
  { value: 'text-blue', label: 'Blue' },
  { value: 'text-black', label: 'Black' },
  { value: 'text-gold', label: 'Gold' },
  { value: 'text-silver', label: 'Silver' },
];

const colorOptionsDarkGrayCard = [
  { value: 'text-blue', label: 'Blue' },
  { value: 'text-gold', label: 'Gold' },
  { value: 'text-silver', label: 'Silver' },
  { value: 'text-pink', label: 'Bright Pink' },
  { value: 'text-purple', label: 'Purple' },
];

const cardColorOptions = [
  { value: 'bg-dark-gray', label: 'Dark Gray' },
  { value: 'bg-white', label: 'White' },
];

const cardPrices: { [key: string]: { name: number; logo: number } } = {
  individual: { name: 5.99, logo: 7.99 },
  business: { name: 10.99, logo: 14.99 },
};

interface OrderFormProps {
  userType: 'individual' | 'business';
}

const OrderForm: React.FC<OrderFormProps> = ({ userType }) => {
  const [name, setName] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [font, setFont] = useState('Arial');
  const [size, setSize] = useState(16);
  const [color, setColor] = useState('text-black');
  const [cardColor, setCardColor] = useState('bg-white');
  const [socialMedia, setSocialMedia] = useState<string[]>([]);
  const [link, setLink] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardOption, setCardOption] = useState(1);
  const [addQrCode, setAddQrCode] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (cardColor === 'bg-white') {
      setColor('text-blue');
    } else if (cardColor === 'bg-dark-gray') {
      setColor('text-gold');
    }
  }, [cardColor]);

  const handleSocialMediaChange = (value: string) => {
    setSocialMedia((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setIsDefault(false);
  };

  const handleCardOptionChange = (value: number) => {
    setCardOption(value);
  };

  const handleQrCodeChange = () => {
    setAddQrCode(!addQrCode);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
        setIsDefault(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      name,
      logo,
      font,
      size,
      color,
      cardColor,
      socialMedia,
      link,
      email,
      phoneNumber,
      cardOption,
      addQrCode,
    };

    if (error) {
      return;
    }

    console.log(formData);
  };

  const price = cardPrices[userType][logo ? 'logo' : 'name'] * cardOption;

  const handleSwipe = () => {
    setIsFlipped(!isFlipped);
  };

  const getColorOptions = () => {
    return cardColor === 'bg-white' ? colorOptionsWhiteCard : colorOptionsDarkGrayCard;
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-light-gray p-4">
      <div className="flex flex-col lg:flex-row lg:space-x-12 w-full lg:w-3/4 mt-8">
        <div className="lg:w-1/2 flex justify-center lg:justify-end mb-8 lg:mb-0">
          <Card
            name={name}
            font={font}
            size={size}
            color={color}
            cardColor={cardColor}
            socialMedia={socialMedia}
            isFlipped={isFlipped}
            addQrCode={addQrCode}
            qrCode={qrCode}
            isDefault={isDefault}
            handleSwipe={handleSwipe}
            setError={setError}
          />
        </div>
        <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
          {error && <div className="mb-4 text-red-500 font-bold">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-1 text-black">Card Color</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg bg-transparent text-black focus:ring focus:ring-blue-500 focus:border-blue-500"
                value={cardColor}
                onChange={(e) => setCardColor(e.target.value)}
              >
                {cardColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {userType === 'individual' ? (
              <div className="mb-4">
                <label className="block text-lg font-bold mb-1 text-black">Name</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-lg bg-transparent text-black focus:ring focus:ring-blue-500 focus:border-blue-500"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setIsDefault(false);
                  }}
                  placeholder="Enter your name"
                  required
                />
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-lg font-bold mb-1 text-black">Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-transparent text-black focus:ring focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div>
                <label className="block text-lg font-bold mb-1 text-black">Font</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg bg-transparent text-black focus:ring focus:ring-blue-500 focus:border-blue-500"
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                >
                  {fontOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-lg font-bold mb-1 text-black">Size</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-lg bg-transparent text-black focus:ring focus:ring-blue-500 focus:border-blue-500"
                  type="range"
                  min="10"
                  max="60"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-lg font-bold mb-1 text-black">Color</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg bg-transparent text-black focus:ring focus:ring-blue-500 focus:border-blue-500"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  {getColorOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-1 text-black">Social Media</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg bg-transparent text-black focus:ring focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  handleSocialMediaChange(e.target.value);
                  setIsDefault(false);
                }}
              >
                <option value="">Select Social Media</option>
                {socialMediaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-2 mt-2">
                {socialMedia.map((icon) => (
                  <span key={icon} className="bg-blue-500 text-white px-2 py-1 rounded-lg">
                    {socialMediaOptions.find((opt) => opt.value === icon)?.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-1 text-black">Link</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg bg-transparent text-black focus:ring focus:ring-blue-500 focus:border-blue-500"
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Enter the link for the NFC card"
                required
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="addQrCode"
                checked={addQrCode}
                onChange={handleQrCodeChange}
                className="mr-2 focus:ring focus:ring-blue-500 focus:border-blue-500"
              />
              <label className="text-lg font-bold text-black" htmlFor="addQrCode">
                Add a QR code to the back of the card +$3
              </label>
            </div>
            {addQrCode && (
              <div className="flex justify-center mb-4">
                <QRCodeGenerator link={link} setQrCode={setQrCode} addQrCode={addQrCode} color={color} />
                {qrCode && <img src={qrCode} alt="QR Code" className="w-32 h-32" />}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-lg font-bold mb-1 text-black">Number of Cards</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => handleCardOptionChange(Math.max(cardOption - 1, 1))}
                >
                  -
                </button>
                <span className="text-lg">{cardOption}</span>
                <button
                  type="button"
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => handleCardOptionChange(Math.min(cardOption + 1, 5))}
                >
                  +
                </button>
              </div>
              <p className="text-lg text-black mt-2">
                {cardOption === 1
                  ? `$${price.toFixed(2)}`
                  : `Total: $${price.toFixed(2)} ($${(price / cardOption).toFixed(2)} per card)`}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-1 text-black">Email</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg bg-transparent text-black focus:ring focus:ring-blue-500 focus:border-blue-500"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-bold mb-1 text-black">Phone Number</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg bg-transparent text-black focus:ring focus:ring-blue-500 focus:border-blue-500"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <button
              className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
              type="submit"
            >
              Send Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
