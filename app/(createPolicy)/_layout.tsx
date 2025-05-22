// app/(createPolicy)/_layout.tsx
import { theme } from "@/app/theme";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

function CreatePolicyNavigation() {
  return (
    <Stack
      screenOptions={{ 
        headerShown: false, 
        animation: "slide_from_right",
        contentStyle: { backgroundColor: theme.colors.neutral.background }
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="search-destination" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="traveller-selection" />
      <Stack.Screen name="traveller-details" />
      <Stack.Screen name="select-policy" />
      <Stack.Screen name="add-ons-selection" />
      {/* Add other screens as needed */}
    </Stack>
  );
}

export default function CreatePolicyLayout() {
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