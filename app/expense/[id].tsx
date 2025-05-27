import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, useColorScheme, ScrollView } from 'react-native';
import { Text, Button, Icon, Card } from '@rneui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getExpenseById, deleteExpense } from '../services/api';
import { Expense } from '../types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { useTheme } from '../context/ThemeContext';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { colors } = useTheme();

  useEffect(() => {
    loadExpense();
  }, [id]);

  const loadExpense = async () => {
    try {
      setLoading(true);
      const data = await getExpenseById(id as string);
      setExpense(data);
    } catch (error) {
      console.error('Error loading expense:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load expense details',
        position: 'bottom',
      });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
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
              await deleteExpense(id as string);
              Toast.show({
                type: 'success',
                text1: 'Deleted',
                text2: 'Expense deleted successfully',
                position: 'bottom',
              });
              router.back();
            } catch (error) {
              console.error('Error deleting expense:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete expense',
                position: 'bottom',
              });
            }
          },
        },
      ],
    );
  };

  if (loading || !expense) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

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

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card containerStyle={[styles.card, { 
        backgroundColor: colors.card,
        borderColor: colors.border
      }]}>
        <Card.Title style={{ color: colors.text, backgroundColor: colors.card }}>Expense Details</Card.Title>
        
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.secondary }]}>Amount:</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            ${typeof expense.amount === 'number' ? expense.amount.toFixed(2) : '0.00'}
          </Text>
        </View>

        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.secondary }]}>Category:</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: getCategoryColor(expense.category),
              marginRight: 8,
            }} />
            <Text style={[styles.value, { color: colors.text }]}>
              {expense.category}
            </Text>
          </View>
        </View>

        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.secondary }]}>Description:</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {expense.description}
          </Text>
        </View>

        <View style={[styles.row, { borderBottomColor: colors.border, marginBottom: 24 }]}>
          <Text style={[styles.label, { color: colors.secondary }]}>Date:</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {new Date(expense.date).toLocaleDateString()}
          </Text>
        </View>

        <Button
          title="Edit Expense"
          onPress={() => router.push(`/expense/edit/${expense.id}`)}
          icon={<Icon name="edit" color="white" style={styles.buttonIcon} />}
          buttonStyle={[styles.button, { backgroundColor: colors.primary }]}
          containerStyle={styles.buttonContainer}
        />

        <Button
          title="Delete Expense"
          icon={<Icon name="delete" color="white" style={styles.buttonIcon} />}
          buttonStyle={[
            styles.deleteButton,
            { backgroundColor: '#DC2626' }
          ]}
          containerStyle={styles.deleteButtonContainer}
          onPress={handleDelete}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    margin: 16,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
  },
  buttonContainer: {
    marginTop: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  deleteButtonContainer: {
    marginTop: 8,
  },
  deleteButton: {
    paddingVertical: 12,
    borderRadius: 8,
  },
}); 