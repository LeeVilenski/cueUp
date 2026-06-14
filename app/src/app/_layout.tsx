import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { DatabaseProvider } from '@/db/provider';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <DatabaseProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="session/new" options={{ presentation: 'modal', title: 'Start session' }} />
          <Stack.Screen name="session/[id]/active" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="session/[id]/summary" options={{ title: 'Session summary' }} />
          <Stack.Screen name="break-log/new" options={{ presentation: 'modal', title: 'Log a break' }} />
          <Stack.Screen name="break-log/index" options={{ title: 'Break history' }} />
        </Stack>
      </DatabaseProvider>
    </ThemeProvider>
  );
}
