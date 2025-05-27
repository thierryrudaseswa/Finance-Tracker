import axios from 'axios';
import { User, Expense } from '../types';

const BASE_URL = 'https://67ac71475853dfff53dab929.mockapi.io/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (username: string): Promise<User[]> => {
  try {
    const response = await api.get<User[]>(`/users?username=${username}`);
    return response.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status: number }, code?: string };
      if (axiosError.response?.status === 404) {
        throw new Error('USER_NOT_FOUND');
      }
      if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ERR_NETWORK') {
        throw new Error('NETWORK_ERROR');
      }
    }
    throw new Error('LOGIN_FAILED');
  }
};

export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const response = await api.get<Expense[]>('/expenses');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getExpenseById = async (expenseId: string): Promise<Expense> => {
  try {
    const response = await api.get<Expense>(`/expenses/${expenseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createExpense = async (expenseData: Omit<Expense, 'id'>): Promise<Expense> => {
  try {
    const response = await api.post<Expense>('/expenses', expenseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteExpense = async (expenseId: string) => {
  try {
    const response = await api.delete(`/expenses/${expenseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExpense = async (expense: Expense): Promise<Expense> => {
  try {
    const response = await api.put(`/expenses/${expense.id}`, expense);
    return response.data as Expense;
  } catch (error) {
    throw error;
  }
};

export default api; 