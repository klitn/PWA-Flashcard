import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiBook, FiTarget } from 'react-icons/fi';
import { DeckService } from '../services';
import DeckCard from '../components/DeckCard';

const Dashboard = () => {
  const [decks, setDecks] = useState([]);
  const [stats, setStats] = useState({
    totalDecks: 0,
    totalCards: 0,
    studiedCards: 0,
    masteredCards: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = () => {
    const allDecks = DeckService.getAll();
    setDecks(allDecks);
    
    // Calculate overall stats
    const totalStats = allDecks.reduce((acc, deck) => ({
      totalDecks: acc.totalDecks + 1,
      totalCards: acc.totalCards + deck.stats.totalCards,
      studiedCards: acc.studiedCards + deck.stats.studiedCards,
      masteredCards: acc.masteredCards + deck.stats.masteredCards
    }), { totalDecks: 0, totalCards: 0, studiedCards: 0, masteredCards: 0 });
    
    setStats(totalStats);
  };

  const handleDeleteDeck = (deckId) => {
    DeckService.delete(deckId);
    loadDecks();
  };

  const handleEditDeck = (deckId) => {
    navigate(`/edit-deck/${deckId}`);
  };

  const studyProgress = stats.totalCards > 0 ? Math.round((stats.studiedCards / stats.totalCards) * 100) : 0;
  const masteryProgress = stats.totalCards > 0 ? Math.round((stats.masteredCards / stats.totalCards) * 100) : 0;

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-lg text-gray-600">Tổng quan học tập của bạn</p>
        </div>
        <Link
          to="/create-deck"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Tạo bộ thẻ mới
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiBook className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng bộ thẻ</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDecks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiTarget className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng thẻ</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCards}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiTarget className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tiến độ học</p>
              <p className="text-2xl font-bold text-gray-900">{studyProgress}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiTarget className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Thành thạo</p>
              <p className="text-2xl font-bold text-gray-900">{masteryProgress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decks Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Bộ thẻ của bạn</h2>
          <p className="text-sm text-gray-500">{decks.length} bộ thẻ</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {decks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <FiBook className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bộ thẻ nào</h3>
              <p className="text-gray-500 mb-6">Tạo bộ thẻ đầu tiên để bắt đầu học tập</p>
              <Link
                to="/create-deck"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                Tạo bộ thẻ mới
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {decks.map(deck => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  onDelete={handleDeleteDeck}
                  onEdit={handleEditDeck}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;