// app/presentation/screens/createPolicy/TravellerDetailsScreen.tsx
import { Button } from "@/app/presentation/components/ui/Button";
import { TextInput } from "@/app/presentation/components/ui/TextInput";
import { useTheme } from "@/app/presentation/contexts/ThemeContext";
import { useTravellerDetails } from "@/app/presentation/contexts/TravellerDetailsContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "../../components/ui/Dropdown";
import { useApp } from "../../contexts/AppContext";
import { useMasterData } from "../../contexts/MasterDataContext";
import { usePolicy } from "../../contexts/PolicyContext";
import { useTripDetails } from "../../contexts/TripDetailsContext";

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: theme.colors.neutral.gray100,
          borderColor: theme.colors.neutral.gray200,
        },
      ]}
    >
      <TouchableOpacity style={styles.sectionHeader} onPress={onToggle}>
        <View style={styles.sectionHeaderLeft}>
          {icon}
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.neutral.gray900 },
            ]}
          >
            {title}
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.colors.neutral.gray500}
        />
      </TouchableOpacity>

      {isExpanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

const relationshipOptions = [
  "Spouse",
  "Parent",
  "Child",
  "Sibling",
  "Friend",
  "Other",
];

const stateOptions = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const countryOptions = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Singapore",
  "UAE",
  "Other",
];

