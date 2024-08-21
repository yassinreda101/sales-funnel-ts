import React from 'react';

interface CardTypePageProps {
  onCardTypeSelect: (type: 'individual' | 'business') => void;
}

const CardTypePage: React.FC<CardTypePageProps> = ({ onCardTypeSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light-gray p-4">
      <h2 className="text-4xl font-bold text-center mb-6">
        Choose Your Card Type
      </h2>
      <div className="flex justify-center space-x-8">
        <div className="card-type-option p-6 bg-white rounded-lg shadow-md text-center" onClick={() => onCardTypeSelect('individual')}>
          <h3 className="text-2xl font-bold mb-2">Personal Card</h3>
          <p className="text-sm mb-4">Perfect for individuals to share their personal contact details.</p>
          <p className="text-lg font-bold">Starting at $5.99</p>
        </div>
        <div className="card-type-option p-6 bg-white rounded-lg shadow-md text-center" onClick={() => onCardTypeSelect('business')}>
          <h3 className="text-2xl font-bold mb-2">Business Card</h3>
          <p className="text-sm mb-4">Ideal for businesses to share professional contact information.</p>
          <p className="text-lg font-bold">Starting at $10.99</p>
        </div>
      </div>
    </div>
  );
};

export default CardTypePage;
