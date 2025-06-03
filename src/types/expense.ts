export interface Expense {
    id: string;
    user_id: string;
    title: string;
    amount: number;
    date: string; // ISO format
    category: string;
    created_at?: string;
  }
  