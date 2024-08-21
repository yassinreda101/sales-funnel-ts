import React from 'react';

interface LandingPageProps {
  onButtonClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onButtonClick }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light-gray">
      <h2 className="text-4xl font-bold text-center mb-6">
        Welcome to SwiftCard!
      </h2>
      <p className="text-lg text-center mb-8">
        Create your custom NFC business card with ease.
      </p>
      <button
        onClick={onButtonClick}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;
