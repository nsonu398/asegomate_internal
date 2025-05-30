// app/presentation/screens/createPolicy/TripDetailsScreen.tsx
import { Button } from '@/app/presentation/components/ui/Button';
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import { useTripDetails } from '@/app/presentation/contexts/TripDetailsContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const tripTypes = ['Single Trip', 'Multi Trip', 'Student', 'Special'] as const;

export const TripDetailsScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme, isDarkMode } = useTheme();
  
  // Use the TripDetails context
  const {
    tripDetails,
    validationErrors,
    isLoading,
    error,
    canProceed,
    
    // Actions
    setTripType,
    setDestination,
    setTripDuration,
    setStartDate,
    setEndDate,
    setTripDays,
    setNumberOfTravellers,
    
    // Utilities
    validateForm,
    getTripSummary,
    isMinimumRequirementsMet,
    setError,
    clearError,
  } = useTripDetails();

  // Handle date selection from calendar screen
  useEffect(() => {
    if (params.selectedStartDate) {
      setStartDate(params.selectedStartDate as string);
      router.setParams({ selectedStartDate: undefined });
    }
    if (params.selectedEndDate) {
      setEndDate(params.selectedEndDate as string);
      router.setParams({ selectedEndDate: undefined });
    }
  }, [params.selectedStartDate, params.selectedEndDate, setStartDate, setEndDate, router]);

  // Handle destination selection
  useEffect(() => {
    if (params.selectedDestination) {
      const destinationName = params.selectedDestination as string;
      setDestination({
        id: destinationName.toLowerCase(),
        name: destinationName,
        country: destinationName, // You might want to improve this
      });
      router.setParams({ selectedDestination: undefined });
    }
  }, [params.selectedDestination, setDestination, router]);

  const incrementDays = () => setTripDays(tripDetails.tripDays + 1);
  const decrementDays = () => setTripDays(Math.max(1, tripDetails.tripDays - 1));

  const handleDestinationPress = () => {
    router.push({
      pathname: '/(createPolicy)/search-destination',
      params: { selectedDestination: tripDetails.destination?.name || '' }
    });
  };

  const handleStartDatePress = () => {
    router.push({
      pathname: '/(createPolicy)/calendar',
      params: { 
        dateType: 'start',
        selectedDate: tripDetails.startDate
      }
    });
  };

  const handleEndDatePress = () => {
    router.push({
      pathname: '/(createPolicy)/calendar',
      params: { 
        dateType: 'end',
        selectedDate: tripDetails.endDate,
        startDate: tripDetails.startDate
      }
    });
  };

  const handleGetQuote = () => {
    // Clear any previous errors
    clearError();
    
    // Validate form before proceeding
    const isValid = validateForm();
    
    if (!isValid) {
      setError('Please fill in all required fields');
      return;
    }

    // Navigate to traveller selection screen
    router.push({
      pathname: '/(createPolicy)/traveller-selection',
      params: { 
        numberOfTravellers: tripDetails.numberOfTravellers.toString()
      }
    });
  };

  const handleTravellersPress = () => {
    // Cycle through 1-5 travellers for demonstration
    const newCount = tripDetails.numberOfTravellers < 5 ? tripDetails.numberOfTravellers + 1 : 1;
    setNumberOfTravellers(newCount);
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

      {/* Error Display */}
      {error && (
        <View style={[styles.errorContainer, { backgroundColor: theme.colors.feedback.error + '20' }]}>
          <Text style={[styles.errorText, { color: theme.colors.feedback.error }]}>
            {error}
          </Text>
        </View>
      )}

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
              const isSelected = tripDetails.tripType === type;
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
                  onPress={() => setTripType(type)}
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
                borderColor: validationErrors.destination 
                  ? theme.colors.feedback.error 
                  : theme.colors.neutral.gray300,
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
                  color: tripDetails.destination 
                    ? theme.colors.neutral.gray900 
                    : theme.colors.neutral.gray500,
                  fontWeight: tripDetails.destination ? '500' : '400'
                }
              ]}>
                {tripDetails.destination?.name || 'Choose a Destination'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={24} color={theme.colors.neutral.gray500} />
          </TouchableOpacity>
          {validationErrors.destination && (
            <Text style={[styles.validationError, { color: theme.colors.feedback.error }]}>
              {validationErrors.destination}
            </Text>
          )}
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
                borderColor: tripDetails.tripDuration === '180' 
                  ? theme.colors.primary.main 
                  : theme.colors.neutral.gray300 
              }
            ]}>
              {tripDetails.tripDuration === '180' && (
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
                borderColor: tripDetails.tripDuration === '365' 
                  ? theme.colors.primary.main 
                  : theme.colors.neutral.gray300 
              }
            ]}>
              {tripDetails.tripDuration === '365' && (
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
                  borderColor: validationErrors.startDate 
                    ? theme.colors.feedback.error 
                    : theme.colors.neutral.gray300,
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
                  color: tripDetails.startDate 
                    ? theme.colors.neutral.gray900 
                    : theme.colors.neutral.gray500,
                  fontWeight: tripDetails.startDate ? '500' : '400'
                }
              ]}>
                {tripDetails.startDate ? formatDateForDisplay(tripDetails.startDate) : 'Start Date'}
              </Text>
            </TouchableOpacity>
            {validationErrors.startDate && (
              <Text style={[styles.validationError, { color: theme.colors.feedback.error }]}>
                {validationErrors.startDate}
              </Text>
            )}
          </View>

          <View style={styles.dateSection}>
            <Text style={[styles.sectionLabel, { color: theme.colors.neutral.gray500 }]}>END DATE</Text>
            <TouchableOpacity 
              style={[
                styles.dateButton,
                {
                  backgroundColor: theme.colors.neutral.gray100,
                  borderColor: validationErrors.endDate 
                    ? theme.colors.feedback.error 
                    : theme.colors.neutral.gray300,
                  opacity: !tripDetails.startDate ? 0.5 : 1,
                }
              ]} 
              onPress={handleEndDatePress}
              disabled={!tripDetails.startDate}
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
                  color: tripDetails.endDate 
                    ? theme.colors.neutral.gray900 
                    : theme.colors.neutral.gray500,
                  fontWeight: tripDetails.endDate ? '500' : '400'
                }
              ]}>
                {tripDetails.endDate ? formatDateForDisplay(tripDetails.endDate) : 'End Date'}
              </Text>
            </TouchableOpacity>
            {validationErrors.endDate && (
              <Text style={[styles.validationError, { color: theme.colors.feedback.error }]}>
                {validationErrors.endDate}
              </Text>
            )}
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
                {tripDetails.tripDays}
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
                borderColor: validationErrors.numberOfTravellers 
                  ? theme.colors.feedback.error 
                  : theme.colors.neutral.gray300,
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
                  color: tripDetails.numberOfTravellers > 0 
                    ? theme.colors.neutral.gray900 
                    : theme.colors.neutral.gray500,
                  fontWeight: tripDetails.numberOfTravellers > 0 ? '500' : '400'
                }
              ]}>
                {tripDetails.numberOfTravellers > 0 
                  ? `${tripDetails.numberOfTravellers} Traveller${tripDetails.numberOfTravellers > 1 ? 's' : ''}` 
                  : 'Choose No. of Travellers'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={24} color={theme.colors.neutral.gray500} />
          </TouchableOpacity>
          {validationErrors.numberOfTravellers && (
            <Text style={[styles.validationError, { color: theme.colors.feedback.error }]}>
              {validationErrors.numberOfTravellers}
            </Text>
          )}
        </View>

        {/* Trip Summary (if minimum requirements are met) */}
        {isMinimumRequirementsMet() && (
          <View style={[styles.summaryContainer, { backgroundColor: theme.colors.primary.main + '10' }]}>
            <Text style={[styles.summaryTitle, { color: theme.colors.primary.main }]}>
              Trip Summary
            </Text>
            <Text style={[styles.summaryText, { color: theme.colors.neutral.gray900 }]}>
              {getTripSummary()}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Get Quote Button */}
      <View style={[
        styles.buttonContainer,
        {
          backgroundColor: theme.colors.neutral.background,
          borderTopColor: theme.colors.neutral.gray200,
        }
      ]}>
        <Button
          title="Get Quote"
          onPress={handleGetQuote}
          loading={isLoading}
          disabled={isLoading || !isMinimumRequirementsMet()}
          fullWidth
          size="large"
          style={[
            styles.getQuoteButton, 
            { 
              backgroundColor: isMinimumRequirementsMet() 
                ? theme.colors.primary.main 
                : theme.colors.neutral.gray400 
            }
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
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
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
  validationError: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
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
  summaryContainer: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '500',
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