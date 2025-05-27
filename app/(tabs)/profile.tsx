import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { Text, Button, Avatar } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
        <Avatar
          size={100}
          rounded
          title={getInitials(user?.name || '')}
          containerStyle={[
            styles.avatar,
            { backgroundColor: colors.primary }
          ]}
          titleStyle={{ color: colors.card }}
        />
        <Text h3 style={[styles.name, { color: colors.text }]}>
          {user?.name}
        </Text>
        <Text style={[styles.username, { color: colors.secondary }]}>
          @{user?.username}
        </Text>

        <View style={styles.settingsSection}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <FontAwesome name="moon-o" size={24} color={colors.text} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={isDarkMode ? colors.card : '#f4f3f4'}
            />
          </View>
        </View>

        <Button
          title="Logout"
          onPress={handleLogout}
          icon={
            <FontAwesome
              name="sign-out"
              size={20}
              color="white"
              style={{ marginRight: 10 }}
            />
          }
          buttonStyle={[
            styles.logoutButton,
            { backgroundColor: colors.primary }
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
  },
  profileCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    marginBottom: 8,
    textAlign: 'center',
  },
  username: {
    marginBottom: 24,
    fontSize: 16,
  },
  settingsSection: {
    width: '100%',
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  logoutButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
}); 