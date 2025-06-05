// app/presentation/screens/createPolicy/AddOnsSelectionScreen.tsx
import { Button } from "@/app/presentation/components/ui/Button";
import { useTheme } from "@/app/presentation/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTravellerDetails } from "../../contexts/TravellerDetailsContext";

interface AddOn {
  id: string;
  name: string;
  price: number;
  isSelected: boolean;
  note?: string;
}

export const AddOnsSelectionScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const {markTravellerAddOnsSelected, areAllTravellersComplete} = useTravellerDetails();

  const planId = params.planId as string;
  const travellerNumber = params.travellerNumber as string;

  const [isExpanded, setIsExpanded] = useState(false);
  const [sameAddOnsAsTraveller1, setSameAddOnsAsTraveller1] = useState(true);
  const animationValue = useRef(new Animated.Value(0)).current;

  // Sample add-ons data
  const [addOns, setAddOns] = useState<AddOn[]>([
    {
      id: "political_risk",
      name: "Political Risk & Catastrophe Evacuation",
      price: 180,
      isSelected: true,
      note: undefined,
    },
    {
      id: "pre_existing_disease",
      name: "Pre-Existing Disease",
      price: 180,
      isSelected: false,
      note: "Note: On selection of this add-on a supporting document has to be uploaded",
    },
    {
      id: "cruise_cover",
      name: "Cruise Cover",
      price: 250,
      isSelected: false,
      note: undefined,
    },
  ]);

  // Base plan data
  const basePlanPrice = 3608;
  const selectedAddOnsTotal = addOns
    .filter((addon) => addon.isSelected)
    .reduce((sum, addon) => sum + addon.price, 0);
  const totalAmount = basePlanPrice + selectedAddOnsTotal;

  const handleAddOnToggle = (addOnId: string) => {
    setAddOns((prev) =>
      prev.map((addon) =>
        addon.id === addOnId
          ? { ...addon, isSelected: !addon.isSelected }
          : addon
      )
    );
  };

  // In AddOnsSelectionScreen.tsx, update the handleContinue method:

const handleContinue = () => {
  // Mark add-ons as selected for this traveller (optional step)
  markTravellerAddOnsSelected("");

  // Check if all travellers are complete
  if (areAllTravellersComplete()) {
    // All travellers have completed their details and policy selection
    router.push('/(createPolicy)/policy-review');
  } else {
    // Navigate back to traveller selection to continue with other travellers
    router.push('/(createPolicy)/traveller-selection');
  }
};

