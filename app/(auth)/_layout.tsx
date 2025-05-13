// app/(auth)/_layout.tsx
import { useAuth } from "@/app/presentation/contexts/AuthContext";
import { useTheme } from "@/app/presentation/contexts/ThemeContext";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { theme } from "../theme";

function AuthNavigation() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.neutral.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          gestureEnabled: false, // Prevent swipe back on login
        }}
      />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect to app if already authenticated
      router.replace("/home");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.neutral.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  return <AuthNavigation />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
