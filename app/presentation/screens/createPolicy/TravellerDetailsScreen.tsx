// app/presentation/screens/createPolicy/TravellerDetailsScreen.tsx
import { Button } from "@/app/presentation/components/ui/Button";
import { TextInput } from "@/app/presentation/components/ui/TextInput";
import { useTheme } from "@/app/presentation/contexts/ThemeContext";
import { useForm } from "@/app/presentation/hooks/useForm";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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

interface TravellerDetailsFormValues {
  // Personal Details
  passportNumber: string;
  fullName: string;
  gender: "Male" | "Female" | "Other" | "";
  dateOfBirth: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
  district: string;
  state: string;
  country: string;
  emailAddress: string;
  mobileNumber: string;

  // Nominee Details
  nomineeName: string;
  relationshipWithNominee: string;

  // Emergency Contact Details
  emergencyContactName: string;
  emergencyMobileNumber: string;
  emergencyEmailAddress: string;

  // Optional Details
  remark: string;
  crReferenceNumber: string;
  pastIllness: string;
  gstNumber: string;
  gstState: string;
}

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
          backgroundColor: theme.colors.neutral.white,
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

  const travellerId = params.travellerId as string;
  const travellerNumber = travellerId?.replace("traveller_", "") || "1";

  // Section expansion states
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    nominee: false,
    emergency: false,
    optional: false,
  });

  // Dropdown states
  const [showRelationshipDropdown, setShowRelationshipDropdown] =
    useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showGstStateDropdown, setShowGstStateDropdown] = useState(false);

  const validateRequired = (value: string) => {
    if (!value.trim()) return "This field is required";
    return undefined;
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email";
    return undefined;
  };

  const validateMobile = (mobile: string) => {
    if (!mobile.trim()) return "Mobile number is required";
    if (mobile.length < 10) return "Please enter a valid mobile number";
    return undefined;
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<TravellerDetailsFormValues>({
    initialValues: {
      passportNumber: "",
      fullName: "",
      gender: "",
      dateOfBirth: "",
      addressLine1: "",
      addressLine2: "",
      pincode: "",
      city: "",
      district: "",
      state: "",
      country: "",
      emailAddress: "",
      mobileNumber: "",
      nomineeName: "",
      relationshipWithNominee: "",
      emergencyContactName: "",
      emergencyMobileNumber: "",
      emergencyEmailAddress: "",
      remark: "",
      crReferenceNumber: "",
      pastIllness: "",
      gstNumber: "",
      gstState: "",
    },
    validations: {
      passportNumber: validateRequired,
      fullName: validateRequired,
      gender: validateRequired,
      dateOfBirth: validateRequired,
      addressLine1: validateRequired,
      pincode: validateRequired,
      city: validateRequired,
      district: validateRequired,
      state: validateRequired,
      country: validateRequired,
      emailAddress: validateEmail,
      mobileNumber: validateMobile,
      nomineeName: validateRequired,
      relationshipWithNominee: validateRequired,
      emergencyContactName: validateRequired,
      emergencyMobileNumber: validateMobile,
      emergencyEmailAddress: validateEmail,
    },
    onSubmit: async (formValues) => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Navigate to policy selection screen
        router.push({
          pathname: "/(createPolicy)/select-policy",
          params: {
            travellerNumber: travellerNumber,
          },
        });
      } catch (error) {
        Alert.alert("Error", "Failed to save details. Please try again.");
      }
    },
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleDatePress = () => {
    router.push({
      pathname: "/(createPolicy)/calendar",
      params: {
        dateType: "birth",
        selectedDate: values.dateOfBirth,
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const renderDropdown = (
    options: string[],
    selectedValue: string,
    onSelect: (value: string) => void,
    isVisible: boolean,
    onClose: () => void
  ) => {
    if (!isVisible) return null;

    return (
      <View
        style={[
          styles.dropdown,
          {
            backgroundColor: theme.colors.neutral.white,
            borderColor: theme.colors.neutral.gray200,
          },
        ]}
      >
        <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dropdownItem,
                {
                  backgroundColor:
                    selectedValue === option
                      ? theme.colors.primary.main + "20"
                      : "transparent",
                },
              ]}
              onPress={() => {
                onSelect(option);
                onClose();
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  {
                    color:
                      selectedValue === option
                        ? theme.colors.primary.main
                        : theme.colors.neutral.gray900,
                  },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
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
            placeholder="eg. London"
            value={values.passportNumber}
            onChangeText={(text) => handleChange("passportNumber", text)}
            onBlur={() => handleBlur("passportNumber")}
            error={touched.passportNumber ? errors.passportNumber : undefined}
          />

          <TextInput
            label="Full Name"
            placeholder="eg. London"
            value={values.fullName}
            onChangeText={(text) => handleChange("fullName", text)}
            onBlur={() => handleBlur("fullName")}
            error={touched.fullName ? errors.fullName : undefined}
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
                        values.gender === gender
                          ? theme.colors.primary.main + "20"
                          : theme.colors.neutral.white,
                      borderColor:
                        values.gender === gender
                          ? theme.colors.primary.main
                          : theme.colors.neutral.gray300,
                    },
                  ]}
                  onPress={() => handleChange("gender", gender as any)}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      {
                        color:
                          values.gender === gender
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
            {touched.gender && errors.gender && (
              <Text
                style={[
                  styles.errorText,
                  { color: theme.colors.feedback.error },
                ]}
              >
                {errors.gender}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.dateInput,
              {
                borderColor: theme.colors.neutral.gray300,
                backgroundColor: theme.colors.neutral.white,
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
                    color: values.dateOfBirth
                      ? theme.colors.neutral.gray900
                      : theme.colors.neutral.gray400,
                  },
                ]}
              >
                {values.dateOfBirth || "eg. MM/DD/YYYY"}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.colors.neutral.gray500}
              />
            </View>
          </TouchableOpacity>

          <TextInput
            label="Address Line 1"
            placeholder="eg. London"
            value={values.addressLine1}
            onChangeText={(text) => handleChange("addressLine1", text)}
            onBlur={() => handleBlur("addressLine1")}
            error={touched.addressLine1 ? errors.addressLine1 : undefined}
          />

          <TextInput
            label="Address Line 2"
            placeholder="eg. London"
            value={values.addressLine2}
            onChangeText={(text) => handleChange("addressLine2", text)}
            onBlur={() => handleBlur("addressLine2")}
            error={touched.addressLine2 ? errors.addressLine2 : undefined}
          />

          <TextInput
            label="Pincode"
            placeholder="eg. London"
            value={values.pincode}
            onChangeText={(text) => handleChange("pincode", text)}
            onBlur={() => handleBlur("pincode")}
            error={touched.pincode ? errors.pincode : undefined}
            keyboardType="numeric"
          />

          <TextInput
            label="City"
            placeholder="eg. London"
            value={values.city}
            onChangeText={(text) => handleChange("city", text)}
            onBlur={() => handleBlur("city")}
            error={touched.city ? errors.city : undefined}
          />

          <TextInput
            label="District"
            placeholder="eg. London"
            value={values.district}
            onChangeText={(text) => handleChange("district", text)}
            onBlur={() => handleBlur("district")}
            error={touched.district ? errors.district : undefined}
          />

          {/* State Dropdown */}
          <View style={styles.inputGroup}>
            <Text
              style={[styles.label, { color: theme.colors.neutral.gray900 }]}
            >
              State
            </Text>
            <TouchableOpacity
              style={[
                styles.selectButton,
                {
                  borderColor: theme.colors.neutral.gray300,
                  backgroundColor: theme.colors.neutral.white,
                },
              ]}
              onPress={() => setShowStateDropdown(!showStateDropdown)}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  {
                    color: values.state
                      ? theme.colors.neutral.gray900
                      : theme.colors.neutral.gray400,
                  },
                ]}
              >
                {values.state || "2"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={theme.colors.neutral.gray500}
              />
            </TouchableOpacity>
            {renderDropdown(
              stateOptions,
              values.state,
              (value) => handleChange("state", value),
              showStateDropdown,
              () => setShowStateDropdown(false)
            )}
            {touched.state && errors.state && (
              <Text
                style={[
                  styles.errorText,
                  { color: theme.colors.feedback.error },
                ]}
              >
                {errors.state}
              </Text>
            )}
          </View>

          {/* Country Dropdown */}
          <View style={styles.inputGroup}>
            <Text
              style={[styles.label, { color: theme.colors.neutral.gray900 }]}
            >
              Country
            </Text>
            <TouchableOpacity
              style={[
                styles.selectButton,
                {
                  borderColor: theme.colors.neutral.gray300,
                  backgroundColor: theme.colors.neutral.white,
                },
              ]}
              onPress={() => setShowCountryDropdown(!showCountryDropdown)}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  {
                    color: values.country
                      ? theme.colors.neutral.gray900
                      : theme.colors.neutral.gray400,
                  },
                ]}
              >
                {values.country || "2"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={theme.colors.neutral.gray500}
              />
            </TouchableOpacity>
            {renderDropdown(
              countryOptions,
              values.country,
              (value) => handleChange("country", value),
              showCountryDropdown,
              () => setShowCountryDropdown(false)
            )}
            {touched.country && errors.country && (
              <Text
                style={[
                  styles.errorText,
                  { color: theme.colors.feedback.error },
                ]}
              >
                {errors.country}
              </Text>
            )}
          </View>

          <TextInput
            label="Email Address"
            placeholder="eg. London"
            value={values.emailAddress}
            onChangeText={(text) => handleChange("emailAddress", text)}
            onBlur={() => handleBlur("emailAddress")}
            error={touched.emailAddress ? errors.emailAddress : undefined}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Mobile Number"
            placeholder="eg. London"
            value={values.mobileNumber}
            onChangeText={(text) => handleChange("mobileNumber", text)}
            onBlur={() => handleBlur("mobileNumber")}
            error={touched.mobileNumber ? errors.mobileNumber : undefined}
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
            placeholder="eg. London"
            value={values.nomineeName}
            onChangeText={(text) => handleChange("nomineeName", text)}
            onBlur={() => handleBlur("nomineeName")}
            error={touched.nomineeName ? errors.nomineeName : undefined}
          />

          {/* Relationship Dropdown */}
          <View style={styles.inputGroup}>
            <Text
              style={[styles.label, { color: theme.colors.neutral.gray900 }]}
            >
              Relationship With Nominee
            </Text>
            <TouchableOpacity
              style={[
                styles.selectButton,
                {
                  borderColor: theme.colors.neutral.gray300,
                  backgroundColor: theme.colors.neutral.white,
                },
              ]}
              onPress={() =>
                setShowRelationshipDropdown(!showRelationshipDropdown)
              }
            >
              <Text
                style={[
                  styles.selectButtonText,
                  {
                    color: values.relationshipWithNominee
                      ? theme.colors.neutral.gray900
                      : theme.colors.neutral.gray400,
                  },
                ]}
              >
                {values.relationshipWithNominee || "2"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={theme.colors.neutral.gray500}
              />
            </TouchableOpacity>
            {renderDropdown(
              relationshipOptions,
              values.relationshipWithNominee,
              (value) => handleChange("relationshipWithNominee", value),
              showRelationshipDropdown,
              () => setShowRelationshipDropdown(false)
            )}
            {touched.relationshipWithNominee &&
              errors.relationshipWithNominee && (
                <Text
                  style={[
                    styles.errorText,
                    { color: theme.colors.feedback.error },
                  ]}
                >
                  {errors.relationshipWithNominee}
                </Text>
              )}
          </View>
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
            placeholder="eg. London"
            value={values.emergencyContactName}
            onChangeText={(text) => handleChange("emergencyContactName", text)}
            onBlur={() => handleBlur("emergencyContactName")}
            error={
              touched.emergencyContactName
                ? errors.emergencyContactName
                : undefined
            }
          />

          <TextInput
            label="Mobile Number"
            placeholder="eg. London"
            value={values.emergencyMobileNumber}
            onChangeText={(text) => handleChange("emergencyMobileNumber", text)}
            onBlur={() => handleBlur("emergencyMobileNumber")}
            error={
              touched.emergencyMobileNumber
                ? errors.emergencyMobileNumber
                : undefined
            }
            keyboardType="phone-pad"
          />

          <TextInput
            label="Email Address"
            placeholder="eg. London"
            value={values.emergencyEmailAddress}
            onChangeText={(text) => handleChange("emergencyEmailAddress", text)}
            onBlur={() => handleBlur("emergencyEmailAddress")}
            error={
              touched.emergencyEmailAddress
                ? errors.emergencyEmailAddress
                : undefined
            }
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
            placeholder="eg. London"
            value={values.remark}
            onChangeText={(text) => handleChange("remark", text)}
            onBlur={() => handleBlur("remark")}
            error={touched.remark ? errors.remark : undefined}
            multiline
            numberOfLines={3}
          />

          <TextInput
            label="CR Reference Number"
            placeholder="eg. London"
            value={values.crReferenceNumber}
            onChangeText={(text) => handleChange("crReferenceNumber", text)}
            onBlur={() => handleBlur("crReferenceNumber")}
            error={
              touched.crReferenceNumber ? errors.crReferenceNumber : undefined
            }
          />

          <TextInput
            label="Past Illness"
            placeholder="eg. London"
            value={values.pastIllness}
            onChangeText={(text) => handleChange("pastIllness", text)}
            onBlur={() => handleBlur("pastIllness")}
            error={touched.pastIllness ? errors.pastIllness : undefined}
            multiline
            numberOfLines={3}
          />

          <TextInput
            label="GST Number"
            placeholder="eg. London"
            value={values.gstNumber}
            onChangeText={(text) => handleChange("gstNumber", text)}
            onBlur={() => handleBlur("gstNumber")}
            error={touched.gstNumber ? errors.gstNumber : undefined}
          />

          {/* GST State Dropdown */}
          <View style={styles.inputGroup}>
            <Text
              style={[styles.label, { color: theme.colors.neutral.gray900 }]}
            >
              GST State
            </Text>
            <TouchableOpacity
              style={[
                styles.selectButton,
                {
                  borderColor: theme.colors.neutral.gray300,
                  backgroundColor: theme.colors.neutral.white,
                },
              ]}
              onPress={() => setShowGstStateDropdown(!showGstStateDropdown)}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  {
                    color: values.gstState
                      ? theme.colors.neutral.gray900
                      : theme.colors.neutral.gray400,
                  },
                ]}
              >
                {values.gstState || "2"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={theme.colors.neutral.gray500}
              />
            </TouchableOpacity>
            {renderDropdown(
              stateOptions,
              values.gstState,
              (value) => handleChange("gstState", value),
              showGstStateDropdown,
              () => setShowGstStateDropdown(false)
            )}
          </View>
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
          onPress={() => {
            router.push({
              pathname: "/(createPolicy)/select-policy",
              params: {
                travellerNumber: travellerNumber,
              },
            });
          }} //{handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
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
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectButtonText: {
    fontSize: 16,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    maxHeight: 200,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownScroll: {
    flex: 1,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownItemText: {
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
  errorText: {
    fontSize: 12,
    marginTop: 4,
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
