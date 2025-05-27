import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { Card, Input, Button, Text } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createExpense } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Toast from 'react-native-toast-message';
import { Icon } from '@rneui/themed';

const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other'];

export default function NewExpenseScreen() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();

  const handleSubmit = async () => {
    if (!amount || !description || !category) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
        position: 'bottom',
      });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid amount',
        position: 'bottom',
      });
      return;
    }

    try {
      setLoading(true);
      await createExpense({
        amount: parsedAmount,
        description,
        category,
        date: date.toISOString(),
        userId: user?.id || '',
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Expense created successfully',
        position: 'bottom',
      });
      router.replace('/(tabs)/expenses');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create expense',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Card 
        containerStyle={[styles.card, { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          margin: 0,
          padding: 16,
        }]}
      >
        <Card.Title style={{ color: colors.text, backgroundColor: colors.card }}>New Expense</Card.Title>

        <Input
          placeholder="Amount"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          leftIcon={{ type: 'font-awesome', name: 'dollar', color: colors.primary }}
          inputStyle={{ color: colors.text }}
          placeholderTextColor={colors.secondary}
          containerStyle={{ backgroundColor: 'transparent' }}
          inputContainerStyle={{ borderBottomColor: colors.border }}
        />

        <Input
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          leftIcon={{ type: 'font-awesome', name: 'pencil', color: colors.primary }}
          inputStyle={{ color: colors.text }}
          placeholderTextColor={colors.secondary}
          containerStyle={{ backgroundColor: 'transparent' }}
          inputContainerStyle={{ borderBottomColor: colors.border }}
        />

        <View style={styles.pickerContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Category:</Text>
          <View style={[styles.pickerWrapper, { 
            backgroundColor: colors.card,
            borderColor: colors.border
          }]}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue: string) => setCategory(itemValue)}
              style={[styles.picker, { color: colors.text }]}
              dropdownIconColor={colors.text}
              mode="dropdown"
            >
              {categories.map((cat) => (
                <Picker.Item 
                  key={cat} 
                  label={cat} 
                  value={cat}
                  color={colors.text}
                  style={{
                    backgroundColor: colors.card,
                  }}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.dateContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Date:</Text>
          <Button
            title={date.toLocaleDateString()}
            onPress={() => setShowDatePicker(true)}
            buttonStyle={[styles.dateButton, { 
              backgroundColor: colors.card,
              borderColor: colors.border
            }]}
            titleStyle={{ color: colors.text }}
            type="outline"
          />
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              style={{ backgroundColor: colors.card }}
              textColor={colors.text}
              themeVariant={isDarkMode ? 'dark' : 'light'}
              accentColor="#10B981"
            />
          )}
        </View>

        <Button
          title="Create Expense"
          onPress={handleSubmit}
          loading={loading}
          buttonStyle={[styles.button, { backgroundColor: '#10B981' }]}
          containerStyle={styles.buttonContainer}
          disabled={loading}
          disabledStyle={{ backgroundColor: colors.border }}
          disabledTitleStyle={{ color: colors.secondary }}
          icon={<Icon name="add" color="white" style={styles.buttonIcon} />}
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
    marginHorizontal: 0,
    marginVertical: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '500',
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    paddingVertical: 12,
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
  contentContainer: {
    padding: 16,
  },
}); 