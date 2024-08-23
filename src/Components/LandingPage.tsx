import React from 'react';
import { FaArrowRight, FaMobileAlt, FaQrcode, FaNetworkWired } from 'react-icons/fa';
import step1Img from '../images/step1.png';
import step2Img from '../images/step2.png';
import step3Img from '../images/step3.png';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center py-12">
          <h1 className="text-6xl font-extrabold text-gray-800 mb-6 animate-fade-in">
            Welcome to SwiftCard
          </h1>
          <p className="text-2xl text-gray-600 mb-8 animate-slide-in-top">
            Elevate your networking game with custom NFC business cards designed for Georgia Tech students and Atlanta professionals.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-indigo-600 text-white font-bold text-xl py-4 px-8 rounded-full hover:bg-indigo-700 transition duration-300 flex items-center mx-auto animate-bounce shadow-lg"
          >
            Get Started <FaArrowRight className="ml-2" />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <FeatureCard
            icon={<FaMobileAlt className="text-5xl text-indigo-600 mb-4 mx-auto" />}
            title="NFC Convenience"
            description="Share your info instantly with just a tap. Ideal for fast connections at career fairs and networking events."
          />
          <FeatureCard
            icon={<FaQrcode className="text-5xl text-indigo-600 mb-4 mx-auto" />}
            title="QR Code Access"
            description="Ensure everyone can connect, even those without NFC-enabled devices. Perfect for seamless digital integration."
          />
          <FeatureCard
            icon={<FaNetworkWired className="text-5xl text-indigo-600 mb-4 mx-auto" />}
            title="Digital Portfolio"
            description="Link your GitHub, LinkedIn, or personal portfolio. Impress recruiters and stand out in any crowd."
          />
        </div>

        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">How SwiftCard Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number={1}
              title="Personalize Your Card"
              description="Design a card that reflects your brand, complete with your unique links and contact information."
              imageSrc={step1Img}
              imageAlt="Customize your SwiftCard"
            />
            <StepCard
              number={2}
              title="Connect Instantly"
              description="Tap or scan to instantly share your details—no more fumbling with paper business cards."
              imageSrc={step2Img}
              imageAlt="Tap to connect with SwiftCard"
            />
            <StepCard
              number={3}
              title="Leave a Mark"
              description="Make a memorable impression with a sleek, tech-savvy card designed for modern networking."
              imageSrc={step3Img}
              imageAlt="Make connections with SwiftCard"
            />
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Why Choose SwiftCard?</h2>
          <ul className="text-xl text-gray-600 space-y-4">
            <li><span className="font-bold text-indigo-600">✅</span> Tailored for Georgia Tech students and Atlanta professionals</li>
            <li><span className="font-bold text-indigo-600">✅</span> Affordable pricing starting at just $5.99—student-friendly</li>
            <li><span className="font-bold text-indigo-600">✅</span> Easy-to-use online designer—create your perfect card in minutes</li>
            <li><span className="font-bold text-indigo-600">✅</span> Fast, free delivery in Atlanta—pay upon receiving your card with multiple payment options</li>
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
  <div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
    <div className="text-4xl font-bold text-indigo-600 mb-4">{number}</div>
    <h3 className="text-2xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <img src={imageSrc} alt={imageAlt} className="w-full h-auto rounded-lg" />
  </div>
);

export default LandingPage;
