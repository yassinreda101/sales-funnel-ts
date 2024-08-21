import React from 'react';
import { FaArrowRight, FaMobileAlt, FaQrcode, FaNetworkWired } from 'react-icons/fa';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center py-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-6 animate-fade-in">
            Welcome to SwiftCard
          </h1>
          <p className="text-2xl text-gray-600 mb-8 animate-slide-in-top">
            Create stunning digital business cards that leave a lasting impression.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-indigo-600 text-white font-bold text-xl py-4 px-8 rounded-full hover:bg-indigo-700 transition duration-300 flex items-center mx-auto animate-bounce"
          >
            Get Started <FaArrowRight className="ml-2" />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <FeatureCard
            icon={<FaMobileAlt className="text-5xl text-indigo-600 mb-4 mx-auto" />}
            title="NFC Technology"
            description="Instantly share your contact info with a simple tap"
          />
          <FeatureCard
            icon={<FaQrcode className="text-5xl text-indigo-600 mb-4 mx-auto" />}
            title="QR Code Integration"
            description="Easy sharing for those without NFC-enabled devices"
          />
          <FeatureCard
            icon={<FaNetworkWired className="text-5xl text-indigo-600 mb-4 mx-auto" />}
            title="Digital Integration"
            description="Link to your social profiles and website effortlessly"
          />
        </div>

        {/* New Steps Demo Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">How SwiftCard Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number={1}
              title="Customize Your Card"
              description="Design your digital card with your personal link and info"
              imageSrc="\src\images\step1.png"
              imageAlt="Customize your SwiftCard"
            />
            <StepCard
              number={2}
              title="Tap to Connect"
              description="Share your info instantly with a simple tap or scan"
              imageSrc="/api/placeholder/400/300"
              imageAlt="Tap to connect with SwiftCard"
            />
            <StepCard
              number={3}
              title="Make Connections"
              description="Create memorable connections effortlessly"
              imageSrc="/api/placeholder/400/300"
              imageAlt="Make connections with SwiftCard"
            />
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Why Choose SwiftCard?</h2>
          <ul className="text-xl text-gray-600 space-y-4">
            <li>✅ Professional design options for individuals and businesses</li>
            <li>✅ Affordable pricing starting at just $5.99</li>
            <li>✅ Easy to use online designer</li>
            <li>✅ Fast, free shipping in Atlanta within 24 hours</li>
          </ul>
        </div>

        <div className="text-center">
          <img
            src="/api/placeholder/800/400"
            alt="SwiftCard Demo"
            className="rounded-lg shadow-2xl max-w-full h-auto mx-auto animate-fade-in"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
    {icon}
    <h3 className="text-2xl font-semibold mb-2 text-center text-gray-800">{title}</h3>
    <p className="text-center text-gray-600">{description}</p>
  </div>
);

const StepCard: React.FC<{ number: number; title: string; description: string; imageSrc: string; imageAlt: string }> = ({ number, title, description, imageSrc, imageAlt }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="text-4xl font-bold text-indigo-600 mb-4">{number}</div>
    <h3 className="text-2xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <img src={imageSrc} alt={imageAlt} className="w-full h-auto rounded-lg" />
  </div>
);

export default LandingPage;