import React, { useState } from 'react';
import { FiRotateCcw } from 'react-icons/fi';

const FlashCard = ({ card, onAnswer, showAnswer = false }) => {
  const [isFlipped, setIsFlipped] = useState(showAnswer);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (difficulty) => {
    if (onAnswer) {
      onAnswer(card.id, difficulty);
    }
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card Container */}
      <div className="relative h-64 mb-6">
        <div 
          className={`absolute inset-0 w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-white border-2 border-gray-200 rounded-lg shadow-lg flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800 mb-4">{card.front}</p>
              <div className="flex items-center justify-center text-gray-400">
                <FiRotateCcw className="w-4 h-4 mr-2" />
                <span className="text-sm">Nhấn để lật thẻ</span>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-blue-50 border-2 border-blue-200 rounded-lg shadow-lg flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-lg font-medium text-blue-800 mb-4">{card.back}</p>
              <div className="flex items-center justify-center text-blue-400">
                <FiRotateCcw className="w-4 h-4 mr-2" />
                <span className="text-sm">Nhấn để lật lại</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Buttons - Only show when flipped */}
      {isFlipped && onAnswer && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleAnswer('hard')}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-light"
          >
            Đang học
          </button>
          <button
            onClick={() => handleAnswer('easy')}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-light"
          >
            Đã biết
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashCard;