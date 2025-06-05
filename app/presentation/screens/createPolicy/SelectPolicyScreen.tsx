// app/presentation/screens/createPolicy/SelectPolicyScreen.tsx
import { PolicyPlan } from "@/app/core/domain/entities/PolicyPlan";
import { Button } from "@/app/presentation/components/ui/Button";
import { usePolicyFilter } from "@/app/presentation/contexts/PolicyFilterContext";
import { useTheme } from "@/app/presentation/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePolicy } from "../../contexts/PolicyContext";
import { useTravellerDetails } from "../../contexts/TravellerDetailsContext";

export const SelectPolicyScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { selectedPlans, selectPlan, isLoading, error } = usePolicy();
  const { filteredPlans, isFilterActive, getFilterCount } = usePolicyFilter();
  const { markTravellerPolicySelected, areAllTravellersComplete } =
    useTravellerDetails();

  const travellerNumber = params.travellerNumber || "1";
  const travellerId = `traveller_${travellerNumber}`;

  // Local state for UI
  const [sameAsTraveller1, setSameAsTraveller1] = useState(false);
  const [localPlans, setLocalPlans] = useState<PolicyPlan[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current;

  // Initialize local plans from filtered plans
  useEffect(() => {
    if (filteredPlans && filteredPlans.length > 0) {
      const plansWithSelection = filteredPlans.map((plan) => ({
        ...plan,
        isSelected: selectedPlans[travellerId]?.id === plan.id,
        addOns: plan.addOns || 0,
      }));
      setLocalPlans(plansWithSelection);
    }
  }, [filteredPlans, selectedPlans, travellerId]);

  // Handle same as traveller 1 selection
  useEffect(() => {
    if (
      sameAsTraveller1 &&
      selectedPlans["traveller_1"] &&
      travellerNumber !== "1"
    ) {
      const traveller1Plan = selectedPlans["traveller_1"];
      handlePlanSelection(traveller1Plan.id);
    }
  }, [sameAsTraveller1]);

  const handlePlanSelection = (planId: string) => {
    const selectedPlan = localPlans.find((plan) => plan.id === planId);
    if (selectedPlan) {
      // Update local state
      setLocalPlans((prev) =>
        prev.map((plan) => ({
          ...plan,
          isSelected: plan.id === planId,
        }))
      );

      // Update context
      selectPlan(travellerId, selectedPlan);
    }
  };

  const handleRemovePlan = (planId: string) => {
    setLocalPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId ? { ...plan, isSelected: false } : plan
      )
    );

    // Remove from context - you might want to implement a removePlan method in PolicyContext
    // For now, we'll clear the selection
  };

  const handleAddOns = (planId: string) => {
    router.push({
      pathname: "/(createPolicy)/add-ons-selection",
      params: {
        planId: planId,
        travellerNumber: travellerNumber,
      },
    });
  };

  const handleViewBenefits = (planId: string) => {
    console.log("View benefits for plan:", planId);
    // You can implement a modal or new screen here
  };

  const handleContinue = () => {
    const selectedPlan = localPlans.find((plan) => plan.isSelected);
    if (!selectedPlan) {
      // Show error - no plan selected
      return;
    }

    // Mark policy as selected for this traveller
    markTravellerPolicySelected(travellerId);

    // Check if all travellers are complete
    if (areAllTravellersComplete()) {
      // All travellers have completed their details and policy selection
      router.push("/(createPolicy)/policy-review");
    } else {
      // Navigate back to traveller selection to continue with other travellers
      router.push("/(createPolicy)/traveller-selection");
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleFilterPress = () => {
    router.push("/(createPolicy)/policy-filter");
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

  const getCardBackgroundColor = (plan: PolicyPlan) => {
    if (plan.isSelected) {
      return isDarkMode ? theme.colors.primary.main + "30" : "#E0FFFE";
    }
    return isDarkMode
      ? theme.colors.neutral.gray100
      : theme.colors.neutral.white;
  };

  const getCardBorderColor = (plan: PolicyPlan) => {
    if (plan.isSelected) {
      return theme.colors.primary.main;
    }
    return isDarkMode
      ? theme.colors.neutral.gray400
      : theme.colors.neutral.gray200;
  };

  const calculateTotalAmount = () => {
    return Object.values(selectedPlans).reduce((total, plan) => {
      const premium = plan.agePremiums?.[0]?.premium || 0;
      return total + premium;
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const formatSumInsured = (sumInsured: string) => {
    return sumInsured.startsWith("$") ? sumInsured : `$${sumInsured}`;
  };

  const getPremiumForDisplay = (plan: PolicyPlan) => {
    const premium = plan.agePremiums?.[0]?.premium || 0;
    return formatCurrency(premium);
  };

  const renderPlanCard = (plan: PolicyPlan, index: number) => (
    <View
      key={plan.id}
      style={[
        styles.planCard,
        {
          backgroundColor: getCardBackgroundColor(plan),
          borderColor: getCardBorderColor(plan),
        },
      ]}
    >
      {/* Recommended Badge */}
      {plan.asegoRecomended && (
        <View style={[styles.recommendedBadge, { backgroundColor: "#D946EF" }]}>
          <Text
            style={[
              styles.recommendedText,
              { color: theme.colors.neutral.white },
            ]}
          >
            Recommended
          </Text>
        </View>
      )}

      {/* Best Selling Badge */}
      {plan.bestSellingPlan && (
        <View
          style={[
            styles.bestSellingBadge,
            { backgroundColor: theme.colors.secondary.main },
          ]}
        >
          <Text
            style={[
              styles.bestSellingText,
              { color: theme.colors.neutral.white },
            ]}
          >
            Best Selling
          </Text>
        </View>
      )}

      {/* Provider Header */}
      <View
        style={[
          styles.providerHeaderContainer,
          { backgroundColor: theme.colors.neutral.sOrange },
        ]}
      >
        <View style={styles.providerContent}>
          <View style={styles.providerLogoSection}>
            {plan.insurerLogoPath ? (
              <Image
                source={{ uri: plan.insurerLogoPath }}
                style={styles.insurerLogo}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.providerLogo}>
                <Text style={[styles.logoText, { color: "#E74C3C" }]}>
                  {plan.insurerName?.split(" ")[0] || "INSURER"}
                </Text>
                <Text style={[styles.logoSubtext, { color: "#1E3A8A" }]}>
                  {plan.insurerName?.split(" ")[1] || ""}
                </Text>
              </View>
            )}
            <Text style={[styles.providerName, { color: "#E74C3C" }]}>
              {plan.insurerName}
            </Text>
            <View style={[styles.orangeLine, { backgroundColor: "#FF9500" }]} />
          </View>
          <View style={styles.menuIcon}>
            <View style={styles.menuDot} />
            <View style={styles.menuDot} />
            <View style={styles.menuDot} />
          </View>
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.productInfoSection}>
        <Text
          style={[styles.productLabel, { color: theme.colors.neutral.gray400 }]}
        >
          PRODUCT NAME
        </Text>
        <View style={styles.productNameRow}>
          <Text
            style={[
              styles.productName,
              { color: theme.colors.neutral.gray900 },
            ]}
          >
            {plan.displayName || plan.name}
          </Text>
          <TouchableOpacity onPress={() => handleViewBenefits(plan.id)}>
            <Text
              style={[
                styles.viewBenefits,
                { color: theme.colors.primary.main },
              ]}
            >
              View benefits
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Amounts Row */}
      <View style={styles.amountsSection}>
        <View style={styles.amountColumn}>
          <Text
            style={[
              styles.amountLabel,
              { color: theme.colors.neutral.gray400 },
            ]}
          >
            SUM INSURED
          </Text>
          <Text
            style={[
              styles.amountValue,
              { color: theme.colors.neutral.gray900 },
            ]}
          >
            {formatSumInsured(plan.sumInsured)}
          </Text>
        </View>
        <View
          style={[
            styles.verticalDivider,
            { backgroundColor: theme.colors.neutral.gray200 },
          ]}
        />
        <View style={styles.amountColumn}>
          <Text
            style={[
              styles.amountLabel,
              { color: theme.colors.neutral.gray400 },
            ]}
          >
            PREMIUM
          </Text>
          <Text
            style={[
              styles.amountValue,
              { color: theme.colors.neutral.gray900 },
            ]}
          >
            {getPremiumForDisplay(plan)}
          </Text>
        </View>
      </View>

      {/* Separator Line */}
      <View
        style={[
          styles.sectionSeparator,
          { backgroundColor: theme.colors.neutral.gray200 },
        ]}
      />

      {/* Add-ons Row */}
      <View style={styles.addOnsSection}>
        <TouchableOpacity
          style={styles.addOnsButton}
          onPress={() => handleAddOns(plan.id)}
        >
          <Ionicons name="add" size={20} color={theme.colors.primary.main} />
          <Text
            style={[styles.addOnsText, { color: theme.colors.primary.main }]}
          >
            Choose Add - Ons
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.selectedBadge,
            { backgroundColor: theme.colors.secondary.main + "20" },
          ]}
        >
          <Text
            style={[
              styles.selectedText,
              { color: theme.colors.secondary.main },
            ]}
          >
            {plan.addOns || 0} Selected
          </Text>
        </View>
      </View>

      {/* Action Button */}
      {plan.isSelected ? (
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.removeButton,
            {
              borderColor: theme.colors.secondary.main,
              backgroundColor: "transparent",
            },
          ]}
          onPress={() => handleRemovePlan(plan.id)}
        >
          <Ionicons
            name="remove"
            size={20}
            color={theme.colors.secondary.main}
          />
          <Text
            style={[
              styles.actionButtonText,
              { color: theme.colors.secondary.main },
            ]}
          >
            Remove Plan
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.selectButton,
            {
              borderColor: theme.colors.primary.main,
              backgroundColor: "transparent",
            },
          ]}
          onPress={() => handlePlanSelection(plan.id)}
        >
          <Ionicons name="add" size={20} color={theme.colors.primary.main} />
          <Text
            style={[
              styles.actionButtonText,
              { color: theme.colors.primary.main },
            ]}
          >
            Select Plan
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: theme.colors.neutral.background },
        ]}
      >
        <Text
          style={[styles.loadingText, { color: theme.colors.neutral.gray600 }]}
        >
          Loading plans...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: theme.colors.neutral.background },
        ]}
      >
        <Text
          style={[styles.errorText, { color: theme.colors.feedback.error }]}
        >
          {error}
        </Text>
        <Button
          title="Retry"
          onPress={() => router.back()}
          style={styles.retryButton}
        />
      </View>
    );
  }

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

      {/* Header with Filter Icon */}
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

        <View style={styles.headerCenter}>
          <Text
            style={[
              styles.headerTitle,
              { color: theme.colors.neutral.gray900 },
            ]}
          >
            Choose Plan
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: theme.colors.neutral.gray600 },
            ]}
          >
            Traveller {travellerNumber}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleFilterPress}
        >
          <Ionicons
            name="filter"
            size={24}
            color={
              isFilterActive()
                ? theme.colors.primary.main
                : theme.colors.neutral.gray600
            }
          />
          {getFilterCount() > 0 && (
            <View
              style={[
                styles.filterBadge,
                { backgroundColor: theme.colors.secondary.main },
              ]}
            >
              <Text
                style={[
                  styles.filterBadgeText,
                  { color: theme.colors.neutral.white },
                ]}
              >
                {getFilterCount()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Show filter status */}
      {isFilterActive() && (
        <View
          style={[
            styles.filterStatus,
            { backgroundColor: theme.colors.primary.main + "20" },
          ]}
        >
          <Text
            style={[
              styles.filterStatusText,
              { color: theme.colors.primary.main },
            ]}
          >
            {localPlans.length} plan{localPlans.length !== 1 ? "s" : ""} found
            with filters applied
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(createPolicy)/policy-filter")}
          >
            <Text
              style={[
                styles.editFiltersText,
                { color: theme.colors.primary.main },
              ]}
            >
              Edit Filters
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Same as Traveller 1 Option - Only show if not traveller 1 */}
        {travellerNumber !== "1" && selectedPlans["traveller_1"] && (
          <TouchableOpacity
            style={[
              styles.sameAsTravellerOption,
              {
                backgroundColor: theme.colors.neutral.gray100,
                borderColor: theme.colors.neutral.gray300,
              },
            ]}
            onPress={() => setSameAsTraveller1(!sameAsTraveller1)}
          >
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: sameAsTraveller1
                    ? theme.colors.primary.main
                    : "transparent",
                  borderColor: sameAsTraveller1
                    ? theme.colors.primary.main
                    : theme.colors.neutral.gray400,
                },
              ]}
            >
              {sameAsTraveller1 && (
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
              Choose same plan as traveller 1
            </Text>
          </TouchableOpacity>
        )}

        {/* Insurance Plans */}
        {localPlans.length > 0 ? (
          <View style={styles.plansContainer}>
            {localPlans.map(renderPlanCard)}
          </View>
        ) : (
          <View style={styles.noPlansContainer}>
            <Text
              style={[
                styles.noPlansText,
                { color: theme.colors.neutral.gray600 },
              ]}
            >
              No plans available. Please try different criteria.
            </Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Section with Summary */}
      <View style={styles.bottomContainer}>
        <Animated.View
          style={[
            styles.summarySection,
            {
              backgroundColor: theme.colors.neutral.gray100,
              height: isExpanded
                ? animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [110, 400],
                  })
                : 110,
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
                style={styles.closeButton}
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
                {Object.entries(selectedPlans).map(([travellerId, plan]) => {
                  const travellerNum = travellerId.replace("traveller_", "");
                  return (
                    <View key={travellerId} style={styles.travellerSection}>
                      <Text
                        style={[
                          styles.travellerTitle,
                          { color: theme.colors.primary.main },
                        ]}
                      >
                        TRAVELLER {travellerNum}
                      </Text>
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
                            {plan.displayName || plan.name}
                          </Text>
                          <Text
                            style={[
                              styles.summaryItemPrice,
                              { color: theme.colors.neutral.gray900 },
                            ]}
                          >
                            {getPremiumForDisplay(plan)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </Animated.View>
          )}

          {/* Fixed Bottom Section */}
          <View style={styles.fixedBottom}>
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

            <View style={styles.priceRow}>
              <Text
                style={[
                  styles.summaryPrice,
                  { color: theme.colors.neutral.gray900 },
                ]}
              >
                {formatCurrency(calculateTotalAmount())}
              </Text>

              <Button
                title="Continue"
                onPress={handleContinue}
                size="large"
                disabled={!localPlans.some((plan) => plan.isSelected)}
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
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
  headerCenter: {
    flex: 1,
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
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  filterStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  filterStatusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  editFiltersText: {
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
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
  plansContainer: {
    gap: 16,
  },
  noPlansContainer: {
    padding: 40,
    alignItems: "center",
  },
  noPlansText: {
    fontSize: 16,
    textAlign: "center",
  },
  planCard: {
    borderRadius: 16,
    borderWidth: 2,
    overflow: "hidden",
    position: "relative",
  },
  recommendedBadge: {
    position: "absolute",
    top: -1,
    left: "50%",
    transform: [{ translateX: -50 }],
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: "600",
  },
  bestSellingBadge: {
    position: "absolute",
    top: -1,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  bestSellingText: {
    fontSize: 10,
    fontWeight: "600",
  },
  providerHeaderContainer: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  providerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  providerLogoSection: {
    flex: 1,
  },
  insurerLogo: {
    width: 60,
    height: 30,
    marginBottom: 8,
  },
  providerLogo: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "700",
    marginRight: 4,
  },
  logoSubtext: {
    fontSize: 16,
    fontWeight: "700",
  },
  providerName: {
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 8,
  },
  orangeLine: {
    width: 60,
    height: 3,
    borderRadius: 2,
  },
  menuIcon: {
    flexDirection: "row",
    padding: 8,
    gap: 3,
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#9CA3AF",
  },
  productInfoSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  productLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  productNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontSize: 24,
    fontWeight: "700",
    flex: 1,
  },
  viewBenefits: {
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  amountsSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  amountColumn: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  verticalDivider: {
    width: 1,
    marginHorizontal: 20,
    alignSelf: "stretch",
  },
  sectionSeparator: {
    height: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addOnsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  addOnsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addOnsText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  selectedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: "500",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  selectButton: {},
  removeButton: {},
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
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
  closeButton: {
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
    marginBottom: 0,
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
