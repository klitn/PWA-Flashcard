import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiEdit3, FiTrash2, FiBookOpen } from 'react-icons/fi';
import { PiCardsBold } from "react-icons/pi";
import { formatDate } from '../utils';
import ProgressBar from './ProgressBar';

const DeckCard = ({ deck, onDelete, onEdit }) => {
  const { stats } = deck;
  const studyProgress = stats.totalCards > 0 ? (stats.studiedCards / stats.totalCards) * 100 : 0;
  const masteryProgress = stats.totalCards > 0 ? (stats.masteredCards / stats.totalCards) * 100 : 0;

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa bộ thẻ này?')) {
      onDelete(deck.id);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(deck.id);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PiCardsBold  className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {deck.name}
              </h3>
              <p className="text-sm text-gray-500 font-light">
                {stats.totalCards} thẻ • Tạo {formatDate(deck.createdAt)}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Chỉnh sửa"
            >
              <FiEdit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        {deck.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-light">
            {deck.description}
          </p>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between">
          <Link
            to={`/deck/${deck.id}`}
            className="text-sm text-blue-600 hover:text-blue-700 font-light"
          >
            Xem chi tiết
          </Link>
          
          {stats.totalCards > 0 && (
            <Link
              to={`/study/${deck.id}`}
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlay className="w-4 h-4 mr-2" />
              Học ngay
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeckCard;