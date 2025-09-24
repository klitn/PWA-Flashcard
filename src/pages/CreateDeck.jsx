import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { DeckService, CardService } from '../services';

const CreateDeck = () => {
  const navigate = useNavigate();
  const [deckData, setDeckData] = useState({
    name: '',
    description: ''
  });
  const [cards, setCards] = useState([{ front: '', back: '' }]);
  const [loading, setLoading] = useState(false);

  const handleDeckChange = (field, value) => {
    setDeckData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCardChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  const addCard = () => {
    setCards([...cards, { front: '', back: '' }]);
  };

  const removeCard = (index) => {
    if (cards.length > 1) {
      const updatedCards = cards.filter((_, i) => i !== index);
      setCards(updatedCards);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!deckData.name.trim()) {
      alert('Vui lòng nhập tên bộ thẻ');
      return;
    }

    const validCards = cards.filter(card => card.front.trim() && card.back.trim());
    
    if (validCards.length === 0) {
      alert('Vui lòng thêm ít nhất một thẻ hợp lệ');
      return;
    }

    setLoading(true);

    try {
      // Create deck
      const newDeck = DeckService.create({
        name: deckData.name.trim(),
        description: deckData.description.trim()
      });

      // Add cards to deck
      for (const card of validCards) {
        CardService.addCard(newDeck.id, {
          front: card.front.trim(),
          back: card.back.trim()
        });
      }

      // Navigate to deck detail
      navigate(`/deck/${newDeck.id}`);
    } catch (error) {
      console.error('Error creating deck:', error);
      alert('Có lỗi xảy ra khi tạo bộ thẻ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tạo bộ thẻ mới</h1>
            <p className="text-lg text-gray-600">Tạo bộ thẻ học tập của bạn</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6 min-h-0">
        {/* Deck Info */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bộ thẻ</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên bộ thẻ *
              </label>
              <input
                type="text"
                value={deckData.name}
                onChange={(e) => handleDeckChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ví dụ: Từ vựng tiếng Anh cơ bản"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả (tùy chọn)
              </label>
              <textarea
                value={deckData.description}
                onChange={(e) => handleDeckChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Mô tả ngắn về bộ thẻ này..."
              />
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Thẻ học ({cards.length})
            </h2>
            <button
              type="button"
              onClick={addCard}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              <FiPlus className="w-4 h-4 mr-1" />
              Thêm thẻ
            </button>
          </div>

          <div className="space-y-4">
            {cards.map((card, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">
                    Thẻ #{index + 1}
                  </h3>
                  {cards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCard(index)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Mặt trước (Câu hỏi/Từ vựng)
                    </label>
                    <textarea
                      value={card.front}
                      onChange={(e) => handleCardChange(index, 'front', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Nhập câu hỏi hoặc từ vựng..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Mặt sau (Câu trả lời/Nghĩa)
                    </label>
                    <textarea
                      value={card.back}
                      onChange={(e) => handleCardChange(index, 'back', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Nhập câu trả lời hoặc nghĩa..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Đang tạo...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4 mr-2" />
                Tạo bộ thẻ
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDeck;