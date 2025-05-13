// createPolicy/_layout.tsx
import { theme } from "@/app/theme";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

function CreatePolicyNavigation() {
  return (
    <Stack
      initialRouteName="create-policy"
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="create-policy" />
      {/* Add other screens as needed */}
    </Stack>
  );
}

export default function RootLayout() {
  return <CreatePolicyNavigation />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.neutral.background,
  },
});
