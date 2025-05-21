// app/presentation/screens/auth/ForgotPasswordScreen.tsx
import { Button } from '@/app/presentation/components/ui/Button';
import { TextInput } from '@/app/presentation/components/ui/TextInput';
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import { useForm } from '@/app/presentation/hooks/useForm';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface ForgotPasswordFormValues {
  email: string;
}

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email';
  return undefined;
};

export const ForgotPasswordScreen: React.FC = () => {
  const { theme } = useTheme();

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<ForgotPasswordFormValues>({
    initialValues: {
      email: '',
    },
    validations: {
      email: validateEmail,
    },
    onSubmit: async (formValues) => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        Alert.alert(
          'Success', 
          'Password reset link has been sent to your email address.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } catch (err) {
        Alert.alert('Error', 'Failed to send reset link. Please try again.');
      }
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.neutral.background }]}>
      <StatusBar backgroundColor={theme.colors.neutral.background} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.neutral.gray900} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/icon-asego-logo-text.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Form Content */}
          <View style={styles.formContainer}>
            <Text style={[styles.title, { color: theme.colors.neutral.gray900 }]}>
              Forgot password
            </Text>

            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: theme.colors.neutral.gray900 }]}>
                Email address
              </Text>
              <TextInput
                placeholder="eg. sakshishah@asego.com"
                value={values.email}
                onChangeText={(text) => handleChange('email', text)}
                onBlur={() => handleBlur('email')}
                error={touched.email ? errors.email : undefined}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
                style={styles.input}
              />
            </View>

            <Button
              title="Send link"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              fullWidth
              size="large"
              style={[styles.submitButton, { backgroundColor: theme.colors.primary.main }]}
            />
          </View>

          {/* Footer Section */}
          <View style={styles.footer}>
            <Text style={[styles.trustedBy, { color: theme.colors.neutral.gray600 }]}>
              Trusted by <Text style={[styles.highlight, { color: theme.colors.secondary.main }]}>18K+</Text> Travel Trade Partners and <Text style={[styles.highlight, { color: theme.colors.secondary.main }]}>3M+</Text> Travellers
            </Text>
            
            {/* Partner Logos */}
            <View style={styles.partnersContainer}>
              <Text style={[styles.partnerLogo, { color: theme.colors.primary.main }]}>Reliance Louvre</Text>
              <Text style={[styles.partnerLogo, { color: '#3F51B5' }]}>IndiGo</Text>
              <Text style={[styles.partnerLogo, { color: theme.colors.secondary.main }]}>tbo.com</Text>
              <Text style={[styles.partnerLogo, { color: theme.colors.neutral.gray500 }]}>Uniglobe</Text>
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 20 : 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 180,
    height: 60,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '400',
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  inputWrapper: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
  },
  submitButton: {
    borderRadius: 12,
    height: 52,
    position:'absolute',
    bottom:2
  },
  footer: {
    paddingVertical: 20,
    marginTop: 20,
  },
  trustedBy: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  highlight: {
    fontWeight: '700',
  },
  partnersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  partnerLogo: {
    fontSize: 16,
    fontWeight: '600',
  },
});