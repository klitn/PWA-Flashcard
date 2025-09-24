// Offline Storage Service using IndexedDB
class OfflineStorageService {
  constructor() {
    this.dbName = 'FlashCardDB';
    this.version = 1;
    this.db = null;
  }

  // Initialize database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject('Database failed to open');
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve('Database opened successfully');
      };

      request.onupgradeneeded = (e) => {
        this.db = e.target.result;

        // Create object stores
        if (!this.db.objectStoreNames.contains('decks')) {
          const deckStore = this.db.createObjectStore('decks', { keyPath: 'id', autoIncrement: true });
          deckStore.createIndex('name', 'name', { unique: false });
          deckStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!this.db.objectStoreNames.contains('cards')) {
          const cardStore = this.db.createObjectStore('cards', { keyPath: 'id', autoIncrement: true });
          cardStore.createIndex('deckId', 'deckId', { unique: false });
          cardStore.createIndex('front', 'front', { unique: false });
        }

        if (!this.db.objectStoreNames.contains('progress')) {
          const progressStore = this.db.createObjectStore('progress', { keyPath: 'id', autoIncrement: true });
          progressStore.createIndex('cardId', 'cardId', { unique: false });
          progressStore.createIndex('lastReviewed', 'lastReviewed', { unique: false });
        }

        if (!this.db.objectStoreNames.contains('settings')) {
          this.db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  // Generic methods for CRUD operations
  async add(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add({ ...data, createdAt: new Date(), updatedAt: new Date() });
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, id) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async update(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put({ ...data, updatedAt: new Date() });
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, id) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Specific methods for FlashCard app
  async addDeck(deckData) {
    return this.add('decks', deckData);
  }

  async getDecks() {
    return this.getAll('decks');
  }

  async getDeck(id) {
    return this.get('decks', id);
  }

  async updateDeck(deckData) {
    return this.update('decks', deckData);
  }

  async deleteDeck(id) {
    // Also delete all cards in this deck
    const cards = await this.getCardsByDeck(id);
    for (const card of cards) {
      await this.deleteCard(card.id);
    }
    return this.delete('decks', id);
  }

  async addCard(cardData) {
    return this.add('cards', cardData);
  }

  async getCards() {
    return this.getAll('cards');
  }

  async getCard(id) {
    return this.get('cards', id);
  }

  async getCardsByDeck(deckId) {
    const transaction = this.db.transaction(['cards'], 'readonly');
    const store = transaction.objectStore('cards');
    const index = store.index('deckId');
    const request = index.getAll(deckId);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateCard(cardData) {
    return this.update('cards', cardData);
  }

  async deleteCard(id) {
    // Also delete progress for this card
    const progress = await this.getProgressByCard(id);
    for (const p of progress) {
      await this.deleteProgress(p.id);
    }
    return this.delete('cards', id);
  }

  async addProgress(progressData) {
    return this.add('progress', progressData);
  }

  async getProgressByCard(cardId) {
    const transaction = this.db.transaction(['progress'], 'readonly');
    const store = transaction.objectStore('progress');
    const index = store.index('cardId');
    const request = index.getAll(cardId);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateProgress(progressData) {
    return this.update('progress', progressData);
  }

  async deleteProgress(id) {
    return this.delete('progress', id);
  }

  // Settings methods
  async getSetting(key) {
    return this.get('settings', key);
  }

  async setSetting(key, value) {
    return this.update('settings', { key, value });
  }

  // Sync methods
  async exportData() {
    const decks = await this.getDecks();
    const cards = await this.getCards();
    const progress = await this.getAll('progress');
    const settings = await this.getAll('settings');

    return {
      decks,
      cards,
      progress,
      settings,
      exportedAt: new Date()
    };
  }

  async importData(data) {
    // Clear existing data
    await this.clearAll();

    // Import new data
    if (data.decks) {
      for (const deck of data.decks) {
        await this.add('decks', deck);
      }
    }

    if (data.cards) {
      for (const card of data.cards) {
        await this.add('cards', card);
      }
    }

    if (data.progress) {
      for (const p of data.progress) {
        await this.add('progress', p);
      }
    }

    if (data.settings) {
      for (const setting of data.settings) {
        await this.update('settings', setting);
      }
    }
  }

  async clearAll() {
    const storeNames = ['decks', 'cards', 'progress', 'settings'];
    for (const storeName of storeNames) {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      await new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }
}

// Create singleton instance
const offlineStorage = new OfflineStorageService();

export default offlineStorage;