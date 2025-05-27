import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Animated, TouchableOpacity } from 'react-native';
import { ListItem, Button, Icon, Text } from '@rneui/themed';
import { useRouter, useFocusEffect } from 'expo-router';
import { getExpenses, deleteExpense } from '../services/api';
import { Expense } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Toast from 'react-native-toast-message';

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const loadExpenses = async () => {
    try {
      setRefreshing(true);
      const data = await getExpenses();
      const userExpenses = data
        .filter((expense: Expense) => expense.userId === user?.id)
        .sort((a: Expense, b: Expense) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setExpenses(userExpenses);
      if (refreshing) {
        Toast.show({
          type: 'success',
          text1: 'Updated',
          text2: 'Expenses refreshed successfully',
          position: 'bottom',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load expenses',
        position: 'bottom',
      });
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadExpenses();
    }, [user?.id])
  );

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(id);
              setExpenses(expenses.filter(expense => expense.id !== id));
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Expense deleted successfully',
                position: 'bottom',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete expense',
                position: 'bottom',
              });
            }
          },
        },
      ]
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Food: '#10B981',
      Transportation: '#3B82F6',
      Entertainment: '#8B5CF6',
      Shopping: '#EC4899',
      Bills: '#EF4444',
      Other: '#F59E0B',
    };
    return colors[category] || colors.Other;
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <ListItem.Swipeable
      containerStyle={[styles.listItem, { backgroundColor: colors.card }]}
      leftContent={() => (
        <Button
          title="Edit"
          onPress={() => router.push(`/expense/edit/${item.id}`)}
          icon={{ name: 'edit', color: 'white' }}
          buttonStyle={{ minHeight: '100%', backgroundColor: '#10B981' }}
        />
      )}
      rightContent={() => (
        <Button
          title="Delete"
          onPress={() => handleDelete(item.id)}
          icon={{ name: 'delete', color: 'white' }}
          buttonStyle={{ minHeight: '100%', backgroundColor: '#EF4444' }}
        />
      )}
      onPress={() => router.push(`/expense/${item.id}`)}
    >
      <Icon
        name="label"
        color={getCategoryColor(item.category)}
      />
      <ListItem.Content>
        <ListItem.Title style={{ color: colors.text, fontWeight: 'bold' }}>
          ${typeof item.amount === 'number' ? item.amount.toFixed(2) : '0.00'}
        </ListItem.Title>
        <ListItem.Subtitle style={{ color: colors.secondary }}>
          {item.description}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron color={colors.secondary} />
    </ListItem.Swipeable>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={expenses}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No expenses found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.secondary }]}>
              Add your first expense by clicking the + button
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: '#10B981' }]}
        onPress={() => router.push('/expenses/new')}
      >
        <Icon name="add" color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
    padding: 16,
  },
  listItem: {
    marginBottom: 8,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
}); 