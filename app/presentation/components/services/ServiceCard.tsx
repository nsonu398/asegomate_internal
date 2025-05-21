// app/presentation/components/services/ServiceCard.tsx
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ServiceCardProps {
  title: string;
  subtitle: string;
  options: string[];
  backgroundColor: string;
  iconColor: string;
  iconName: keyof typeof Ionicons.glyphMap;
  arrowDirection?: 'top-right';
  route: string;
  onPress?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  subtitle,
  options,
  backgroundColor,
  iconColor,
  iconName,
  arrowDirection,
  route,
  onPress
}) => {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();

  const handlePress = () => {
    if(onPress){
      onPress();
    }
  };

  // Adjust background color opacity for dark mode
  const getCardBackgroundColor = () => {
    return isDarkMode ? backgroundColor + '60' : backgroundColor;
  };

  const getOptionPillBackgroundColor = () => {
    return isDarkMode ? theme.colors.neutral.gray600 : theme.colors.neutral.white;
  };

  const getOptionTextColor = () => {
    return isDarkMode ? theme.colors.neutral.white : theme.colors.neutral.gray900;
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: getCardBackgroundColor() }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.textContent}>
          <Text style={[styles.title, { color: theme.colors.neutral.gray900 }]}>{title} {title === 'Create Policy' && '✍️'}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.neutral.gray700 }]}>{subtitle}</Text>
          
          {options.length > 0 && (
            <View style={styles.optionsContainer}>
              {options.map((option, index) => (
                <View key={index} style={[styles.optionPill, { backgroundColor: getOptionPillBackgroundColor() }]}>
                  <Text style={[styles.optionText, { color: getOptionTextColor() }]}>{option}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.illustration}>
          {title === 'Create Policy' && (
            <Image
              source={require('@/assets/images/icon-create-policy.png')}
              style={{...styles.illustrationImage, position:'absolute', bottom:-34.5, height:"115%", width:"115%"}}
              resizeMode="contain"
            />
          )}
          {title === 'Search Policy' && (
            <Image
              source={require('@/assets/images/icon-search-policy.png')}
              style={{...styles.illustrationImage, height:"80%", position:'absolute', bottom: -20}}
              resizeMode="contain"
            />
          )}
          {title === 'Endorse Policy' && (
            <Image
              source={require('@/assets/images/icon-endorse-policy.png')}
              style={{...styles.illustrationImage, position:"absolute", bottom:-20, right:-5}}
              resizeMode="contain"
            />
          )}
        </View>
      </View>

      {arrowDirection && (
        <View style={[styles.arrowContainer, { backgroundColor: theme.colors.neutral.white }]}>
          <Ionicons name="arrow-forward" size={20} color={theme.colors.neutral.gray500} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    height: 170,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    marginRight: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13.5,
    marginBottom: 16,
    lineHeight: 22,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  optionPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  illustration: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-45deg' }],
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});