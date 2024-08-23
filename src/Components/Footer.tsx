import React from 'react';
import { FaStar, FaShippingFast, FaDollarSign } from 'react-icons/fa';

const reviews = [
  {
    text: "SwiftCard made networking at college events so much easier!",
    author: "Sarah J., Georgia Tech Student"
  },
  {
    text: "As a small business owner, SwiftCard has been a game-changer for my marketing.",
    author: "Michael R., Atlanta Entrepreneur"
  },
  {
    text: "The quality and design options are unmatched. Highly recommend!",
    author: "Emily L., Emory University Graduate"
  },
  {
    text: "I love how professional my SwiftCard looks. It's definitely made an impression!",
    author: "David K., Freelance Designer"
  },
  {
    text: "SwiftCard has streamlined my networking process. It's so convenient!",
    author: "Lisa M., Marketing Executive"
  }
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-white p-4 mt-8">
      <div className="container mx-auto">
        <div className="flex justify-center items-center mb-4">
          <div className="text-soft-blue font-bold flex items-center">
            <FaStar className="text-yellow-400 mr-2" />
            <span>4.9/5 stars from 500+ reviews</span>
          </div>
        </div>
        
        <div className="overflow-hidden mb-6">
          <div className="flex animate-carousel">
            {[...reviews, ...reviews].map((review, index) => (
              <div key={index} className="flex-shrink-0 w-full md:w-1/3 p-4">
                <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col justify-between">
                  <p className="italic text-gray-600 mb-4">{review.text}</p>
                  <p className="font-bold text-indigo-600">- {review.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8 mb-6">
          <div className="flex items-center">
            <FaShippingFast className="text-soft-blue mr-2" />
            <span>Fast, Free Shipping in ATL within 24 hours!</span>
          </div>
          <div className="flex items-center">
            <FaDollarSign className="text-soft-blue mr-2" />
            <span>Most Affordable Options Available!</span>
          </div>
        </div>

        <div className="text-center text-gray-600">
          <p>Contact us at <a href="mailto:swiftcardatl@outlook.com" className="text-indigo-600 underline">swiftcardatl@outlook.com</a> for inquiries and support.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
