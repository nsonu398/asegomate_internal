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
  const { theme } = useTheme();
  
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
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
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
                    isSelected && styles.selectedTripTypePill,
                  ]}
                  onPress={() => setSelectedTripType(type)}
                >
                  <Text
                    style={[
                      styles.tripTypeText,
                      isSelected && styles.selectedTripTypeText,
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
          <Text style={styles.sectionLabel}>REGION</Text>
          <TouchableOpacity style={styles.selectButton}>
            <View style={styles.selectButtonContent}>
              <MaterialCommunityIcons name="account-outline" size={24} color="#9E9E9E" style={styles.icon} />
              <Text style={styles.selectButtonText}>Choose a Region</Text>
            </View>
            <Ionicons name="chevron-down" size={24} color="#9E9E9E" />
          </TouchableOpacity>
        </View>

        {/* Destination */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DESTINATION</Text>
          <TouchableOpacity style={styles.selectButton} onPress={handleDestinationPress}>
            <View style={styles.selectButtonContent}>
              <MaterialCommunityIcons name="airplane-takeoff" size={24} color="#9E9E9E" style={styles.icon} />
              <Text style={[
                styles.selectButtonText,
                selectedDestination && styles.selectedText
              ]}>
                {selectedDestination || 'Choose a Destination'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={24} color="#9E9E9E" />
          </TouchableOpacity>
        </View>

        {/* Trip Duration Options */}
        <View style={styles.durationContainer}>
          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setTripDuration('180')}
          >
            <View style={[styles.radioOuter, tripDuration === '180' && styles.radioOuterSelected]}>
              {tripDuration === '180' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioText}>Upto 180 Days</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setTripDuration('365')}
          >
            <View style={[styles.radioOuter, tripDuration === '365' && styles.radioOuterSelected]}>
              {tripDuration === '365' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioText}>365 Days</Text>
          </TouchableOpacity>
        </View>

        {/* Date Inputs */}
        <View style={styles.dateContainer}>
          <View style={styles.dateSection}>
            <Text style={styles.sectionLabel}>START DATE</Text>
            <TouchableOpacity style={styles.dateButton} onPress={handleStartDatePress}>
              <Ionicons name="calendar-outline" size={24} color="#9E9E9E" style={styles.icon} />
              <Text style={[
                styles.dateButtonText,
                startDate && { color: theme.colors.neutral.gray900, fontWeight: '500' }
              ]}>
                {startDate ? formatDateForDisplay(startDate) : 'Start Date'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateSection}>
            <Text style={styles.sectionLabel}>END DATE</Text>
            <TouchableOpacity 
              style={[
                styles.dateButton,
                !startDate && styles.disabledButton
              ]} 
              onPress={handleEndDatePress}
              disabled={!startDate}
            >
              <Ionicons name="calendar-outline" size={24} color="#9E9E9E" style={styles.icon} />
              <Text style={[
                styles.dateButtonText,
                endDate && { color: theme.colors.neutral.gray900, fontWeight: '500' }
              ]}>
                {endDate ? formatDateForDisplay(endDate) : 'End Date'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Number of Trip Days */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NUMBER OF TRIP DAYS</Text>
          <View style={styles.counterContainer}>
            <View style={styles.counterLeft}>
              <Ionicons name="sunny-outline" size={24} color="#9E9E9E" style={styles.icon} />
              <Text style={styles.counterText}>{tripDays}</Text>
            </View>
            <View style={styles.counterButtons}>
              <TouchableOpacity 
                style={styles.counterButton}
                onPress={decrementDays}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.counterButton}
                onPress={incrementDays}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Number of Travellers */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NUMBER OF TRAVELLERS</Text>
          <TouchableOpacity style={styles.selectButton} onPress={handleTravellersPress}>
            <View style={styles.selectButtonContent}>
              <Ionicons name="people-outline" size={24} color="#9E9E9E" style={styles.icon} />
              <Text style={[
                styles.selectButtonText,
                numberOfTravellers > 1 && { color: theme.colors.neutral.gray900, fontWeight: '500' }
              ]}>
                {numberOfTravellers > 1 ? `${numberOfTravellers} Travellers` : 'Choose No. of Travellers'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={24} color="#9E9E9E" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Get Quote Button */}
      <View style={styles.buttonContainer}>
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
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
    color: '#000',
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
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  selectedTripTypePill: {
    backgroundColor: '#E0FFFE',
    borderColor: '#00B5AD',
  },
  tripTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9E9E9E',
  },
  selectedTripTypeText: {
    color: '#00B5AD',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9E9E9E',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
    color: '#9E9E9E',
  },
  selectedText: {
    color: '#000',
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
    borderColor: '#E0E0E0',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#00B5AD',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00B5AD',
  },
  radioText: {
    fontSize: 16,
    color: '#000',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  disabledButton: {
    opacity: 0.5,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#9E9E9E',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  counterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 16,
    color: '#000',
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
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  counterButtonText: {
    fontSize: 20,
    color: '#9E9E9E',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  getQuoteButton: {
    borderRadius: 12,
    height: 52,
  },
});