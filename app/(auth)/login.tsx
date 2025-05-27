import React, { useState } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const showToast = (type: 'success' | 'error', title: string, message: string, duration = 3000) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: duration,
      topOffset: 50,
    });
  };

  const handleLogin = async () => {
    if (!username || !password) {
      showToast(
        'error',
        'Missing Information',
        'Please enter both username and password'
      );
      return;
    }

    try {
      setLoading(true);
      const users = await loginUser(username);
      
      if (users.length === 0) {
        showToast(
          'error',
          'Invalid Credentials',
          'Please check your username and password and try again.',
          4000
        );
        return;
      }

      const user = users[0];
      if (user.password !== password) {
        showToast(
          'error',
          'Invalid Credentials',
          'Please check your username and password and try again.',
          4000
        );
        return;
      }

      await login(user);
      showToast(
        'success',
        'Welcome',
        `Welcome back, ${user.name}!`
      );
      router.replace('/(tabs)');
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case 'NETWORK_ERROR':
            showToast(
              'error',
              'Connection Error',
              'Unable to connect to the server. Please check your internet connection.',
              4000
            );
            break;
          case 'USER_NOT_FOUND':
          default:
            showToast(
              'error',
              'Invalid Credentials',
              'Please check your username and password and try again.',
              4000
            );
        }
      } else {
        showToast(
          'error',
          'Invalid Credentials',
          'Please check your username and password and try again.',
          4000
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' }
    ]}>
      <View style={[
        styles.loginCard,
        { 
          backgroundColor: isDark ? '#374151' : '#FFFFFF',
          shadowColor: isDark ? '#000000' : '#6B7280',
        }
      ]}>
        <Text h3 style={[
          styles.title,
          { color: isDark ? '#FFFFFF' : '#000000' }
        ]}>
          Personal Finance Tracker
        </Text>
        <Input
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          leftIcon={{ 
            type: 'font-awesome', 
            name: 'user',
            color: isDark ? '#9CA3AF' : '#6B7280'
          }}
          inputStyle={{ color: isDark ? '#FFFFFF' : '#000000' }}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          containerStyle={styles.inputContainer}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon={{ 
            type: 'font-awesome', 
            name: 'lock',
            color: isDark ? '#9CA3AF' : '#6B7280'
          }}
          inputStyle={{ color: isDark ? '#FFFFFF' : '#000000' }}
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          containerStyle={styles.inputContainer}
        />
        <Button
          title="Login"
          onPress={handleLogin}
          loading={loading}
          icon={
            <FontAwesome
              name="sign-in"
              size={20}
              color="white"
              style={{ marginRight: 10 }}
            />
          }
          buttonStyle={[
            styles.loginButton,
            { backgroundColor: isDark ? '#60A5FA' : '#2563EB' }
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  loginCard: {
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 10,
  },
  loginButton: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
  },
}); 