// app/_layout.tsx
import { AppProvider } from "@/app/presentation/contexts/AppContext";
import { useAuth } from "@/app/presentation/contexts/AuthContext";
import { theme } from "@/app/theme";
import * as Font from 'expo-font';
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

// @ts-ignore - Suppress typed routes errors
function RootNavigation() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // @ts-ignore
      router.replace('/presentation/screens/auth/login');
    } else if (user) {
      // @ts-ignore
      router.replace('/home');
    }
  }, [user, segments, isLoading, router]);

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
      <Stack.Screen 
        name="presentation/screens/auth/login" 
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="home" 
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}

(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.style = { fontFamily: 'Axiforma' };

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