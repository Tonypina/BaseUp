import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { View, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { Redirect, router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useSession } from '@/context/ctx';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function TeamsLayout() {
  const { session, isLoading } = useSession();

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

   // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{
        paddingTop: 50,
        paddingLeft: 20,
        backgroundColor: '#EDECEC'
      }}>
        <TouchableOpacity
          onPress={() => router.replace('/')}
        >
          <Ionicons size={30} name='chevron-back-outline' />
        </TouchableOpacity>
      </View>
      <Stack>
        <Stack.Screen name="show-team" options={{ headerShown: false }} />
        <Stack.Screen name="create-team" options={{ headerShown: false }} />
        <Stack.Screen name="update-team" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
