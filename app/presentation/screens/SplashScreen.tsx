// app/presentation/screens/SplashScreen.tsx
import { useAuth } from '@/app/presentation/contexts/AuthContext';
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { height } = Dimensions.get('window');

export const SplashScreen: React.FC = () => {
  const { isLoading, user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Navigate after auth state is determined
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (user) {
          router.replace('/home');
        } else {
          router.replace('/presentation/screens/auth/login');
        }
      }, 2000); // 2 second delay for splash screen

      return () => clearTimeout(timer);
    }
  }, [isLoading, user, router]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary.main }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim },
            ],
          },
        ]}
      >
        {/* Logo placeholder - replace with actual logo */}
        <View style={[styles.logoContainer, { backgroundColor: theme.colors.neutral.white }]}>
          <Text style={[styles.logoText, { color: theme.colors.primary.main }]}>A</Text>
        </View>

        <Animated.Text
          style={[
            styles.appName,
            {
              color: theme.colors.neutral.white,
              opacity: fadeAnim,
            },
          ]}
        >
          AsegoMate
        </Animated.Text>

        <Animated.Text
          style={[
            styles.tagline,
            {
              color: theme.colors.neutral.white,
              opacity: fadeAnim,
            },
          ]}
        >
          Your Travel Insurance Companion
        </Animated.Text>

        <Animated.View
          style={[
            styles.loaderContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <ActivityIndicator
            size="large"
            color={theme.colors.neutral.white}
          />
        </Animated.View>
      </Animated.View>

      {/* Bottom wave decoration */}
      <View style={styles.bottomDecoration}>
        <View style={[styles.wave, { backgroundColor: theme.colors.primary.light }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoText: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    marginBottom: 48,
    opacity: 0.9,
  },
  loaderContainer: {
    marginTop: 24,
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.15,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    bottom: -20,
    left: -50,
    right: -50,
    height: 120,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    transform: [{ scaleX: 1.5 }],
    opacity: 0.3,
  },
});