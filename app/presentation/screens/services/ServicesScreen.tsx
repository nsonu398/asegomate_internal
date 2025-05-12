// app/presentation/screens/services/ServicesScreen.tsx
import { ServiceCard } from '@/app/presentation/components/services/ServiceCard';
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import React from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface ServicesScreenProps {
  onNavigate?: (route: string) => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();

  const services = [
    {
      id: '1',
      title: 'Create Policy',
      subtitle: 'Generate travel assistance & insurance in a few steps',
      options: ['Policy', 'VAS Product'],
      backgroundColor: '#E6F7FF',
      iconColor: '#00B5AD',
      iconName: 'document-text-outline' as const,
      arrowDirection: undefined,
      route: '/create-policy',
    },
    {
      id: '2',
      title: 'Search Policy',
      subtitle: 'Easily find the policies you are looking for.',
      options: [],
      backgroundColor: '#FFE9E6',
      iconColor: '#757575',
      iconName: 'search-outline' as const,
      arrowDirection: 'top-right' as const,
      route: '/search-policy',
    },
    {
      id: '3',
      title: 'Endorse Policy',
      subtitle: 'Make policy amendments on-the-go',
      options: [],
      backgroundColor: '#E0FFFE',
      iconColor: '#00B5AD',
      iconName: 'create-outline' as const,
      arrowDirection: 'top-right' as const,
      route: '/endorse-policy',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.neutral.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Travel Assistance</Text>
        <Text style={styles.headerTitle}>& Insurance</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {services.map((service) => (
          <ServiceCard 
            key={service.id} 
            {...service} 
            onPress={() => {
              if (onNavigate && service.route === '/create-policy') {
                onNavigate('create-policy');
              }
            }}
          />
        ))}

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.iconContainer}>
            <View style={styles.umbrellaIcon}>
              <Text style={styles.umbrellaEmoji}>☂️</Text>
            </View>
          </View>
          
          <Text style={styles.bottomText}>
            Pick up where you left off the search.{' '}
            <Text style={styles.findText}>Find</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight || 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    alignItems:'center'
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#000',
    lineHeight: 29,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor:'#FFFFFF'
  },
  bottomSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  umbrellaIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#E6F7FF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  umbrellaEmoji: {
    fontSize: 30,
  },
  bottomText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  findText: {
    color: '#00B5AD',
    textDecorationLine: 'underline',
  },
});