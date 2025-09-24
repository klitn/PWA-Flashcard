import { useState, useEffect } from 'react';
import offlineStorage from '../services/offlineStorage';

export const useOfflineStorage = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initStorage = async () => {
      try {
        await offlineStorage.init();
        setIsInitialized(true);
      } catch (err) {
        setError(err);
        console.error('Failed to initialize offline storage:', err);
      }
    };

    initStorage();
  }, []);

  return { isInitialized, error, storage: offlineStorage };
};

export const useDecks = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isInitialized, storage } = useOfflineStorage();

  useEffect(() => {
    if (isInitialized) {
      loadDecks();
    }
  }, [isInitialized]);

  const loadDecks = async () => {
    try {
      setLoading(true);
      const data = await storage.getDecks();
      setDecks(data || []);
    } catch (error) {
      console.error('Failed to load decks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDeck = async (deckData) => {
    try {
      const id = await storage.addDeck(deckData);
      await loadDecks(); // Reload to get updated data
      return id;
    } catch (error) {
      console.error('Failed to add deck:', error);
      throw error;
    }
  };

  const updateDeck = async (deckData) => {
    try {
      await storage.updateDeck(deckData);
      await loadDecks();
    } catch (error) {
      console.error('Failed to update deck:', error);
      throw error;
    }
  };

  const deleteDeck = async (id) => {
    try {
      await storage.deleteDeck(id);
      await loadDecks();
    } catch (error) {
      console.error('Failed to delete deck:', error);
      throw error;
    }
  };

  return {
    decks,
    loading,
    addDeck,
    updateDeck,
    deleteDeck,
    refreshDecks: loadDecks
  };
};

export const useCards = (deckId) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isInitialized, storage } = useOfflineStorage();

  useEffect(() => {
    if (isInitialized && deckId) {
      loadCards();
    }
  }, [isInitialized, deckId]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const data = await storage.getCardsByDeck(deckId);
      setCards(data || []);
    } catch (error) {
      console.error('Failed to load cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (cardData) => {
    try {
      const id = await storage.addCard({ ...cardData, deckId });
      await loadCards();
      return id;
    } catch (error) {
      console.error('Failed to add card:', error);
      throw error;
    }
  };

  const updateCard = async (cardData) => {
    try {
      await storage.updateCard(cardData);
      await loadCards();
    } catch (error) {
      console.error('Failed to update card:', error);
      throw error;
    }
  };

  const deleteCard = async (id) => {
    try {
      await storage.deleteCard(id);
      await loadCards();
    } catch (error) {
      console.error('Failed to delete card:', error);
      throw error;
    }
  };

  return {
    cards,
    loading,
    addCard,
    updateCard,
    deleteCard,
    refreshCards: loadCards
  };
};

export const useProgress = (cardId) => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isInitialized, storage } = useOfflineStorage();

  useEffect(() => {
    if (isInitialized && cardId) {
      loadProgress();
    }
  }, [isInitialized, cardId]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const data = await storage.getProgressByCard(cardId);
      setProgress(data || []);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProgress = async (progressData) => {
    try {
      const id = await storage.addProgress({ ...progressData, cardId });
      await loadProgress();
      return id;
    } catch (error) {
      console.error('Failed to add progress:', error);
      throw error;
    }
  };

  const updateProgress = async (progressData) => {
    try {
      await storage.updateProgress(progressData);
      await loadProgress();
    } catch (error) {
      console.error('Failed to update progress:', error);
      throw error;
    }
  };

  return {
    progress,
    loading,
    addProgress,
    updateProgress,
    refreshProgress: loadProgress
  };
};