// app/(createPolicy)/_layout.tsx
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { PolicyProvider } from "../presentation/contexts/PolicyContext";
import { useTheme } from "../presentation/contexts/ThemeContext";
import { TravellerDetailsProvider } from "../presentation/contexts/TravellerDetailsContext";
import { TripDetailsProvider } from "../presentation/contexts/TripDetailsContext";

function CreatePolicyNavigation() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: theme.colors.neutral.black },
        presentation: "card",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="search-destination" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="traveller-selection" />
      <Stack.Screen name="traveller-details" />
      <Stack.Screen name="select-policy" />
      <Stack.Screen name="add-ons-selection" />
      <Stack.Screen name="policy-review" />
      <Stack.Screen name="policy-payment" />
      {/* Add other screens as needed */}
    </Stack>
  );
}

export default function CreatePolicyLayout() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.neutral.background }}>
      <PolicyProvider>
        <TripDetailsProvider>
          <TravellerDetailsProvider>
            <CreatePolicyNavigation />
          </TravellerDetailsProvider>
        </TripDetailsProvider>
      </PolicyProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
