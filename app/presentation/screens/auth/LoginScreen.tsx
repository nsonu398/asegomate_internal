// app/presentation/screens/auth/LoginScreen.tsx
import { Button } from '@/app/presentation/components/ui/Button';
import { TextInput } from '@/app/presentation/components/ui/TextInput';
import { useAuth } from '@/app/presentation/contexts/AuthContext';
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import { useForm } from '@/app/presentation/hooks/useForm';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface LoginFormValues {
  email: string;
  password: string;
}

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email';
  return undefined;
};

const validatePassword = (password: string) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return undefined;
};

export const LoginScreen: React.FC = () => {
  const { login, error, clearError } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
      email: '',
      password: '',
    },
    validations: {
      email: validateEmail,
      password: validatePassword,
    },
    onSubmit: async (formValues) => {
      try {
        await login(formValues.email, formValues.password);
        // Navigation is handled in the auth context
      } catch (err) {
        Alert.alert('Login Failed', 'Please check your credentials and try again.');
      }
    },
  });

  // Clear auth error when user starts typing
  React.useEffect(() => {
    if (error) {
      clearError();
    }
  }, [values.email, values.password]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary.main }]}>
              <Text style={[styles.logoText, { color: theme.colors.neutral.white }]}>A</Text>
            </View>
            <Text style={[styles.appName, { color: theme.colors.neutral.gray800 }]}>
              AsegoMate
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.neutral.gray600 }]}>
              Travel with confidence
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={[styles.welcomeText, { color: theme.colors.neutral.gray800 }]}>
              Welcome back
            </Text>
            <Text style={[styles.instructionText, { color: theme.colors.neutral.gray600 }]}>
              Sign in to continue to your account
            </Text>

            {error && (
              <View style={[styles.errorContainer, { backgroundColor: theme.colors.error.light }]}>
                <Text style={[styles.errorText, { color: theme.colors.error.main }]}>
                  {error}
                </Text>
              </View>
            )}

            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={values.email}
              onChangeText={(text) => handleChange('email', text)}
              onBlur={() => handleBlur('email')}
              error={touched.email ? errors.email : undefined}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
              startIcon={
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={theme.colors.neutral.gray500}
                />
              }
            />

            <TextInput
              label="Password"
              placeholder="Enter your password"
              value={values.password}
              onChangeText={(text) => handleChange('password', text)}
              onBlur={() => handleBlur('password')}
              error={touched.password ? errors.password : undefined}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
              startIcon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.colors.neutral.gray500}
                />
              }
              endIcon={
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.colors.neutral.gray500}
                />
              }
              onEndIconPress={() => setShowPassword(!showPassword)}
            />


            <Button
              title="Sign In"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              fullWidth
              size="large"
              style={styles.loginButton}
            />

            {/* Demo credentials info */}
            <View style={[styles.demoInfo, { backgroundColor: theme.colors.neutral.gray100 }]}>
              <Text style={[styles.demoText, { color: theme.colors.neutral.gray600 }]}>
                Demo credentials:
              </Text>
              <Text style={[styles.demoCredentials, { color: theme.colors.neutral.gray700 }]}>
                Email: demo@asegomate.com
              </Text>
              <Text style={[styles.demoCredentials, { color: theme.colors.neutral.gray700 }]}>
                Password: demo123
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  formSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 32,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 24,
  },
  demoInfo: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  demoText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  demoCredentials: {
    fontSize: 14,
    marginBottom: 4,
  },
});