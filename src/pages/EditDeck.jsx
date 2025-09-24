import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { DeckService, CardService } from '../services';

const EditDeck = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [deckData, setDeckData] = useState({
    name: '',
    description: ''
  });
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDeck();
  }, [id]);

  const loadDeck = () => {
    const deckInfo = DeckService.getById(id);
    if (!deckInfo) {
      navigate('/dashboard');
      return;
    }

    setDeck(deckInfo);
    setDeckData({
      name: deckInfo.name,
      description: deckInfo.description || ''
    });
    setCards(deckInfo.cards.length > 0 ? deckInfo.cards : [{ front: '', back: '', id: null }]);
    setLoading(false);
  };

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
    setCards([...cards, { front: '', back: '', id: null }]);
  };

  const removeCard = (index) => {
    const cardToRemove = cards[index];
    
    if (cardToRemove.id) {
      // If card exists in database, delete it
      CardService.deleteCard(id, cardToRemove.id);
    }
    
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

    setSaving(true);

    try {
      // Update deck info
      DeckService.update(id, {
        name: deckData.name.trim(),
        description: deckData.description.trim()
      });

      // Process cards
      for (const card of cards) {
        if (card.front.trim() && card.back.trim()) {
          if (card.id) {
            // Update existing card
            CardService.updateCard(id, card.id, {
              front: card.front.trim(),
              back: card.back.trim()
            });
          } else {
            // Add new card
            CardService.addCard(id, {
              front: card.front.trim(),
              back: card.back.trim()
            });
          }
        }
      }

      // Navigate back to deck detail
      navigate(`/deck/${id}`);
    } catch (error) {
      console.error('Error updating deck:', error);
      alert('Có lỗi xảy ra khi cập nhật bộ thẻ');
    } finally {
      setSaving(false);
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
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-600 hover:text-blue-700 mt-2"
        >
          Quay lại Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/deck/${id}`)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa bộ thẻ</h1>
            <p className="text-gray-600">Cập nhật thông tin và thẻ học</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              <div key={card.id || index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-medium text-gray-700">
                      Thẻ #{index + 1}
                    </h3>
                    {card.id && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Đã lưu
                      </span>
                    )}
                    {!card.id && card.front && card.back && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Thẻ mới
                      </span>
                    )}
                  </div>
                  {cards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCard(index)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title="Xóa thẻ"
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
            onClick={() => navigate(`/deck/${id}`)}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={saving}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDeck;