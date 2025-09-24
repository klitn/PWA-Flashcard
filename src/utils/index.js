// Local storage utilities
export const localStorage = {
  get: (key) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  clear: () => {
    try {
      window.localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Array shuffle utility
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Format date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

// Calculate next review date using SRS
export const calculateNextReview = (difficulty, currentInterval = 0) => {
  const intervals = {
    easy: [1, 3, 7, 14, 30, 60],
    medium: [1, 2, 5, 10, 21, 45],
    hard: [1, 1, 3, 7, 14, 30]
  };
  
  const difficultyIntervals = intervals[difficulty] || intervals.medium;
  const nextIntervalIndex = Math.min(currentInterval + 1, difficultyIntervals.length - 1);
  const daysToAdd = difficultyIntervals[nextIntervalIndex];
  
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + daysToAdd);
  
  return {
    date: nextReview,
    interval: nextIntervalIndex
  };
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
    minLength: password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers
  };
};

// Quiz utility functions
export const generateQuizOptions = (correctAnswer, allAnswers, count = 4) => {
  if (!correctAnswer || !allAnswers || allAnswers.length < count) {
    return [];
  }

  // Filter out the correct answer from potential distractors
  const distractors = allAnswers.filter(answer => 
    answer !== correctAnswer && answer.trim() !== correctAnswer.trim()
  );

  if (distractors.length < count - 1) {
    return [];
  }

  // Randomly select distractors
  const selectedDistractors = shuffleArray(distractors).slice(0, count - 1);
  
  // Combine correct answer with distractors and shuffle
  const options = shuffleArray([correctAnswer, ...selectedDistractors]);
  
  return options;
};

export const validateQuizDeck = (cards, minCards = 2) => {
  // Allow quiz mode with as few as 2 cards
  if (!cards || cards.length < minCards) {
    return {
      isValid: false,
      reason: `Cần ít nhất ${minCards} thẻ để sử dụng chế độ trắc nghiệm.`
    };
  }

  // For fewer than 4 cards, we can still create quiz with generic options
  if (cards.length < 4) {
    return {
      isValid: true,
      reason: 'Chế độ trắc nghiệm khả dụng (sẽ sử dụng một số lựa chọn chung).'
    };
  }

  // Check if there are enough unique answers for full quiz experience
  const uniqueAnswers = new Set(cards.map(card => card.back.trim().toLowerCase()));
  if (uniqueAnswers.size < 4) {
    return {
      isValid: true,
      reason: 'Chế độ trắc nghiệm khả dụng (sẽ sử dụng một số lựa chọn chung).'
    };
  }

  return {
    isValid: true,
    reason: 'Bộ thẻ phù hợp hoàn toàn cho chế độ trắc nghiệm.'
  };
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};