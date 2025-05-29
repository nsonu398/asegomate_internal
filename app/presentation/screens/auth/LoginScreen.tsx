// app/presentation/screens/auth/LoginScreen.tsx
import { Button } from "@/app/presentation/components/ui/Button";
import { TextInput } from "@/app/presentation/components/ui/TextInput";
import { useAuth } from "@/app/presentation/contexts/AuthContext";
import { useTheme } from "@/app/presentation/contexts/ThemeContext";
import { useForm } from "@/app/presentation/hooks/useForm";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface LoginFormValues {
  email: string;
  password: string;
}

const { width, height } = Dimensions.get("window");

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email";
  return undefined;
};

const validatePassword = (password: string) => {
  if (!password) return "Password is required";
  if (password.length < 5) return "Password must be at least 6 characters";
  return undefined;
};

export const LoginScreen: React.FC = () => {
  const { login, error, clearError } = useAuth();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validations: {
      email: validateEmail,
      password: validatePassword,
    },
    onSubmit: async (formValues) => {
      try {
        await login(formValues.email, formValues.password);
        router.push("/home");
      } catch (err) {
        Alert.alert(
          "Login Failed",
          "Please check your credentials and try again."
        );
      }
    },
  });

  React.useEffect(() => {
    if (error) {
      clearError();
    }
  }, [values.email, values.password]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.neutral.background }]}>
      <StatusBar
        backgroundColor={theme.colors.primary.main}
        barStyle="light-content"
      />

      {/* Green Header Section */}
      <View
        style={[
          styles.headerSection,
          { backgroundColor: theme.colors.primary.main },
        ]}
      >
        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeTo, { color: theme.colors.neutral.white }]}>Welcome to</Text>
          <Text style={[styles.brandName, { color: theme.colors.neutral.white }]}>ASEGO</Text>
          <Text style={[styles.tagline, { color: theme.colors.neutral.white }]}>
            Global Assistance • Travel Insurance
          </Text>
        </View>
      </View>

      {/* Mascot Image */}
      <View style={styles.mascotContainer}>
        <Image
          source={require("@/assets/images/icon-dolphin.png")} // You'll need to add the mascot image
          style={styles.mascotImage}
          resizeMode="contain"
        />
      </View>

      <KeyboardAvoidingView
        style={styles.formContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Log in header */}
            <Text
              style={[
                styles.loginHeader,
                { color: theme.colors.neutral.gray900 },
              ]}
            >
              Log in
            </Text>

            {/* Error display */}
            {error && (
              <View
                style={[styles.errorContainer, { backgroundColor: theme.colors.feedback.error + '20' }]}
              >
                <Text style={[styles.errorText, { color: theme.colors.feedback.error }]}>
                  {error}
                </Text>
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text
                style={[
                  styles.inputLabel,
                  { color: theme.colors.neutral.gray900 },
                ]}
              >
                Email address
              </Text>
              <TextInput
                placeholder="eg. daniel@demoemail.com"
                value={values.email}
                onChangeText={(text) => handleChange("email", text)}
                onBlur={() => handleBlur("email")}
                error={touched.email ? errors.email : undefined}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
                style={styles.input}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text
                style={[
                  styles.inputLabel,
                  { color: theme.colors.neutral.gray900 },
                ]}
              >
                Password
              </Text>
              <TextInput
                placeholder="••••••••"
                value={values.password}
                onChangeText={(text) => handleChange("password", text)}
                onBlur={() => handleBlur("password")}
                error={touched.password ? errors.password : undefined}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
                style={styles.input}
                endIcon={
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={theme.colors.neutral.gray500}
                  />
                }
                onEndIconPress={() => setShowPassword(!showPassword)}
              />
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => {
                router.push("/forgot-password");
              }}
            >
              <Text
                style={[
                  styles.forgotPasswordText,
                  { color: theme.colors.neutral.gray600 },
                ]}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              title="Log in"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              fullWidth
              size="large"
              style={[
                styles.loginButton,
                { backgroundColor: theme.colors.primary.main },
              ]}
            />
          </View>

          {/* Footer Section */}
          <View style={styles.footer}>
            <Text
              style={[
                styles.trustedBy,
                { color: theme.colors.neutral.gray600 },
              ]}
            >
              Trusted by <Text style={[styles.highlight, { color: theme.colors.secondary.main }]}>18K+</Text> Travel Trade
              Partners and <Text style={[styles.highlight, { color: theme.colors.secondary.main }]}>3M+</Text> Travellers
            </Text>

            {/* Partner Logos */}
            <View style={styles.partnersContainer}>
              <Text style={[styles.partnerLogo, { color: theme.colors.primary.main }]}>
                Reliance Louvre
              </Text>
              <Text style={[styles.partnerLogo, { color: '#3F51B5' }]}>
                IndiGo
              </Text>
              <Text style={[styles.partnerLogo, { color: theme.colors.secondary.main }]}>
                tbo.com
              </Text>
              <Text style={[styles.partnerLogo, { color: theme.colors.neutral.gray500 }]}>
                Uniglobe
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    height: height * 0.28,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24,
    paddingHorizontal: 20,
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  statusBarTime: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusBarIcons: {
    flexDirection: "row",
    gap: 5,
  },
  welcomeContainer: {
    marginTop: 30,
  },
  welcomeTo: {
    fontSize: 24,
    fontWeight: "400",
  },
  brandName: {
    fontSize: 48,
    fontWeight: "700",
    marginTop: -5,
  },
  tagline: {
    fontSize: 14,
    marginTop: 5,
  },
  mascotContainer: {
    position: "absolute",
    right: 20,
    top: height * 0.05,
    zIndex: 1,
  },
  mascotImage: {
    width: 180,
    height: 280,
  },
  formContainer: {
    flex: 1,
    marginTop: -30,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  loginHeader: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 15,
    marginTop: 25,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
  },
  inputWrapper: {
    marginBottom: 7,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 12,
    height: 52,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    marginTop: 40,
  },
  trustedBy: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  highlight: {
    fontWeight: "700",
  },
  partnersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  partnerLogo: {
    fontSize: 16,
    fontWeight: "600",
  },
});