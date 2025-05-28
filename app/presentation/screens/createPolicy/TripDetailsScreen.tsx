// app/presentation/screens/createPolicy/TripDetailsScreen.tsx
import { Button } from '@/app/presentation/components/ui/Button';
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface TripDetailsScreenProps {
  selectedDestination?: string;
  onDestinationChange?: (destination: string) => void;
}

const tripTypes = ['Single Trip', 'Multi Trip', 'Student', 'Special'];

export const TripDetailsScreen: React.FC<TripDetailsScreenProps> = ({
  selectedDestination,
  onDestinationChange,
}) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme, isDarkMode } = useTheme();
  
  const [selectedTripType, setSelectedTripType] = useState('Single Trip');
  const [tripDays, setTripDays] = useState(1);
  const [tripDuration, setTripDuration] = useState<'180' | '365'>('180');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [numberOfTravellers, setNumberOfTravellers] = useState<number>(1);

  // Handle date selection from calendar screen
  useEffect(() => {
    if (params.selectedStartDate) {
      setStartDate(params.selectedStartDate as string);
      // Clear the parameter to avoid issues on re-render
      router.setParams({ selectedStartDate: undefined });
    }
    if (params.selectedEndDate) {
      setEndDate(params.selectedEndDate as string);
      // Clear the parameter to avoid issues on re-render
      router.setParams({ selectedEndDate: undefined });
    }
  }, [params.selectedStartDate, params.selectedEndDate]);

  // Auto-calculate trip days when both dates are selected
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTripDays(diffDays);
    }
  }, [startDate, endDate]);

  const incrementDays = () => setTripDays(prev => prev + 1);
  const decrementDays = () => setTripDays(prev => Math.max(1, prev - 1));

  const handleDestinationPress = () => {
    router.push({
      pathname: '/(createPolicy)/search-destination',
      params: { selectedDestination }
    });
  };

  const handleStartDatePress = () => {
    router.push({
      pathname: '/(createPolicy)/calendar',
      params: { 
        dateType: 'start',
        selectedDate: startDate
      }
    });
  };

  const handleEndDatePress = () => {
    router.push({
      pathname: '/(createPolicy)/calendar',
      params: { 
        dateType: 'end',
        selectedDate: endDate,
        startDate: startDate // Pass start date for validation
      }
    });
  };

  const handleGetQuote = () => {
    // Navigate to traveller selection screen with number of travellers
    router.push({
      pathname: '/(createPolicy)/traveller-selection',
      params: { 
        numberOfTravellers: numberOfTravellers.toString()
      }
    });
  };

  const handleTravellersPress = () => {
    // For now, we'll use a simple prompt or modal to select number
    // In a real app, you might want a dedicated picker screen
    // For demonstration, let's cycle through 1-5 travellers
    setNumberOfTravellers(prev => prev < 5 ? prev + 1 : 1);
  };

  const handleBack = () => {
    router.back();
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
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
        <Text style={[styles.headerTitle, { color: theme.colors.neutral.gray900 }]}>Trip Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Trip Type Selector */}
        <View style={styles.tripTypeContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tripTypeScroll}
          >
            {tripTypes.map((type) => {
              const isSelected = selectedTripType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.tripTypePill,
                    {
                      backgroundColor: isSelected 
                        ? theme.colors.primary.main + '20' 
                        : theme.colors.neutral.gray200,
                      borderColor: isSelected 
                        ? theme.colors.primary.main 
                        : theme.colors.neutral.gray300,
                    }
                  ]}
                  onPress={() => setSelectedTripType(type)}
                >
                  <Text
                    style={[
                      styles.tripTypeText,
                      {
                        color: isSelected 
                          ? theme.colors.primary.main 
                          : theme.colors.neutral.gray500
                      }
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Region */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.colors.neutral.gray500 }]}>REGION</Text>
          <TouchableOpacity style={[
            styles.selectButton,
            {
              backgroundColor: theme.colors.neutral.gray100,
              borderColor: theme.colors.neutral.gray300,
            }
          ]}>
            <View style={styles.selectButtonContent}>
              <MaterialCommunityIcons 
                name="account-outline" 
                size={24} 
                color={theme.colors.neutral.gray500} 
                style={styles.icon} 
              />
              <Text style={[styles.selectButtonText, { color: theme.colors.neutral.gray500 }]}>
                Choose a Region
              </Text>
            </View>
            <Ionicons name="chevron-down" size={24} color={theme.colors.neutral.gray500} />
          </TouchableOpacity>
        </View>

        {/* Destination */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.colors.neutral.gray500 }]}>DESTINATION</Text>
          <TouchableOpacity 
            style={[
              styles.selectButton,
              {
                backgroundColor: theme.colors.neutral.gray100,
                borderColor: theme.colors.neutral.gray300,
              }
            ]} 
            onPress={handleDestinationPress}
          >
            <View style={styles.selectButtonContent}>
              <MaterialCommunityIcons 
                name="airplane-takeoff" 
                size={24} 
                color={theme.colors.neutral.gray500} 
                style={styles.icon} 
              />
              <Text style={[
                styles.selectButtonText,
                {
                  color: selectedDestination 
                    ? theme.colors.neutral.gray900 
                    : theme.colors.neutral.gray500,
                  fontWeight: selectedDestination ? '500' : '400'
                }
              ]}>
                {selectedDestination || 'Choose a Destination'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={24} color={theme.colors.neutral.gray500} />
          </TouchableOpacity>
        </View>

        {/* Trip Duration Options */}
        <View style={styles.durationContainer}>
          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setTripDuration('180')}
          >
            <View style={[
              styles.radioOuter, 
              { 
                borderColor: tripDuration === '180' 
                  ? theme.colors.primary.main 
                  : theme.colors.neutral.gray300 
              }
            ]}>
              {tripDuration === '180' && (
                <View style={[styles.radioInner, { backgroundColor: theme.colors.primary.main }]} />
              )}
            </View>
            <Text style={[styles.radioText, { color: theme.colors.neutral.gray900 }]}>
              Upto 180 Days
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setTripDuration('365')}
          >
            <View style={[
              styles.radioOuter, 
              { 
                borderColor: tripDuration === '365' 
                  ? theme.colors.primary.main 
                  : theme.colors.neutral.gray300 
              }
            ]}>
              {tripDuration === '365' && (
                <View style={[styles.radioInner, { backgroundColor: theme.colors.primary.main }]} />
              )}
            </View>
            <Text style={[styles.radioText, { color: theme.colors.neutral.gray900 }]}>
              365 Days
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Inputs */}
        <View style={styles.dateContainer}>
          <View style={styles.dateSection}>
            <Text style={[styles.sectionLabel, { color: theme.colors.neutral.gray500 }]}>START DATE</Text>
            <TouchableOpacity 
              style={[
                styles.dateButton,
                {
                  backgroundColor: theme.colors.neutral.gray100,
                  borderColor: theme.colors.neutral.gray300,
                }
              ]} 
              onPress={handleStartDatePress}
            >
              <Ionicons 
                name="calendar-outline" 
                size={24} 
                color={theme.colors.neutral.gray500} 
                style={styles.icon} 
              />
              <Text style={[
                styles.dateButtonText,
                {
                  color: startDate 
                    ? theme.colors.neutral.gray900 
                    : theme.colors.neutral.gray500,
                  fontWeight: startDate ? '500' : '400'
                }
              ]}>
                {startDate ? formatDateForDisplay(startDate) : 'Start Date'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateSection}>
            <Text style={[styles.sectionLabel, { color: theme.colors.neutral.gray500 }]}>END DATE</Text>
            <TouchableOpacity 
              style={[
                styles.dateButton,
                {
                  backgroundColor: theme.colors.neutral.gray100,
                  borderColor: theme.colors.neutral.gray300,
                  opacity: !startDate ? 0.5 : 1,
                }
              ]} 
              onPress={handleEndDatePress}
              disabled={!startDate}
            >
              <Ionicons 
                name="calendar-outline" 
                size={24} 
                color={theme.colors.neutral.gray500} 
                style={styles.icon} 
              />
              <Text style={[
                styles.dateButtonText,
                {
                  color: endDate 
                    ? theme.colors.neutral.gray900 
                    : theme.colors.neutral.gray500,
                  fontWeight: endDate ? '500' : '400'
                }
              ]}>
                {endDate ? formatDateForDisplay(endDate) : 'End Date'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Number of Trip Days */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.colors.neutral.gray500 }]}>
            NUMBER OF TRIP DAYS
          </Text>
          <View style={[
            styles.counterContainer,
            {
              backgroundColor: theme.colors.neutral.gray100,
              borderColor: theme.colors.neutral.gray300,
            }
          ]}>
            <View style={styles.counterLeft}>
              <Ionicons 
                name="sunny-outline" 
                size={24} 
                color={theme.colors.neutral.gray500} 
                style={styles.icon} 
              />
              <Text style={[styles.counterText, { color: theme.colors.neutral.gray900 }]}>
                {tripDays}
              </Text>
            </View>
            <View style={styles.counterButtons}>
              <TouchableOpacity 
                style={[
                  styles.counterButton,
                  {
                    backgroundColor: theme.colors.neutral.gray100,
                    borderColor: theme.colors.neutral.gray300,
                  }
                ]}
                onPress={decrementDays}
              >
                <Text style={[styles.counterButtonText, { color: theme.colors.neutral.gray500 }]}>
                  -
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.counterButton,
                  {
                    backgroundColor: theme.colors.neutral.gray100,
                    borderColor: theme.colors.neutral.gray300,
                  }
                ]}
                onPress={incrementDays}
              >
                <Text style={[styles.counterButtonText, { color: theme.colors.neutral.gray500 }]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Number of Travellers */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.colors.neutral.gray500 }]}>
            NUMBER OF TRAVELLERS
          </Text>
          <TouchableOpacity 
            style={[
              styles.selectButton,
              {
                backgroundColor: theme.colors.neutral.gray100,
                borderColor: theme.colors.neutral.gray300,
              }
            ]} 
            onPress={handleTravellersPress}
          >
            <View style={styles.selectButtonContent}>
              <Ionicons 
                name="people-outline" 
                size={24} 
                color={theme.colors.neutral.gray500} 
                style={styles.icon} 
              />
              <Text style={[
                styles.selectButtonText,
                {
                  color: numberOfTravellers > 1 
                    ? theme.colors.neutral.gray900 
                    : theme.colors.neutral.gray500,
                  fontWeight: numberOfTravellers > 1 ? '500' : '400'
                }
              ]}>
                {numberOfTravellers > 1 ? `${numberOfTravellers} Travellers` : 'Choose No. of Travellers'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={24} color={theme.colors.neutral.gray500} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Get Quote Button */}
      <View style={[
        styles.buttonContainer,
        {
          backgroundColor: theme.colors.neutral.gray100,
          borderTopColor: theme.colors.neutral.gray200,
        }
      ]}>
        <Button
          title="Get Quote"
          onPress={handleGetQuote}
          fullWidth
          size="large"
          style={[styles.getQuoteButton, { backgroundColor: theme.colors.primary.main }]}
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
    paddingBottom: 16,
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
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  tripTypeContainer: {
    marginVertical: 24,
  },
  tripTypeScroll: {
    paddingHorizontal: 8,
  },
  tripTypePill: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 6,
    borderWidth: 1,
  },
  tripTypeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  selectButtonText: {
    fontSize: 16,
  },
  durationContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 32,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioText: {
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  dateSection: {
    flex: 1,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  dateButtonText: {
    fontSize: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  counterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 16,
    fontWeight: '600',
  },
  counterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  counterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  counterButtonText: {
    fontSize: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
  },
  getQuoteButton: {
    borderRadius: 12,
    height: 52,
  },
});