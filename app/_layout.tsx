// app/_layout.tsx
import { AppProvider } from "@/app/presentation/contexts/AppContext";
import { useAuth } from "@/app/presentation/contexts/AuthContext";
import { theme } from "@/app/theme";
import * as Font from 'expo-font';
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

function RootNavigation() {
  const { isLoading, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // User not authenticated and not in auth group - redirect to login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // User authenticated but in auth group - redirect to home
      router.replace('/home');
    }
  }, [isLoading, isAuthenticated, segments, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(createPolicy)" />

      {/* Add other screens as needed */}
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'Axiforma': require('../assets/fonts/Axiforma-Regular.otf'),
      'Axiforma-Bold': require('../assets/fonts/Axiforma-Bold.otf'),
      'Axiforma-Medium': require('../assets/fonts/Axiforma-Medium.otf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) return null;

  return (
    <AppProvider>
      <RootNavigation />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.background,
  },
});