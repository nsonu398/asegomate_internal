// app/presentation/screens/createPolicy/TravellerSelectionScreen.tsx
import { Button } from '@/app/presentation/components/ui/Button';
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Traveller {
  id: string;
  name: string;
  isCompleted: boolean;
  isPrimary: boolean;
}

interface TravellerSelectionScreenProps {
  numberOfTravellers?: number;
}

export const TravellerSelectionScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const numberOfTravellers = parseInt(params.numberOfTravellers as string) || 2;
  
  // Initialize travellers list based on number selected
  const [travellers, setTravellers] = useState<Traveller[]>(() => {
    const travellersList: Traveller[] = [];
    for (let i = 0; i < numberOfTravellers; i++) {
      travellersList.push({
        id: `traveller_${i + 1}`,
        name: i === 0 ? 'Sakshi Shah' : `Traveller ${i + 1} Details`,
        isCompleted: i === 0, // First traveller is completed by default
        isPrimary: i === 0, // First traveller is primary
      });
    }
    return travellersList;
  });

  const [totalPrice] = useState(3788);

  const handleTravellerPress = (travellerId: string) => {
    //Navigate to traveller details form
    router.push({
      pathname: '/(createPolicy)/traveller-details',
      params: { 
        travellerId,
        numberOfTravellers: numberOfTravellers.toString()
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    // Check if all travellers are completed
    const allCompleted = travellers.every(traveller => traveller.isCompleted);
    if (allCompleted) {
      // Navigate to next step (policy selection, payment, etc.)
      //router.push('/(createPolicy)/traveller-selection');
    }
  };

  const getTravellerIcon = (traveller: Traveller) => {
    return (
      <View style={[
        styles.travellerIcon, 
        { 
          backgroundColor: traveller.isPrimary 
            ? theme.colors.primary.main + '20' 
            : theme.colors.neutral.gray200 
        }
      ]}>
        <Ionicons 
          name="person" 
          size={20} 
          color={traveller.isPrimary ? theme.colors.primary.main : theme.colors.neutral.gray500} 
        />
      </View>
    );
  };

  const getCardBackgroundColor = () => {
    return isDarkMode ? theme.colors.neutral.gray300 : theme.colors.neutral.white;
  };

  const getBorderColor = () => {
    return isDarkMode ? theme.colors.neutral.gray400 : theme.colors.neutral.gray200;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.neutral.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.neutral.background} 
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.neutral.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.neutral.gray900} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.neutral.gray900 }]}>
          Traveller Details
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Travellers List */}
        <View style={styles.travellersContainer}>
          {travellers.map((traveller, index) => (
            <TouchableOpacity
              key={traveller.id}
              style={[
                styles.travellerCard,
                {
                  backgroundColor: getCardBackgroundColor(),
                  borderColor: getBorderColor(),
                }
              ]}
              onPress={() => handleTravellerPress(traveller.id)}
              activeOpacity={0.7}
            >
              <View style={styles.travellerCardContent}>
                <View style={styles.travellerInfo}>
                  {getTravellerIcon(traveller)}
                  <Text style={[
                    styles.travellerName, 
                    { color: theme.colors.neutral.gray900 }
                  ]}>
                    {traveller.name}
                  </Text>
                </View>
                
                <View style={styles.travellerActions}>
                  {traveller.isCompleted && (
                    <View style={[styles.editButton, { backgroundColor: theme.colors.neutral.gray200 }]}>
                      <Ionicons name="pencil" size={16} color={theme.colors.neutral.gray600} />
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
          ))}
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={[styles.bottomSection, { backgroundColor: theme.colors.neutral.background }]}>
        {/* Summary */}
        <View style={styles.summaryContainer}>
          <TouchableOpacity style={styles.summaryHeader}>
            <Text style={[styles.summaryTitle, { color: theme.colors.neutral.gray600 }]}>
              SUMMARY
            </Text>
            <Ionicons 
              name="chevron-down" 
              size={20} 
              color={theme.colors.neutral.gray600} 
            />
          </TouchableOpacity>
          <Text style={[styles.summaryPrice, { color: theme.colors.neutral.gray900 }]}>
            ₹{totalPrice.toLocaleString()}
          </Text>
        </View>

        {/* Continue Button */}
        <Button
          title="Continue"
          onPress={handleContinue}
          fullWidth
          size="large"
          style={[
            styles.continueButton, 
            { 
              backgroundColor: travellers.every(t => t.isCompleted) 
                ? theme.colors.primary.main 
                : theme.colors.neutral.gray400 
            }
          ]}
          disabled={!travellers.every(t => t.isCompleted)}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 24,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
    height: 40,
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
    borderWidth: 1,
    overflow: 'hidden',
  },
  travellerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  travellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  travellerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  travellerName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  travellerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  summaryContainer: {
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginRight: 8,
  },
  summaryPrice: {
    fontSize: 32,
    fontWeight: '700',
  },
  continueButton: {
    borderRadius: 12,
    height: 52,
  },
});