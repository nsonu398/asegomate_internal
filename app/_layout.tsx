// app/_layout.tsx
import { AppProvider } from "@/app/presentation/contexts/AppContext";
import { useAuth } from "@/app/presentation/contexts/AuthContext";
import { theme } from "@/app/theme";
import * as Font from 'expo-font';
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

function RootNavigation() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (user) {
      // Redirect to home if authenticated but in auth screens
      router.replace('/home');
    }
  }, [user, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
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