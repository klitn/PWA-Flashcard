import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiX } from 'react-icons/fi';
import { DeckService, CardService } from '../services';
import { calculateNextReview, shuffleArray } from '../utils';
import FlashCard from '../components/FlashCard';
import ProgressBar from '../components/ProgressBar';

const Study = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [currentCards, setCurrentCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyMode, setStudyMode] = useState('flip_card'); // flip_card, multiple_choice
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    studied: 0,
    correct: 0,
    wrong: 0
  });
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudySession();
  }, [id]);

  const loadStudySession = () => {
    const deckData = DeckService.getById(id);
    if (!deckData) {
      navigate('/dashboard');
      return;
    }

    setDeck(deckData);
    
    // Get cards for review (due today or new cards)
    let cardsToStudy = CardService.getCardsForReview(id);
    
    // If no cards for review, get all cards
    if (cardsToStudy.length === 0) {
      cardsToStudy = deckData.cards.filter(card => !card.mastered);
    }
    
    // If still no cards, get all cards
    if (cardsToStudy.length === 0) {
      cardsToStudy = deckData.cards;
    }

    // Shuffle cards for study
    const shuffledCards = shuffleArray(cardsToStudy);
    setCurrentCards(shuffledCards);
    setSessionStats({
      total: shuffledCards.length,
      studied: 0,
      correct: 0,
      wrong: 0
    });
    setLoading(false);
  };

  const handleAnswer = (cardId, difficulty) => {
    const currentCard = currentCards[currentIndex];
    
    // Simplified logic: 'hard' = still learning, 'easy' = known
    const isKnown = difficulty === 'easy';
    const nextReview = calculateNextReview(difficulty, currentCard.interval);
    
    CardService.updateCard(id, cardId, {
      studied: true,
      mastered: isKnown && currentCard.interval >= 2,
      difficulty,
      interval: nextReview.interval,
      nextReview: nextReview.date.toISOString(),
      reviewHistory: [
        ...currentCard.reviewHistory,
        {
          date: new Date().toISOString(),
          difficulty,
          correct: isKnown
        }
      ]
    });

    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      studied: prev.studied + 1,
      correct: isKnown ? prev.correct + 1 : prev.correct,
      wrong: isKnown ? prev.wrong : prev.wrong + 1
    }));

    // Move to next card or complete session
    if (currentIndex + 1 >= currentCards.length) {
      setIsComplete(true);
      // Update deck stats
      DeckService.updateStats(id);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsComplete(false);
    setSessionStats({
      total: currentCards.length,
      studied: 0,
      correct: 0,
      wrong: 0
    });
  };

  const handleExit = () => {
    navigate(`/deck/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!deck || currentCards.length === 0) {
    return (
      <div className="text-center py-12">
        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Không có thẻ nào cần ôn tập!
        </h2>
        <p className="text-gray-600 mb-6">
          Tất cả thẻ trong bộ này đã được học hoàn thành.
        </p>
        <button
          onClick={() => navigate(`/deck/${id}`)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Quay lại bộ thẻ
        </button>
      </div>
    );
  }

  if (isComplete) {
    const accuracy = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;
    
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Hoàn thành phiên học!
        </h2>
        
        {/* Session Results */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kết quả</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sessionStats.studied}</div>
              <div className="text-sm text-gray-500">Thẻ đã học</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{sessionStats.correct}</div>
              <div className="text-sm text-gray-500">Trả lời đúng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{accuracy}%</div>
              <div className="text-sm text-gray-500">Độ chính xác</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Học lại
          </button>
          <button
            onClick={handleExit}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const currentCard = currentCards[currentIndex];
  const progress = ((currentIndex + 1) / currentCards.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleExit}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{deck.name}</h1>
            <p className="text-gray-600">
              Thẻ {currentIndex + 1} / {currentCards.length}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleExit}
          className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <ProgressBar
          current={currentIndex + 1}
          total={currentCards.length}
          label="Tiến độ học"
          color="blue"
        />
      </div>

      {/* Study Mode Selector */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Chế độ học:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setStudyMode('flip_card')}
              className={`px-3 py-1 text-sm rounded-md ${
                studyMode === 'flip_card'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Lật thẻ
            </button>
            <button
              onClick={() => setStudyMode('multiple_choice')}
              className={`px-3 py-1 text-sm rounded-md ${
                studyMode === 'multiple_choice'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled
            >
              Trắc nghiệm
            </button>
          </div>
        </div>
      </div>

      {/* Flash Card */}
      <div className="flex justify-center">
        <FlashCard
          card={currentCard}
          onAnswer={handleAnswer}
        />
      </div>

      {/* Session Stats */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Thống kê phiên học</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{sessionStats.studied}</div>
            <div className="text-xs text-gray-500">Đã học</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{sessionStats.correct}</div>
            <div className="text-xs text-gray-500">Đúng</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">{sessionStats.wrong}</div>
            <div className="text-xs text-gray-500">Sai</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {sessionStats.studied > 0 ? Math.round((sessionStats.correct / sessionStats.studied) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-500">Độ chính xác</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Study;