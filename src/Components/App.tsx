import React, { useState } from 'react';
import LandingPage from './LandingPage';
import CardTypePage from './CardTypePage';
import OrderForm from './OrderForm';
import '../styles.css';

const App: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [cardType, setCardType] = useState<'individual' | 'business' | null>(null);

  const handleCardTypeSelection = (type: 'individual' | 'business') => {
    setCardType(type);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <header className="p-4 bg-white shadow-md flex justify-between items-center">
        <h1 className="text-4xl font-bold swiftcard-text">SwiftCard</h1>
      </header>
      {showForm ? (
        <OrderForm userType={cardType!} />
      ) : (
        cardType === null ? (
          <LandingPage onButtonClick={() => setCardType('individual')} />
        ) : (
          <CardTypePage onCardTypeSelect={handleCardTypeSelection} />
        )
      )}
    </div>
  );
};

export default App;
