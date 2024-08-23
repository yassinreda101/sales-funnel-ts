import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaBuilding, FaArrowLeft, FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaSnapchat, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { TbLetterX } from 'react-icons/tb';
import Card from './Card';
import QRCodeGenerator from './QRCodeGenerator';
import { sendOrderEmail } from '../api';

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

const colorOptions = [
  { value: 'text-indigo-600', label: 'Blue' },
  { value: 'text-gray-800', label: 'Black' },
  { value: 'text-gold', label: 'Gold' },
  { value: 'text-silver', label: 'Silver' },
  { value: 'text-pink-400', label: 'Pink' },
  { value: 'text-purple-400', label: 'Purple' },
];

const cardColorOptions = [
  { value: 'bg-dark-gray', label: 'Black' },
  { value: 'bg-white', label: 'White' },
];

const cardPrices: { [key: string]: { name: number; logo: number } } = {
  individual: { name: 5.99, logo: 7.99 },
  business: { name: 10.99, logo: 15.00 },
};

interface OrderFormProps {
  onBack: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onBack }) => {
  const [userType, setUserType] = useState<'individual' | 'business'>('individual');
  const [name, setName] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [showEmployeeName, setShowEmployeeName] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState(1);
  const [font, setFont] = useState('Arial');
  const [size, setSize] = useState(16);
  const [color, setColor] = useState('text-gold');
  const [cardColor, setCardColor] = useState('bg-dark-gray');
  const [socialMedia, setSocialMedia] = useState<string[]>([]);
  const [link, setLink] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardOption, setCardOption] = useState(1);
  const [addQrCode, setAddQrCode] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [iconSize, setIconSize] = useState(24);
  const [showCardPreview, setShowCardPreview] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardColor === 'bg-white') {
      setColor('text-indigo-600');
    } else if (cardColor === 'bg-dark-gray') {
      setColor('text-gold');
    }
  }, [cardColor]);

  useEffect(() => {
    const handleScroll = () => {
      if (formRef.current) {
        const { bottom } = formRef.current.getBoundingClientRect();
        const isNearBottom = bottom <= window.innerHeight + 100;
        if (isNearBottom) {
          setShowCardPreview(false);
        } else {
          setShowCardPreview(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSocialMediaChange = (value: string) => {
    setSocialMedia((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setIsDefault(false);
  };

  const handleCardOptionChange = (value: number) => {
    setCardOption(value);
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

  const validateUrl = (url: string) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLink = e.target.value;
    setLink(newLink);
    setIsValidUrl(validateUrl(newLink));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) return;

    if (!name && userType === 'business') {
      setError('Please enter a company name.');
      return;
    }

    if (!name && userType === 'individual') {
      setError('Please enter your name.');
      return;
    }

    const formData = {
      userType,
      name,
      employeeName: showEmployeeName ? employeeName : '',
      logo,
      logoScale,
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
      showQrCode,
      qrCode,
      iconSize,
      price
    };

    setIsLoading(true);

    try {
      console.log('Submitting order with data:', formData);
      const response = await sendOrderEmail(formData);
      console.log('Order submission response:', response);
      alert("Order submitted successfully! Check your email and phone for confirmation.");
    } catch (error) {
      console.error("Detailed error submitting order:", error);
      if (error instanceof Error) {
        alert(`Error submitting order: ${error.message}`);
      } else {
        alert("There was an unknown error submitting your order. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = () => {
    setIsFlipped(!isFlipped);
  };

  const price = cardPrices[userType][logo ? 'logo' : 'name'] * cardOption + (addQrCode ? 3 : 0);

  return (
    <div className="py-12 px-4 bg-white" ref={formRef}>
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-indigo-600 hover:text-blue-600 transition duration-300"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </button>
        <h2 className="text-4xl font-bold text-soft-blue mb-8 text-center">Create Your SwiftCard</h2>
        <div className="flex flex-col lg:flex-row lg:space-x-12 lg:items-start">
          <div className="lg:w-1/2 mb-8 lg:mb-0 order-form-fields">
            {error && <div className="mb-4 text-red-500 font-bold">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="block text-lg font-bold mb-2 text-gray-700">Card Type</label>
                <p className="text-gray-500 mb-4">Choose whether you want an individual or business card.</p>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center ${
                      userType === 'individual' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => setUserType('individual')}
                  >
                    <FaUser className="mr-2" /> Individual
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center ${
                      userType === 'business' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => setUserType('business')}
                  >
                    <FaBuilding className="mr-2" /> Business
                  </button>
                </div>
              </div>

              {userType === 'individual' ? (
                <div>
                  <label className="block text-lg font-bold mb-2 text-gray-700">Name</label>
                  <p className="text-gray-500 mb-4">Enter your name as you would like it to appear on the card.</p>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setIsDefault(false);
                    }}
                    placeholder="Enter your name (WE RECOMMEND ALL CAPS)"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-lg font-bold mb-2 text-gray-700">Company Name</label>
                    <p className="text-gray-500 mb-4">Enter your company’s name to be displayed on the card.</p>
                    <input
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setIsDefault(false);
                      }}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="showEmployeeName"
                      checked={showEmployeeName}
                      onChange={() => setShowEmployeeName(!showEmployeeName)}
                      className="mr-2 focus:ring-2 focus:ring-soft-blue"
                    />
                    <label className="text-lg text-gray-700" htmlFor="showEmployeeName">
                      Add Employee Name (Optional)
                    </label>
                  </div>
                  {showEmployeeName && (
                    <div>
                      <label className="block text-lg font-bold mb-2 text-gray-700">Employee Name</label>
                      <p className="text-gray-500 mb-4">Enter the employee’s name to be displayed on the card.</p>
                      <input
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue"
                        type="text"
                        value={employeeName}
                        onChange={(e) => {
                          setEmployeeName(e.target.value);
                          setIsDefault(false);
                        }}
                        placeholder="Enter employee name"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-lg font-bold mb-2 text-gray-700">Logo</label>
                    <p className="text-gray-500 mb-4">Upload your company logo to include it on the card.</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold mb-2 text-gray-700">Logo Scale</label>
                    <p className="text-gray-500 mb-4">Adjust the size of the logo to fit your card’s design.</p>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.1"
                      value={logoScale}
                      onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-bold mb-2 text-gray-700">Card Color</label>
                  <p className="text-gray-500 mb-4">Select a background color for your card.</p>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue"
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
                <div>
                  <label className="block text-lg font-bold mb-2 text-gray-700">Text Color</label>
                  <p className="text-gray-500 mb-4">Choose a color for the text on your card.</p>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-bold mb-2 text-gray-700">Font</label>
                  <p className="text-gray-500 mb-4">Select a font style for your text.</p>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue"
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
                  <label className="block text-lg font-bold mb-2 text-gray-700">Font Size</label>
                  <p className="text-gray-500 mb-4">Adjust the size of the text on your card.</p>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue"
                    type="number"
                    min="10"
                    max="60"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold mb-2 text-gray-700">Card Social Icons</label>
                <p className="text-gray-500 mb-4">Select which social media icons to display on your card.</p>
                <div className="flex flex-wrap gap-2">
                  {socialMediaOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSocialMediaChange(option.value)}
                      className={`p-2 rounded-lg flex items-center ${
                        socialMedia.includes(option.value)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {option.icon}
                      <span className="ml-2">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {userType === 'business' && (
                <div>
                  <label className="block text-lg font-bold mb-2 text-gray-700">Icon Size</label>
                  <p className="text-gray-500 mb-4">Adjust the size of the social media icons on your card.</p>
                  <input
                    type="range"
                    min="16"
                    max="48"
                    value={iconSize}
                    onChange={(e) => setIconSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center mt-2">{iconSize}px</div>
                </div>
              )}

              <div>
                <label className="block text-lg font-bold mb-2 text-gray-700">Link for Card</label>
                <p className="text-gray-500 mb-4">Add a Linktree or website link to be included on the card.</p>
                <input
                  className={`w-full p-2 border ${
                    isValidUrl ? 'border-gray-300' : 'border-red-500'
                  } rounded-lg focus:ring-2 focus:ring-soft-blue`}
                  type="text"
                  value={link}
                  onChange={handleLinkChange}
                  placeholder="Enter the link for the card"
                  required
                />
                {!isValidUrl && <p className="text-red-500 mt-1">Please enter a valid URL</p>}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="addQrCode"
                  checked={addQrCode}
                  onChange={() => setAddQrCode(!addQrCode)}
                  className="mr-2 focus:ring-2 focus:ring-soft-blue"
                />
                <label className="text-lg font-bold text-gray-700" htmlFor="addQrCode">
                  Add a QR code to the back (extra $3 dollars)
                </label>
              </div>

              {addQrCode && (
                <>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showQrCode"
                      checked={showQrCode}
                      onChange={() => setShowQrCode(!showQrCode)}
                      className="mr-2 focus:ring-2 focus:ring-soft-blue"
                    />
                    <label className="text-lg font-bold text-gray-700" htmlFor="showQrCode">
                      Show QR code on back of card (Tap card to see!!)
                    </label>
                  </div>
                  <div>
                    <QRCodeGenerator link={link} setQrCode={setQrCode} color={color} />
                  </div>
                </>
              )}

              <div>
                <label className="block text-lg font-bold mb-2 text-gray-700">Number of Cards</label>
                <p className="text-gray-500 mb-4">Select the quantity of cards you would like to order.</p>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    onClick={() => handleCardOptionChange(Math.max(cardOption - 1, 1))}
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold">{cardOption}</span>
                  <button
                    type="button"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    onClick={() => handleCardOptionChange(Math.min(cardOption + 1, 5))}
                  >
                    +
                  </button>
                </div>
                <p className="text-lg text-gray-700 mt-2">
                  {cardOption === 1
                    ? `$${price.toFixed(2)}`
                    : `Total: $${price.toFixed(2)} ($${(price / cardOption).toFixed(2)} per card)`}
                </p>
              </div>

              <div>
                <label className="block text-lg font-bold mb-2 text-gray-700">Email</label>
                <p className="text-gray-500 mb-4">Enter your email address for order confirmation.</p>
                <input
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-bold mb-2 text-gray-700">Phone Number</label>
                <p className="text-gray-500 mb-4">We’ll text you about your order status.</p>
                <input
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-soft-blue"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <button
                className={`w-full p-3 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="loader w-6 h-6 border-4 border-white border-solid rounded-full border-t-transparent animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Place Order'
                )}
              </button>
            </form>
          </div>
          <div className="lg:w-1/2 hidden lg:block lg:sticky lg:top-8">
            <Card
              companyName={userType === 'individual' ? name : name}
              employeeName={userType === 'business' && showEmployeeName ? employeeName : ''}
              font={font}
              size={size}
              color={color}
              cardColor={cardColor}
              socialMedia={socialMedia}
              isFlipped={isFlipped}
              addQrCode={addQrCode}
              showQrCode={showQrCode}
              qrCode={qrCode}
              isDefault={isDefault}
              handleSwipe={handleSwipe}
              setError={setError}
              userType={userType}
              logo={logo}
              logoScale={logoScale}
              iconSize={iconSize}
            />
          </div>
        </div>
      </div>
      <div className={`fixed inset-x-0 bottom-0 p-4 bg-white bg-opacity-90 shadow-md transition-all duration-300 ease-in-out ${showCardPreview ? 'translate-y-0' : 'translate-y-full'} lg:hidden`}>
        <button
          onClick={() => setShowCardPreview(!showCardPreview)}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white rounded-t-lg px-4 py-2 flex items-center justify-center shadow-md"
        >
          {showCardPreview ? <FaChevronDown /> : <FaChevronUp />}
        </button>
        <Card
          companyName={userType === 'individual' ? name : name}
          employeeName={userType === 'business' && showEmployeeName ? employeeName : ''}
          font={font}
          size={size}
          color={color}
          cardColor={cardColor}
          socialMedia={socialMedia}
          isFlipped={isFlipped}
          addQrCode={addQrCode}
          showQrCode={showQrCode}
          qrCode={qrCode}
          isDefault={isDefault}
          handleSwipe={handleSwipe}
          setError={setError}
          userType={userType}
          logo={logo}
          logoScale={logoScale}
          iconSize={iconSize}
        />
      </div>
    </div>
  );
};

export default OrderForm;
