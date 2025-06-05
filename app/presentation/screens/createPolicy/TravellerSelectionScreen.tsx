// app/presentation/screens/createPolicy/TravellerSelectionScreen.tsx
import { Button } from "@/app/presentation/components/ui/Button";
import { useTheme } from "@/app/presentation/contexts/ThemeContext";
import { useTravellerDetails } from "@/app/presentation/contexts/TravellerDetailsContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const TravellerSelectionScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    travellers,
    totalTravellers,
    initializeTravellers,
    setCurrentTraveller,
    getNextIncompleteTraveller,
    areAllTravellersComplete,
    getTravellerCompletionSummary,
  } = useTravellerDetails();

  const numberOfTravellers = parseInt(params.numberOfTravellers as string) || 2;

  // Initialize travellers when component mounts
  useEffect(() => {
    if (totalTravellers !== numberOfTravellers) {
      initializeTravellers(numberOfTravellers);
    }
  }, [numberOfTravellers, totalTravellers, initializeTravellers]);

  const [totalPrice] = useState(0);

  const handleTravellerPress = (travellerId: string) => {
    setCurrentTraveller(travellerId);
    router.push({
      pathname: "/(createPolicy)/traveller-details",
      params: {
        travellerId,
        numberOfTravellers: numberOfTravellers.toString(),
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    if (areAllTravellersComplete()) {
      // All travellers are complete, go to review
      router.push("/(createPolicy)/policy-review");
    } else {
      // Find next incomplete traveller and navigate to their details
      const nextIncomplete = getNextIncompleteTraveller();
      if (nextIncomplete) {
        handleTravellerPress(nextIncomplete);
      }
    }
  };

  const getTravellerIcon = (travellerId: string) => {
    const traveller = travellers[travellerId];
    const isPrimary = travellerId === "traveller_1";
    const isComplete = traveller?.completionStatus.isComplete || false;

    return (
      <View
        style={[
          styles.travellerIcon,
          {
            backgroundColor: isPrimary
              ? theme.colors.primary.main + "20"
              : isComplete
              ? theme.colors.feedback.success + "20"
              : theme.colors.neutral.gray200,
          },
        ]}
      >
        <Ionicons
          name={isComplete ? "checkmark" : "person"}
          size={20}
          color={
            isPrimary
              ? theme.colors.primary.main
              : isComplete
              ? theme.colors.feedback.success
              : theme.colors.neutral.gray500
          }
        />
      </View>
    );
  };

  const getTravellerName = (travellerId: string) => {
    const traveller = travellers[travellerId];
    const travellerNumber = travellerId.replace("traveller_", "");

    if (traveller?.formValues.fullName.trim()) {
      return traveller.formValues.fullName;
    }

    return `Traveller ${travellerNumber} Details`;
  };

  const getCardBackgroundColor = () => {
    return isDarkMode
      ? theme.colors.neutral.gray300
      : theme.colors.neutral.white;
  };

  const getBorderColor = () => {
    return isDarkMode
      ? theme.colors.neutral.gray400
      : theme.colors.neutral.gray200;
  };

  const completionSummary = getTravellerCompletionSummary();
  const canProceed = areAllTravellersComplete();

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
        <View style={styles.headerContent}>
          <Text
            style={[
              styles.headerTitle,
              { color: theme.colors.neutral.gray900 },
            ]}
          >
            Traveller Details
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: theme.colors.neutral.gray600 },
            ]}
          >
            {completionSummary.completed} of {completionSummary.total} completed
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { backgroundColor: theme.colors.neutral.gray200 },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.colors.primary.main,
                width: `${
                  (completionSummary.completed / completionSummary.total) * 100
                }%`,
              },
            ]}
          />
        </View>
        <Text
          style={[styles.progressText, { color: theme.colors.neutral.gray600 }]}
        >
          {completionSummary.completed} of {completionSummary.total} travellers
          completed
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Travellers List */}
        <View style={styles.travellersContainer}>
          {Object.keys(travellers).map((travellerId, index) => {
            const traveller = travellers[travellerId];
            const isComplete = traveller.completionStatus.isComplete;
            const hasPersonalDetails =
              traveller.completionStatus.hasPersonalDetails;
            const hasPolicySelected =
              traveller.completionStatus.hasPolicySelected;

            return (
              <TouchableOpacity
                key={travellerId}
                style={[
                  styles.travellerCard,
                  {
                    backgroundColor: getCardBackgroundColor(),
                    borderColor: isComplete
                      ? theme.colors.feedback.success
                      : getBorderColor(),
                    borderWidth: isComplete ? 2 : 1,
                  },
                ]}
                onPress={() => handleTravellerPress(travellerId)}
                activeOpacity={0.7}
              >
                <View style={styles.travellerCardContent}>
                  <View style={styles.travellerInfo}>
                    {getTravellerIcon(travellerId)}
                    <View style={styles.travellerTextInfo}>
                      <Text
                        style={[
                          styles.travellerName,
                          { color: theme.colors.neutral.gray900 },
                        ]}
                      >
                        {getTravellerName(travellerId)}
                      </Text>

                      {/* Status indicators */}
                      <View style={styles.statusIndicators}>
                        <View style={styles.statusItem}>
                          <Ionicons
                            name={
                              hasPersonalDetails
                                ? "checkmark-circle"
                                : "radio-button-off"
                            }
                            size={16}
                            color={
                              hasPersonalDetails
                                ? theme.colors.feedback.success
                                : theme.colors.neutral.gray400
                            }
                          />
                          <Text
                            style={[
                              styles.statusText,
                              {
                                color: hasPersonalDetails
                                  ? theme.colors.feedback.success
                                  : theme.colors.neutral.gray400,
                              },
                            ]}
                          >
                            Personal Details
                          </Text>
                        </View>

                        <View style={styles.statusItem}>
                          <Ionicons
                            name={
                              hasPolicySelected
                                ? "checkmark-circle"
                                : "radio-button-off"
                            }
                            size={16}
                            color={
                              hasPolicySelected
                                ? theme.colors.feedback.success
                                : theme.colors.neutral.gray400
                            }
                          />
                          <Text
                            style={[
                              styles.statusText,
                              {
                                color: hasPolicySelected
                                  ? theme.colors.feedback.success
                                  : theme.colors.neutral.gray400,
                              },
                            ]}
                          >
                            Policy Selected
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.travellerActions}>
                    {isComplete && (
                      <View
                        style={[
                          styles.completeBadge,
                          {
                            backgroundColor:
                              theme.colors.feedback.success + "20",
                          },
                        ]}
                      >
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={theme.colors.feedback.success}
                        />
                      </View>
                    )}
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={theme.colors.neutral.gray500}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View
        style={[
          styles.bottomSection,
          { backgroundColor: theme.colors.neutral.background },
        ]}
      >
        {/* Summary */}
        <View style={styles.summaryContainer}>
          <TouchableOpacity style={styles.summaryHeader}>
            <Text
              style={[
                styles.summaryTitle,
                { color: theme.colors.neutral.gray600 },
              ]}
            >
              SUMMARY
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color={theme.colors.neutral.gray600}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.summaryPrice,
              { color: theme.colors.neutral.gray900 },
            ]}
          >
            ₹{totalPrice.toLocaleString()}
          </Text>
        </View>

        {/* Continue Button */}
        <Button
          title={canProceed ? "Continue to Review" : "Continue"}
          onPress={handleContinue}
          fullWidth
          size="large"
          style={[
            styles.continueButton,
            {
              backgroundColor: theme.colors.primary.main,
              opacity: canProceed ? 1 : 0.8,
            },
          ]}
        />
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
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  travellersContainer: {
    gap: 16,
  },
  travellerCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  travellerCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  travellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  travellerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  travellerTextInfo: {
    flex: 1,
  },
  travellerName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  statusIndicators: {
    gap: 4,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  travellerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  completeBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  summaryContainer: {
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginRight: 8,
  },
  summaryPrice: {
    fontSize: 32,
    fontWeight: "700",
  },
  continueButton: {
    borderRadius: 12,
    height: 52,
  },
});
