import React, { useState } from 'react';
import LandingPage from './LandingPage';
import OrderForm from './OrderForm';
import Footer from './Footer';
import '../styles.css';

const App: React.FC = () => {
  const [showOrderForm, setShowOrderForm] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white shadow-md py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600">SwiftCard</h1>
          {!showOrderForm && (
            <button
              onClick={() => setShowOrderForm(true)}
              className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Get Started
            </button>
          )}
        </div>
      </header>
      
      <main className="flex-grow">
        {showOrderForm ? (
          <OrderForm onBack={() => setShowOrderForm(false)} />
        ) : (
          <LandingPage onGetStarted={() => setShowOrderForm(true)} />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default App;