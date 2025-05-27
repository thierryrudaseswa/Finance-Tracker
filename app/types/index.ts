export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
} 