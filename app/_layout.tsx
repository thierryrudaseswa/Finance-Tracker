import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Toast from 'react-native-toast-message';

// Customize theme colors
const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#1F2937',
    card: '#374151',
    text: '#FFFFFF',
    border: '#374151',
    primary: '#60A5FA',
  },
};

const customLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F3F4F6',
    card: '#FFFFFF',
    text: '#000000',
    border: '#E5E7EB',
    primary: '#2563EB',
  },
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? customDarkTheme : customLightTheme;

  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationThemeProvider value={theme}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? theme.colors.card : theme.colors.background,
              },
              headerTintColor: theme.colors.text,
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="expense/[id]" 
              options={{ 
                title: 'Expense Details',
                headerStyle: {
                  backgroundColor: colorScheme === 'dark' ? theme.colors.card : theme.colors.background,
                },
                headerTintColor: theme.colors.text,
              }} 
            />
            <Stack.Screen 
              name="expense/edit/[id]" 
              options={{ 
                title: 'Edit Expense',
                headerStyle: {
                  backgroundColor: colorScheme === 'dark' ? theme.colors.card : theme.colors.background,
                },
                headerTintColor: theme.colors.text,
              }} 
            />
            <Stack.Screen 
              name="expenses/new" 
              options={{ 
                title: 'New Expense',
                headerStyle: {
                  backgroundColor: colorScheme === 'dark' ? theme.colors.card : theme.colors.background,
                },
                headerTintColor: theme.colors.text,
              }} 
            />
          </Stack>
          <Toast />
        </NavigationThemeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
