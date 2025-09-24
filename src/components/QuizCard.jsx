import React, { useState, useEffect } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

const QuizCard = ({ card, allCards, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    generateOptions();
  }, [card, allCards]);

  const generateOptions = () => {
    if (!card || !allCards || allCards.length < 1) {
      setOptions([]);
      return;
    }

    // Get correct answer
    const correctAnswer = card.back;
    
    // Get other cards for wrong answers (distractors)
    const otherCards = allCards.filter(c => 
      c.id !== card.id && 
      c.back.trim().toLowerCase() !== correctAnswer.trim().toLowerCase()
    );
    
    // Create distractors
    let distractors = [];
    
    // Use available cards first
    if (otherCards.length > 0) {
      const shuffled = [...otherCards].sort(() => Math.random() - 0.5);
      distractors = shuffled.slice(0, Math.min(3, otherCards.length)).map(c => c.back);
    }
    
    // Add generic distractors if we don't have enough
    if (distractors.length < 3) {
      const genericOptions = [
        'Không biết',
        'Câu trả lời khác', 
        'Cần xem lại',
        'Chưa học',
        'Không chắc chắn',
        'Cần ôn tập thêm'
      ];
      
      // Filter out options that might be similar to correct answer
      const filteredGeneric = genericOptions.filter(option => 
        option.toLowerCase() !== correctAnswer.toLowerCase() &&
        !distractors.some(d => d.toLowerCase() === option.toLowerCase())
      );
      
      while (distractors.length < 3 && filteredGeneric.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredGeneric.length);
        const option = filteredGeneric.splice(randomIndex, 1)[0];
        distractors.push(option);
      }
    }

    // Ensure we have at least 2 options total (correct + 1 distractor minimum)
    if (distractors.length === 0) {
      distractors.push('Không biết');
    }

    // Combine correct answer with distractors and shuffle
    const allOptions = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);
    
    setOptions(allOptions);
  };

  const handleOptionSelect = (option) => {
    if (showResult) return;
    
    setSelectedOption(option);
    setShowResult(true);

    // Auto-proceed after showing result for 1.5 seconds
    setTimeout(() => {
      const isCorrect = option === card.back;
      if (onAnswer) {
        onAnswer(card.id, isCorrect ? 'easy' : 'hard');
      }
      resetQuiz();
    }, 1500);
  };

  const resetQuiz = () => {
    setSelectedOption(null);
    setShowResult(false);
  };

  if (options.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-6">
          <div className="text-center text-gray-500">
            <p>Không thể tạo câu hỏi trắc nghiệm.</p>
            <p className="text-sm mt-2">Vui lòng thử lại hoặc chuyển sang chế độ lật thẻ.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Question Card */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg mb-6">
        <div className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Câu hỏi:</h3>
            <p className="text-xl font-medium text-gray-900">{card.front}</p>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === card.back;
          const isWrong = showResult && isSelected && !isCorrect;
          const shouldHighlight = showResult && isCorrect;

          let buttonClass = 'quiz-option w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ';
          
          if (showResult) {
            if (shouldHighlight) {
              buttonClass += 'quiz-result-correct border-green-500 bg-green-50 text-green-800';
            } else if (isWrong) {
              buttonClass += 'quiz-result-incorrect border-red-500 bg-red-50 text-red-800';
            } else {
              buttonClass += 'border-gray-200 bg-gray-50 text-gray-600';
            }
          } else {
            if (isSelected) {
              buttonClass += 'border-blue-500 bg-blue-50 text-blue-800';
            } else {
              buttonClass += 'border-gray-200 bg-white text-gray-800 hover:border-blue-300 hover:bg-blue-50';
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              disabled={showResult}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-base">{option}</span>
                </div>
                
                {showResult && (
                  <div className="flex-shrink-0">
                    {shouldHighlight && (
                      <FiCheck className="w-5 h-5 text-green-600" />
                    )}
                    {isWrong && (
                      <FiX className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Result Message */}
      {showResult && (
        <div className="mt-6 text-center">
          <div className={`inline-flex items-center px-4 py-2 rounded-lg ${
            selectedOption === card.back 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {selectedOption === card.back ? (
              <>
                <FiCheck className="w-4 h-4 mr-2" />
                Chính xác!
              </>
            ) : (
              <>
                <FiX className="w-4 h-4 mr-2" />
                Sai rồi. Đáp án đúng là: {card.back}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCard;