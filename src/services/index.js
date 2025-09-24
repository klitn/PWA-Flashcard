import { STORAGE_KEYS } from '../constants';
import { localStorage, generateId } from '../utils';

// Data access layer for decks
export class DeckService {
  static getAll() {
    return localStorage.get(STORAGE_KEYS.DECKS) || [];
  }

  static getById(id) {
    const decks = this.getAll();
    return decks.find(deck => deck.id === id) || null;
  }

  static create(deckData) {
    const decks = this.getAll();
    const newDeck = {
      id: generateId(),
      name: deckData.name,
      description: deckData.description || '',
      cards: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        totalCards: 0,
        studiedCards: 0,
        masteredCards: 0
      }
    };

    decks.push(newDeck);
    localStorage.set(STORAGE_KEYS.DECKS, decks);
    return newDeck;
  }

  static update(id, updates) {
    const decks = this.getAll();
    const deckIndex = decks.findIndex(deck => deck.id === id);
    
    if (deckIndex === -1) return null;

    decks[deckIndex] = {
      ...decks[deckIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localStorage.set(STORAGE_KEYS.DECKS, decks);
    return decks[deckIndex];
  }

  static delete(id) {
    const decks = this.getAll();
    const filteredDecks = decks.filter(deck => deck.id !== id);
    localStorage.set(STORAGE_KEYS.DECKS, filteredDecks);
    return true;
  }

  static updateStats(deckId) {
    const deck = this.getById(deckId);
    if (!deck) return null;

    const stats = {
      totalCards: deck.cards.length,
      studiedCards: deck.cards.filter(card => card.studied).length,
      masteredCards: deck.cards.filter(card => card.mastered).length
    };

    return this.update(deckId, { stats });
  }
}

// Data access layer for cards
export class CardService {
  static addCard(deckId, cardData) {
    const deck = DeckService.getById(deckId);
    if (!deck) return null;

    const newCard = {
      id: generateId(),
      front: cardData.front,
      back: cardData.back,
      createdAt: new Date().toISOString(),
      studied: false,
      mastered: false,
      difficulty: 'medium',
      interval: 0,
      nextReview: new Date().toISOString(),
      reviewHistory: []
    };

    deck.cards.push(newCard);
    DeckService.update(deckId, { cards: deck.cards });
    DeckService.updateStats(deckId);
    
    return newCard;
  }

  static updateCard(deckId, cardId, updates) {
    const deck = DeckService.getById(deckId);
    if (!deck) return null;

    const cardIndex = deck.cards.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return null;

    deck.cards[cardIndex] = {
      ...deck.cards[cardIndex],
      ...updates
    };

    DeckService.update(deckId, { cards: deck.cards });
    DeckService.updateStats(deckId);
    
    return deck.cards[cardIndex];
  }

  static deleteCard(deckId, cardId) {
    const deck = DeckService.getById(deckId);
    if (!deck) return false;

    const filteredCards = deck.cards.filter(card => card.id !== cardId);
    DeckService.update(deckId, { cards: filteredCards });
    DeckService.updateStats(deckId);
    
    return true;
  }

  static getCardsForReview(deckId) {
    const deck = DeckService.getById(deckId);
    if (!deck) return [];

    const now = new Date();
    return deck.cards.filter(card => 
      new Date(card.nextReview) <= now
    );
  }
}

// Authentication service
export class AuthService {
  static getCurrentUser() {
    return localStorage.get(STORAGE_KEYS.USER);
  }

  static login(email, password) {
    // Simple mock authentication
    const user = {
      id: generateId(),
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString()
    };

    localStorage.set(STORAGE_KEYS.USER, user);
    return user;
  }

  static register(userData) {
    const user = {
      id: generateId(),
      email: userData.email,
      name: userData.name,
      createdAt: new Date().toISOString()
    };

    localStorage.set(STORAGE_KEYS.USER, user);
    return user;
  }

  static logout() {
    localStorage.remove(STORAGE_KEYS.USER);
    return true;
  }

  static isAuthenticated() {
    return !!this.getCurrentUser();
  }
}