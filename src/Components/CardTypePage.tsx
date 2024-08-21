import React from 'react';
import { FaUser, FaBuilding } from 'react-icons/fa';

interface CardTypePageProps {
  onCardTypeSelect: (type: 'individual' | 'business') => void;
}

const CardTypePage: React.FC<CardTypePageProps> = ({ onCardTypeSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-4">
      <h2 className="text-4xl font-bold text-center mb-6 text-soft-blue">
        Choose Your Card Type
      </h2>
      <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
        <div
          className="card-type-option p-6 bg-white rounded-lg shadow-md text-center cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => onCardTypeSelect('individual')}
        >
          <FaUser className="text-5xl text-soft-blue mb-4 mx-auto" />
          <h3 className="text-2xl font-bold mb-2 text-soft-blue">Personal Card</h3>
          <p className="text-sm mb-4 text-gray-600">Perfect for individuals to share their personal contact details.</p>
          <p className="text-lg font-bold text-soft-blue">Starting at $5.99</p>
        </div>
        <div
          className="card-type-option p-6 bg-white rounded-lg shadow-md text-center cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => onCardTypeSelect('business')}
        >
          <FaBuilding className="text-5xl text-soft-blue mb-4 mx-auto" />
          <h3 className="text-2xl font-bold mb-2 text-soft-blue">Business Card</h3>
          <p className="text-sm mb-4 text-gray-600">Ideal for businesses to share professional contact information.</p>
          <p className="text-lg font-bold text-soft-blue">Starting at $10.99</p>
        </div>
      </div>
    </div>
  );
};

export default CardTypePage;