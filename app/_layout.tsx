import { AppProvider } from "@/app/presentation/contexts/AppContext";
import * as Font from 'expo-font';
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";

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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(createPolicy)" />
      </Stack>
    </AppProvider>
  );
}