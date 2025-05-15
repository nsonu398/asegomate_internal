// app/presentation/components/createPolicy/TripDetailsForm.tsx
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface TripDetailsFormProps {
  selectedDestination?: string;
  onDestinationChange?: (destination: string) => void;
}

export const TripDetailsScreen: React.FC<TripDetailsFormProps> = ({
  selectedDestination,
  onDestinationChange,
}) => {
  const router = useRouter();
  const [tripDays, setTripDays] = useState(1);
  const [tripDuration, setTripDuration] = useState<'180' | '365'>('180');

  const incrementDays = () => setTripDays(prev => prev + 1);
  const decrementDays = () => setTripDays(prev => Math.max(1, prev - 1));

  const handleDestinationPress = () => {
    router.push({
      pathname: '/(createPolicy)/search-destination',
      params: { selectedDestination }
    });
  };

  return (
    <View style={styles.container}>
      {/* Region */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>REGION</Text>
        <TouchableOpacity style={styles.selectButton}>
          <View style={styles.selectButtonContent}>
            <MaterialCommunityIcons name="account-outline" size={24} color="#757575" style={styles.icon} />
            <Text style={styles.selectButtonText}>Choose a Region</Text>
          </View>
          <Ionicons name="chevron-down" size={24} color="#757575" />
        </TouchableOpacity>
      </View>

      {/* Destination */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>DESTINATION</Text>
        <TouchableOpacity style={styles.selectButton} onPress={handleDestinationPress}>
          <View style={styles.selectButtonContent}>
            <MaterialCommunityIcons name="airplane-takeoff" size={24} color="#757575" style={styles.icon} />
            <Text style={[
              styles.selectButtonText,
              selectedDestination && styles.selectedText
            ]}>
              {selectedDestination || 'Choose a Destination'}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={24} color="#757575" />
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
          <TouchableOpacity style={styles.dateButton}>
            <Ionicons name="calendar-outline" size={24} color="#757575" style={styles.icon} />
            <Text style={styles.dateButtonText}>Start Date</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateSection}>
          <Text style={styles.sectionLabel}>END DATE</Text>
          <TouchableOpacity style={styles.dateButton}>
            <Ionicons name="calendar-outline" size={24} color="#757575" style={styles.icon} />
            <Text style={styles.dateButtonText}>End Date</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Number of Trip Days */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>NUMBER OF TRIP DAYS</Text>
        <View style={styles.counterContainer}>
          <View style={styles.counterLeft}>
            <Ionicons name="sunny-outline" size={24} color="#757575" style={styles.icon} />
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
        <TouchableOpacity style={styles.selectButton}>
          <View style={styles.selectButtonContent}>
            <Ionicons name="people-outline" size={24} color="#757575" style={styles.icon} />
            <Text style={styles.selectButtonText}>Choose No. of Travellers</Text>
          </View>
          <Ionicons name="chevron-down" size={24} color="#757575" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
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
    color: '#757575',
  },
  selectedText: {
    color: '#212121',
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
    color: '#212121',
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
  dateButtonText: {
    fontSize: 16,
    color: '#757575',
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
    color: '#212121',
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
  },
  counterButtonText: {
    fontSize: 20,
    color: '#757575',
  },
});