// Also update the handleBack method to go back to policy selection:
const handleBack = () => {
  router.back(); // This will go back to select-policy screen
};

  const toggleSummary = () => {
    const toValue = isExpanded ? 0 : 1;

    Animated.timing(animationValue, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setIsExpanded(!isExpanded);
  };

  const closeSummary = () => {
    Animated.timing(animationValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setIsExpanded(false);
  };

  // Summary data for the expandable section
  const summaryData = {
    basePlan: {
      name: "Style Pro",
      price: basePlanPrice,
    },
    selectedAddOns: addOns.filter((addon) => addon.isSelected),
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.neutral.background },
      ]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.neutral.background}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.neutral.background },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.neutral.gray900}
          />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: theme.colors.neutral.gray900 }]}
        >
          Select Add - Ons
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleBack}>
          <Ionicons
            name="close"
            size={24}
            color={theme.colors.neutral.gray900}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Same as Traveller 1 Option */}
        <TouchableOpacity
          style={[
            styles.sameAsTravellerOption,
            {
              backgroundColor: theme.colors.neutral.gray100,
              borderColor: theme.colors.neutral.gray200,
            },
          ]}
          onPress={() => setSameAddOnsAsTraveller1(!sameAddOnsAsTraveller1)}
        >
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: sameAddOnsAsTraveller1
                  ? theme.colors.primary.main
                  : "transparent",
                borderColor: sameAddOnsAsTraveller1
                  ? theme.colors.primary.main
                  : theme.colors.neutral.gray400,
              },
            ]}
          >
            {sameAddOnsAsTraveller1 && (
              <Ionicons
                name="checkmark"
                size={16}
                color={theme.colors.neutral.white}
              />
            )}
          </View>
          <Text
            style={[
              styles.sameAsTravellerText,
              { color: theme.colors.neutral.gray900 },
            ]}
          >
            Choose same add - on as traveller 1
          </Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.colors.neutral.gray100,
              borderColor: theme.colors.neutral.gray300,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.neutral.gray500}
            style={styles.searchIcon}
          />
          <Text
            style={[
              styles.searchPlaceholder,
              { color: theme.colors.neutral.gray500 },
            ]}
          >
            Search Add - Ons
          </Text>
        </View>

        {/* Add-ons List */}
        <View style={styles.addOnsList}>
          {addOns.map((addon) => (
            <View
              key={addon.id}
              style={[
                styles.addOnCard,
                {
                  backgroundColor: addon.isSelected
                    ? theme.colors.primary.main + "20"
                    : theme.colors.neutral.gray100,
                  borderColor: addon.isSelected
                    ? theme.colors.primary.main
                    : theme.colors.neutral.gray200,
                },
              ]}
            >
              <View style={styles.addOnContent}>
                <View style={styles.addOnInfo}>
                  <Text
                    style={[
                      styles.addOnName,
                      { color: theme.colors.neutral.gray900 },
                    ]}
                  >
                    {addon.name}
                  </Text>
                  {addon.note && (
                    <Text
                      style={[
                        styles.addOnNote,
                        { color: theme.colors.secondary.main },
                      ]}
                    >
                      {addon.note}
                    </Text>
                  )}
                  <Text
                    style={[
                      styles.addOnPriceLabel,
                      { color: theme.colors.neutral.gray500 },
                    ]}
                  >
                    NO. OF TRAVELLER
                  </Text>
                  <Text
                    style={[
                      styles.addOnPrice,
                      { color: theme.colors.neutral.gray900 },
                    ]}
                  >
                    ₹{addon.price}
                  </Text>
                </View>

                <View style={styles.addOnAction}>
                  {addon.isSelected ? (
                    <TouchableOpacity
                      style={[
                        styles.removeButton,
                        {
                          borderColor: theme.colors.secondary.main,
                          backgroundColor: "transparent",
                        },
                      ]}
                      onPress={() => handleAddOnToggle(addon.id)}
                    >
                      <Ionicons
                        name="remove"
                        size={16}
                        color={theme.colors.secondary.main}
                      />
                      <Text
                        style={[
                          styles.removeButtonText,
                          { color: theme.colors.secondary.main },
                        ]}
                      >
                        Remove
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.selectButton,
                        {
                          borderColor: theme.colors.primary.main,
                          backgroundColor: "transparent",
                        },
                      ]}
                      onPress={() => handleAddOnToggle(addon.id)}
                    >
                      <Ionicons
                        name="add"
                        size={16}
                        color={theme.colors.primary.main}
                      />
                      <Text
                        style={[
                          styles.selectButtonText,
                          { color: theme.colors.primary.main },
                        ]}
                      >
                        Select
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Section with Expandable Summary */}
      <View style={styles.bottomContainer}>
        <Animated.View
          style={[
            styles.summarySection,
            {
              backgroundColor: theme.colors.neutral.gray100,
              height: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [110, 450],
              }),
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 10,
            },
          ]}
        >
          {/* Close Button (only in expanded state) */}
          {isExpanded && (
            <View style={styles.expandedHeader}>
              <TouchableOpacity
                style={styles.summaryCloseButton}
                onPress={closeSummary}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.colors.neutral.gray900}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Expanded Content */}
          {isExpanded && (
            <Animated.View
              style={[
                styles.expandedContent,
                {
                  opacity: animationValue,
                },
              ]}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.expandedScrollView}
              >
                {/* Traveller Summary */}
                <View style={styles.travellerSection}>
                  <Text
                    style={[
                      styles.travellerTitle,
                      { color: theme.colors.primary.main },
                    ]}
                  >
                    TRAVELLER {travellerNumber}
                  </Text>

                  {/* Base Plan Section */}
                  <View style={styles.summaryRow}>
                    <View style={styles.summaryRowHeader}>
                      <Text
                        style={[
                          styles.summaryRowTitle,
                          { color: theme.colors.neutral.gray900 },
                        ]}
                      >
                        Plan
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.summaryDivider,
                        { backgroundColor: theme.colors.neutral.gray200 },
                      ]}
                    />
                    <View style={styles.summaryItem}>
                      <Text
                        style={[
                          styles.summaryItemName,
                          { color: theme.colors.neutral.gray900 },
                        ]}
                      >
                        {summaryData.basePlan.name}
                      </Text>
                      <Text
                        style={[
                          styles.summaryItemPrice,
                          { color: theme.colors.neutral.gray900 },
                        ]}
                      >
                        ₹{summaryData.basePlan.price.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {/* Add-Ons Section */}
                  {summaryData.selectedAddOns.length > 0 && (
                    <View style={styles.summaryRow}>
                      <View style={styles.summaryRowHeader}>
                        <Text
                          style={[
                            styles.summaryRowTitle,
                            { color: theme.colors.neutral.gray900 },
                          ]}
                        >
                          Add - Ons
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.summaryDivider,
                          { backgroundColor: theme.colors.neutral.gray200 },
                        ]}
                      />
                      {summaryData.selectedAddOns.map((addon, index) => (
                        <View key={index} style={styles.summaryItem}>
                          <Text
                            style={[
                              styles.summaryItemName,
                              { color: theme.colors.neutral.gray900 },
                            ]}
                          >
                            {addon.name}
                          </Text>
                          <Text
                            style={[
                              styles.summaryItemPrice,
                              { color: theme.colors.neutral.gray900 },
                            ]}
                          >
                            ₹{addon.price}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </ScrollView>
            </Animated.View>
          )}

          {/* Fixed Bottom Section - Summary Header and Continue Button */}
          <View style={styles.fixedBottom}>
            {/* Summary Header */}
            <View style={styles.summaryHeader}>
              <TouchableOpacity
                style={styles.summaryLeft}
                onPress={toggleSummary}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.summaryTitle,
                    { color: theme.colors.neutral.gray600 },
                  ]}
                >
                  SUMMARY
                </Text>
                {!isExpanded && (
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={theme.colors.neutral.gray600}
                    style={styles.chevronIcon}
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* Price and Continue Button Row */}
            <View style={styles.priceRow}>
              <Text
                style={[
                  styles.summaryPrice,
                  { color: theme.colors.neutral.gray900 },
                ]}
              >
                ₹{totalAmount.toLocaleString()}
              </Text>

              <Button
                title="Continue"
                onPress={handleContinue}
                size="large"
                style={[
                  styles.continueButton,
                  { backgroundColor: theme.colors.primary.main },
                ]}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight || 24,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 140, // Space for bottom summary section
  },
  sameAsTravellerOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sameAsTravellerText: {
    fontSize: 16,
    fontWeight: "500",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
  },
  addOnsList: {
    gap: 16,
  },
  addOnCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
  },
  addOnContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  addOnInfo: {
    flex: 1,
    marginRight: 16,
  },
  addOnName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  addOnNote: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  addOnPriceLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  addOnPrice: {
    fontSize: 20,
    fontWeight: "700",
  },
  addOnAction: {
    justifyContent: "center",
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  // Bottom Summary Styles
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  summarySection: {
    position: "relative",
  },
  expandedHeader: {
    position: "absolute",
    top: 16,
    right: 20,
    zIndex: 10,
  },
  summaryCloseButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  expandedContent: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    bottom: 110,
  },
  expandedScrollView: {
    paddingHorizontal: 20,
  },
  fixedBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    backgroundColor: "inherit",
  },
  summaryHeader: {
    marginBottom: 2,
    alignItems: "flex-start",
  },
  summaryLeft: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryPrice: {
    fontSize: 28,
    fontWeight: "700",
    flex: 1,
    textAlign: "left",
  },
  continueButton: {
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 32,
    marginLeft: 16,
  },
  travellerSection: {
    marginBottom: 24,
  },
  travellerTitle: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  summaryRow: {
    marginBottom: 20,
  },
  summaryRowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryRowTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  summaryDivider: {
    height: 1,
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  summaryItemName: {
    fontSize: 16,
    fontWeight: "400",
    flex: 1,
    marginRight: 16,
  },
  summaryItemPrice: {
    fontSize: 16,
    fontWeight: "600",
  },
});