export const TravellerDetailsScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setCalendarCallback } = useApp();
  const { fetchPlans } = usePolicy();
  const { user } = useApp();
  const { tripDetails } = useTripDetails();
  const { regions } = useMasterData();

  const {
    travellers,
    currentTravellerId,
    setCurrentTraveller,
    getCurrentTravellerData,
    updateCurrentTravellerField,
    validateCurrentTravellerForm,
    markTravellerPersonalDetailsComplete,
    expandedSections,
    toggleSection,
    isLoading,
    error,
    setLoading,
    setError,
  } = useTravellerDetails();

  const travellerId = params.travellerId as string;
  const travellerNumber = travellerId?.replace("traveller_", "") || "1";
  const numberOfTravellers = parseInt(params.numberOfTravellers as string) || 1;

  // Set current traveller when component mounts
  useEffect(() => {
    if (travellerId && travellerId !== currentTravellerId) {
      setCurrentTraveller(travellerId);
    }
  }, [travellerId, currentTravellerId, setCurrentTraveller]);

  const currentTravellerData = getCurrentTravellerData();
  const formValues = currentTravellerData?.formValues;
  const validationErrors = currentTravellerData?.validationErrors;

  if (!currentTravellerData || !formValues || !validationErrors) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.neutral.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.neutral.gray600 }]}>
          Loading traveller details...
        </Text>
      </View>
    );
  }

  const handleDatePress = () => {
    setCalendarCallback((selectedDate: string) => {
      updateCurrentTravellerField("dateOfBirth", selectedDate);
    });
    router.push({
      pathname: "/(createPolicy)/calendar",
      params: {
        dateType: "birth",
        selectedDate: formValues.dateOfBirth,
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!validateCurrentTravellerForm()) {
      setError("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mark personal details as complete
      markTravellerPersonalDetailsComplete(travellerId);

      // Calculate age from date of birth
      const birthDate = new Date(formValues.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      // Fetch plans for this traveller
      await fetchPlans({
        duration: tripDetails.tripDays,
        age: age,
        category: regions?.find(
          (reg) =>
            reg?.name?.toLowerCase() == tripDetails?.region?.toLowerCase()
        )?.id ?? "0",
        partnerId: user?.orgId == "0" ? "" : user?.orgId,
      });

      // Navigate to policy selection screen
      router.push({
        pathname: "/(createPolicy)/select-policy",
        params: {
          travellerNumber: travellerNumber,
        },
      });
    } catch (error) {
      setError("Failed to save details. Please try again.");
      Alert.alert("Error", "Failed to save details. Please try again.");
    } finally {
      setLoading(false);
    }
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
          Traveller {travellerNumber} Details
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Error Display */}
      {error && (
        <View
          style={[
            styles.errorContainer,
            { backgroundColor: theme.colors.feedback.error + "20" },
          ]}
        >
          <Text
            style={[styles.errorText, { color: theme.colors.feedback.error }]}
          >
            {error}
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Personal Details Section */}
        <CollapsibleSection
          title="Personal Details"
          icon={
            <Ionicons
              name="person"
              size={20}
              color={theme.colors.primary.main}
            />
          }
          isExpanded={expandedSections.personal}
          onToggle={() => toggleSection("personal")}
        >
          {/* Upload Passport */}
          <TouchableOpacity
            style={[
              styles.uploadContainer,
              {
                borderColor: theme.colors.neutral.gray300,
                backgroundColor: theme.colors.neutral.gray100,
              },
            ]}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={24}
              color={theme.colors.primary.main}
            />
            <Text
              style={[
                styles.uploadTitle,
                { color: theme.colors.neutral.gray900 },
              ]}
            >
              Upload Passport
            </Text>
            <Text
              style={[
                styles.uploadSubtitle,
                { color: theme.colors.neutral.gray500 },
              ]}
            >
              File Support: JPG, PNG
            </Text>
          </TouchableOpacity>

          <TextInput
            label="Passport Number"
            placeholder="eg. A1234567"
            value={formValues.passportNumber}
            onChangeText={(text) => updateCurrentTravellerField("passportNumber", text)}
            error={validationErrors.passportNumber}
          />

          <TextInput
            label="Full Name"
            placeholder="eg. John Doe"
            value={formValues.fullName}
            onChangeText={(text) => updateCurrentTravellerField("fullName", text)}
            error={validationErrors.fullName}
          />

          {/* Gender Selection */}
          <View style={styles.inputGroup}>
            <Text
              style={[styles.label, { color: theme.colors.neutral.gray900 }]}
            >
              Gender
            </Text>
            <View style={styles.genderContainer}>
              {["Male", "Female", "Other"].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    {
                      backgroundColor:
                        formValues.gender === gender
                          ? theme.colors.primary.main + "20"
                          : theme.colors.neutral.gray100,
                      borderColor:
                        formValues.gender === gender
                          ? theme.colors.primary.main
                          : theme.colors.neutral.gray300,
                    },
                  ]}
                  onPress={() => updateCurrentTravellerField("gender", gender as any)}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      {
                        color:
                          formValues.gender === gender
                            ? theme.colors.primary.main
                            : theme.colors.neutral.gray600,
                      },
                    ]}
                  >
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {validationErrors.gender && (
              <Text
                style={[
                  styles.errorText,
                  { color: theme.colors.feedback.error },
                ]}
              >
                {validationErrors.gender}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.dateInput,
              {
                borderColor: validationErrors.dateOfBirth
                  ? theme.colors.feedback.error
                  : theme.colors.neutral.gray300,
                backgroundColor: theme.colors.neutral.gray100,
              },
            ]}
            onPress={handleDatePress}
          >
            <Text
              style={[styles.label, { color: theme.colors.neutral.gray900 }]}
            >
              Date Of Birth
            </Text>
            <View style={styles.dateInputContent}>
              <Text
                style={[
                  styles.dateInputText,
                  {
                    color: formValues.dateOfBirth
                      ? theme.colors.neutral.gray900
                      : theme.colors.neutral.gray400,
                  },
                ]}
              >
                {formValues.dateOfBirth || "eg. MM/DD/YYYY"}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.colors.neutral.gray500}
              />
            </View>
          </TouchableOpacity>
          {validationErrors.dateOfBirth && (
            <Text
              style={[styles.errorText, { color: theme.colors.feedback.error }]}
            >
              {validationErrors.dateOfBirth}
            </Text>
          )}

          <TextInput
            label="Address Line 1"
            placeholder="eg. 123 Main Street"
            value={formValues.addressLine1}
            onChangeText={(text) => updateCurrentTravellerField("addressLine1", text)}
            error={validationErrors.addressLine1}
          />

          <TextInput
            label="Address Line 2"
            placeholder="eg. Apartment 4B"
            value={formValues.addressLine2}
            onChangeText={(text) => updateCurrentTravellerField("addressLine2", text)}
            error={validationErrors.addressLine2}
          />

          <TextInput
            label="Pincode"
            placeholder="eg. 400001"
            value={formValues.pincode}
            onChangeText={(text) => updateCurrentTravellerField("pincode", text)}
            error={validationErrors.pincode}
            keyboardType="numeric"
          />

          <TextInput
            label="City"
            placeholder="eg. Mumbai"
            value={formValues.city}
            onChangeText={(text) => updateCurrentTravellerField("city", text)}
            error={validationErrors.city}
          />

          <TextInput
            label="District"
            placeholder="eg. Mumbai City"
            value={formValues.district}
            onChangeText={(text) => updateCurrentTravellerField("district", text)}
            error={validationErrors.district}
          />

          <Dropdown
            label="State"
            placeholder="Select State"
            options={stateOptions}
            value={formValues.state}
            onSelect={(value) => updateCurrentTravellerField("state", value)}
            error={validationErrors.state}
          />

          <Dropdown
            label="Country"
            placeholder="Select Country"
            options={countryOptions}
            value={formValues.country}
            onSelect={(value) => updateCurrentTravellerField("country", value)}
            error={validationErrors.country}
          />

          <TextInput
            label="Email Address"
            placeholder="eg. john@example.com"
            value={formValues.emailAddress}
            onChangeText={(text) => updateCurrentTravellerField("emailAddress", text)}
            error={validationErrors.emailAddress}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Mobile Number"
            placeholder="eg. 9876543210"
            value={formValues.mobileNumber}
            onChangeText={(text) => updateCurrentTravellerField("mobileNumber", text)}
            error={validationErrors.mobileNumber}
            keyboardType="phone-pad"
          />
        </CollapsibleSection>

        {/* Nominee Details Section */}
        <CollapsibleSection
          title="Nominee Details"
          icon={
            <Ionicons
              name="person-add"
              size={20}
              color={theme.colors.primary.main}
            />
          }
          isExpanded={expandedSections.nominee}
          onToggle={() => toggleSection("nominee")}
        >
          <TextInput
            label="Nominee Name"
            placeholder="eg. Jane Doe"
            value={formValues.nomineeName}
            onChangeText={(text) => updateCurrentTravellerField("nomineeName", text)}
            error={validationErrors.nomineeName}
          />

          <Dropdown
            label="Relationship With Nominee"
            placeholder="Select Relationship"
            options={relationshipOptions}
            value={formValues.relationshipWithNominee}
            onSelect={(value) => updateCurrentTravellerField("relationshipWithNominee", value)}
            error={validationErrors.relationshipWithNominee}
          />
        </CollapsibleSection>

        {/* Emergency Contact Details Section */}
        <CollapsibleSection
          title="Emergency Contact Details"
          icon={
            <Ionicons name="call" size={20} color={theme.colors.primary.main} />
          }
          isExpanded={expandedSections.emergency}
          onToggle={() => toggleSection("emergency")}
        >
          <TextInput
            label="Emergency Contact Person Name"
            placeholder="eg. Emergency Contact"
            value={formValues.emergencyContactName}
            onChangeText={(text) => updateCurrentTravellerField("emergencyContactName", text)}
            error={validationErrors.emergencyContactName}
          />

          <TextInput
            label="Mobile Number"
            placeholder="eg. 9876543210"
            value={formValues.emergencyMobileNumber}
            onChangeText={(text) => updateCurrentTravellerField("emergencyMobileNumber", text)}
            error={validationErrors.emergencyMobileNumber}
            keyboardType="phone-pad"
          />

          <TextInput
            label="Email Address"
            placeholder="eg. emergency@example.com"
            value={formValues.emergencyEmailAddress}
            onChangeText={(text) => updateCurrentTravellerField("emergencyEmailAddress", text)}
            error={validationErrors.emergencyEmailAddress}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </CollapsibleSection>

        {/* Optional Details Section */}
        <CollapsibleSection
          title="Optional Details"
          icon={
            <View style={styles.dotsIcon}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: theme.colors.primary.main },
                ]}
              />
              <View
                style={[
                  styles.dot,
                  { backgroundColor: theme.colors.primary.main },
                ]}
              />
              <View
                style={[
                  styles.dot,
                  { backgroundColor: theme.colors.primary.main },
                ]}
              />
            </View>
          }
          isExpanded={expandedSections.optional}
          onToggle={() => toggleSection("optional")}
        >
          <TextInput
            label="Remark"
            placeholder="Any additional remarks"
            value={formValues.remark}
            onChangeText={(text) => updateCurrentTravellerField("remark", text)}
            error={validationErrors.remark}
            multiline
            numberOfLines={3}
          />

          <TextInput
            label="CR Reference Number"
            placeholder="eg. CR123456"
            value={formValues.crReferenceNumber}
            onChangeText={(text) => updateCurrentTravellerField("crReferenceNumber", text)}
            error={validationErrors.crReferenceNumber}
          />

          <TextInput
            label="Past Illness"
            placeholder="Any past medical conditions"
            value={formValues.pastIllness}
            onChangeText={(text) => updateCurrentTravellerField("pastIllness", text)}
            error={validationErrors.pastIllness}
            multiline
            numberOfLines={3}
          />

          <TextInput
            label="GST Number"
            placeholder="eg. 27AAAFG1234L1ZM"
            value={formValues.gstNumber}
            onChangeText={(text) => updateCurrentTravellerField("gstNumber", text)}
            error={validationErrors.gstNumber}
          />

          <Dropdown
            label="GST State"
            placeholder="Select GST State"
            options={stateOptions}
            value={formValues.gstState}
            onSelect={(value) => updateCurrentTravellerField("gstState", value)}
          />
        </CollapsibleSection>
      </ScrollView>

      {/* Continue Button */}
      <View
        style={[
          styles.buttonContainer,
          { backgroundColor: theme.colors.neutral.background },
        ]}
      >
        <Button
          title="Continue"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          fullWidth
          size="large"
          style={[
            styles.continueButton,
            { backgroundColor: theme.colors.primary.main },
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
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
  placeholder: {
    width: 40,
    height: 40,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  sectionContent: {
    padding: 20,
    paddingTop: 0,
  },
  uploadContainer: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dateInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  dateInputContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dateInputText: {
    fontSize: 16,
  },
  dotsIcon: {
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  continueButton: {
    borderRadius: 12,
    height: 52,
  },
});