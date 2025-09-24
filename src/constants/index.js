// App constants
export const APP_NAME = 'FlashCard App';

// Local storage keys
export const STORAGE_KEYS = {
  DECKS: 'flashcard_decks',
  USER: 'flashcard_user',
  STUDY_PROGRESS: 'flashcard_progress',
  SETTINGS: 'flashcard_settings'
};

// Study modes
export const STUDY_MODES = {
  FLIP_CARD: 'flip_card',
  MULTIPLE_CHOICE: 'multiple_choice',
  WRITE_ANSWER: 'write_answer'
};

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

// SRS intervals (in days)
export const SRS_INTERVALS = {
  [DIFFICULTY_LEVELS.EASY]: [1, 3, 7, 14, 30],
  [DIFFICULTY_LEVELS.MEDIUM]: [1, 2, 5, 10, 21],
  [DIFFICULTY_LEVELS.HARD]: [1, 1, 3, 7, 14]
};

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  DECK_DETAIL: '/deck/:id',
  STUDY: '/study/:id',
  CREATE_DECK: '/create-deck',
  EDIT_DECK: '/edit-deck/:id',
  LOGIN: '/login',
  REGISTER: '/register'
};