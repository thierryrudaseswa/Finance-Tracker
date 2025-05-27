import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card } from '@rneui/themed';
import { useRouter, useFocusEffect } from 'expo-router';
import { getExpenses } from '../services/api';
import { Expense } from '../types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function DashboardScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode, colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const loadExpenses = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await getExpenses();
      if (Array.isArray(data)) {
        const userExpenses = data
          .filter((expense: Expense) => expense.userId === user?.id)
          .sort((a: Expense, b: Expense) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setExpenses(userExpenses);
      }
    } catch (error) {
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadExpenses();
    }
  }, [user?.id, loadExpenses]);

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [loadExpenses])
  );

  const getTotalExpenses = (): number => {
    if (!Array.isArray(expenses) || expenses.length === 0) return 0;
    
    const total = expenses.reduce((sum, expense) => {
      if (!expense || typeof expense.amount !== 'number') return sum;
      return sum + expense.amount;
    }, 0);
    
    return Number(total) || 0;
  };

  const getCategoryTotals = () => {
    if (!expenses?.length) return {};
    return expenses.reduce((acc: { [key: string]: number }, expense) => {
      if (expense?.category) {
        const amount = typeof expense.amount === 'number' ? expense.amount : 0;
        acc[expense.category] = (Number(acc[expense.category]) || 0) + amount;
      }
      return acc;
    }, {});
  };

  interface MonthlyDataItem {
    month: string;
    value: number;
  }

  const getMonthlyData = (): MonthlyDataItem[] => {
    const monthlyTotals: { [key: string]: number } = {};
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString('default', { month: 'short' });
    }).reverse();

    if (Array.isArray(expenses) && expenses.length > 0) {
      expenses.forEach(expense => {
        if (expense?.date && typeof expense.amount === 'number') {
          const month = new Date(expense.date).toLocaleString('default', { month: 'short' });
          monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount;
        }
      });
    }

    return last6Months.map(month => ({
      month,
      value: Number(monthlyTotals[month] || 0),
    }));
  };

  const monthlyData = getMonthlyData();
  const categoryTotals = getCategoryTotals();
  const maxAmount = Math.max(...monthlyData.map(item => Number(item.value) || 0), 1);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 20 }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text h3 style={[styles.title, { color: colors.text }]}>
        Financial Overview
      </Text>

      <Card containerStyle={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Title style={{ color: colors.text }}>Total Expenses</Card.Title>
        <View style={styles.totalContainer}>
          <FontAwesome name="dollar" size={24} color={colors.primary} />
          <Text h2 style={[styles.totalAmount, { color: colors.text }]}>
            {(getTotalExpenses() || 0).toFixed(2)}
          </Text>
        </View>
      </Card>

      {monthlyData.length > 0 && (
        <Card containerStyle={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Title style={{ color: colors.text }}>Monthly Trend</Card.Title>
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {monthlyData.map((item, index) => {
                const value = Number(item.value) || 0;
                const height = Math.max((value / maxAmount) * 150, 1);
                return (
                  <View key={`${item.month}-${index}`} style={styles.barContainer}>
                    <Text style={[styles.barValue, { color: colors.secondary }]}>
                      ${value.toFixed(0)}
                    </Text>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height, 
                          backgroundColor: colors.primary,
                        }
                      ]} 
                    />
                    <Text style={[styles.barLabel, { color: colors.secondary }]}>
                      {item.month}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Card>
      )}

      {Object.keys(categoryTotals).length > 0 && (
        <Card containerStyle={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Title style={{ color: colors.text }}>Spending by Category</Card.Title>
          {Object.entries(categoryTotals).map(([category, total], index) => (
            <View key={`${category}-${index}`} style={styles.categoryRow}>
              <Text style={{ color: colors.text, flex: 1 }}>{category}</Text>
              <Text style={{ color: colors.primary }}>${(Number(total) || 0).toFixed(2)}</Text>
            </View>
          ))}
        </Card>
      )}

      <TouchableOpacity onPress={() => router.push('/expenses')}>
        <Card containerStyle={[styles.card, styles.linkCard, { backgroundColor: colors.card }]}>
          <View style={styles.linkContent}>
            <FontAwesome name="list" size={24} color={colors.primary} />
            <Text style={[styles.linkText, { color: colors.text }]}>
              View All Expenses
            </Text>
            <FontAwesome name="chevron-right" size={16} color={colors.secondary} />
          </View>
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    marginHorizontal: 0,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  totalAmount: {
    marginLeft: 8,
  },
  chartContainer: {
    marginVertical: 8,
    paddingVertical: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 200,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 32,
    borderRadius: 8,
    marginHorizontal: 4,
    minHeight: 1,
  },
  barValue: {
    fontSize: 10,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  linkCard: {
    padding: 16,
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
}); 