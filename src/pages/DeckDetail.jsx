import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiEdit3, FiTrash2, FiPlay } from 'react-icons/fi';
import { DeckService, CardService } from '../services';
import ProgressBar from '../components/ProgressBar';

const DeckDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeck();
  }, [id]);

  const loadDeck = () => {
    const deckData = DeckService.getById(id);
    if (!deckData) {
      navigate('/dashboard');
      return;
    }
    setDeck(deckData);
    setLoading(false);
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCard.front.trim() || !newCard.back.trim()) return;

    CardService.addCard(id, newCard);
    setNewCard({ front: '', back: '' });
    setShowAddCard(false);
    loadDeck();
  };

  const handleDeleteCard = (cardId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thẻ này?')) {
      CardService.deleteCard(id, cardId);
      loadDeck();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Không tìm thấy bộ thẻ</h2>
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 mt-2">
          Quay lại Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{deck.name}</h1>
            {deck.description && (
              <p className="text-gray-600">{deck.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link
            to={`/edit-deck/${deck.id}`}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Chỉnh sửa
          </Link>
          {deck.cards.length > 0 && (
            <Link
              to={`/study/${deck.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiPlay className="w-4 h-4 inline mr-2" />
              Bắt đầu học
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng thẻ:</span>
              <span className="font-semibold">{deck.stats.totalCards}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Đã học:</span>
              <span className="font-semibold text-blue-600">{deck.stats.studiedCards}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thành thạo:</span>
              <span className="font-semibold text-green-600">{deck.stats.masteredCards}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tiến độ học</h3>
          <ProgressBar
            current={deck.stats.studiedCards}
            total={deck.stats.totalCards}
            label="Đã học"
            color="blue"
            className="mb-4"
          />
          <ProgressBar
            current={deck.stats.masteredCards}
            total={deck.stats.totalCards}
            label="Thành thạo"
            color="green"
          />
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động</h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowAddCard(true)}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Thêm thẻ mới
            </button>
            {deck.cards.length > 0 && (
              <Link
                to={`/study/${deck.id}`}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FiPlay className="w-4 h-4 mr-2" />
                Bắt đầu học
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Add Card Form */}
      {showAddCard && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm thẻ mới</h3>
          <form onSubmit={handleAddCard} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mặt trước (Câu hỏi/Từ vựng)
              </label>
              <textarea
                value={newCard.front}
                onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Nhập câu hỏi hoặc từ vựng..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mặt sau (Câu trả lời/Nghĩa)
              </label>
              <textarea
                value={newCard.back}
                onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Nhập câu trả lời hoặc nghĩa..."
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddCard(false);
                  setNewCard({ front: '', back: '' });
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thêm thẻ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cards List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Danh sách thẻ ({deck.cards.length})
          </h3>
        </div>
        
        {deck.cards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Chưa có thẻ nào trong bộ này</p>
            <button
              onClick={() => setShowAddCard(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Thêm thẻ đầu tiên
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {deck.cards.map((card, index) => (
              <div key={card.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        #{index + 1}
                      </span>
                      {card.studied && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Đã học
                        </span>
                      )}
                      {card.mastered && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Thành thạo
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Mặt trước:</p>
                        <p className="text-gray-700">{card.front}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Mặt sau:</p>
                        <p className="text-gray-700">{card.back}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
                      title="Xóa thẻ"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckDetail;