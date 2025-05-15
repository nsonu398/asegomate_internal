// app/presentation/screens/createPolicy/SearchDestinationScreen.tsx
import { Button } from '@/app/presentation/components/ui/Button';
import { TextInput } from '@/app/presentation/components/ui/TextInput';
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

interface Destination {
  id: string;
  name: string;
  country: string;
  isSelected: boolean;
}

const popularDestinations: Destination[] = [
  { id: '1', name: 'London', country: 'London, United Kingdom', isSelected: true },
  { id: '2', name: 'Delhi', country: 'Delhi, India', isSelected: false },
  { id: '3', name: 'Mumbai', country: 'Mumbai, India', isSelected: false },
  { id: '4', name: 'Chennai', country: 'Chennai, India', isSelected: false },
  { id: '5', name: 'Goa', country: 'Goa, India', isSelected: false },
  { id: '6', name: 'Texas', country: 'Texas, United States Of America', isSelected: false },
];

interface SearchDestinationScreenProps {
  onDestinationSelect?: (destination: Destination) => void;
  selectedDestination?: string;
}

export const SearchDestinationScreen: React.FC<SearchDestinationScreenProps> = ({
  onDestinationSelect,
  selectedDestination,
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>(
    popularDestinations.map(dest => ({
      ...dest,
      isSelected: dest.name === selectedDestination
    }))
  );

  const handleDestinationSelect = (destination: Destination) => {
    setDestinations(prev =>
      prev.map(dest => ({
        ...dest,
        isSelected: dest.id === destination.id,
      }))
    );
  };

  const handleContinue = () => {
    const selectedDest = destinations.find(dest => dest.isSelected);
    if (selectedDest && onDestinationSelect) {
      onDestinationSelect(selectedDest);
    }
    router.back();
  };

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.neutral.background }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Where to?"
            value={searchQuery}
            onChangeText={setSearchQuery}
            startIcon={<Ionicons name="search" size={20} color="#9E9E9E" />}
            style={styles.searchInput}
          />
        </View>

        {/* Popular Destinations */}
        <View style={styles.destinationsContainer}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          
          {filteredDestinations.map((destination) => (
            <TouchableOpacity
              key={destination.id}
              style={styles.destinationItem}
              onPress={() => handleDestinationSelect(destination)}
              activeOpacity={0.7}
            >
              <View style={styles.destinationContent}>
                <View style={styles.destinationInfo}>
                  <View style={styles.locationIcon}>
                    <Ionicons name="location" size={20} color="#00B5AD" />
                  </View>
                  <View style={styles.destinationText}>
                    <Text style={styles.destinationName}>{destination.name}</Text>
                    <Text style={styles.destinationCountry}>{destination.country}</Text>
                  </View>
                </View>
                <View style={styles.checkboxContainer}>
                  <View style={[
                    styles.checkbox,
                    destination.isSelected && styles.checkboxSelected
                  ]}>
                    {destination.isSelected && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          fullWidth
          size="large"
          style={[styles.continueButton, { backgroundColor: theme.colors.primary.main }]}
          disabled={!destinations.some(dest => dest.isSelected)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  searchContainer: {
    marginBottom: 32,
  },
  searchInput: {
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 0,
  },
  destinationsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },
  destinationItem: {
    marginBottom: 16,
  },
  destinationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  destinationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    marginRight: 16,
  },
  destinationText: {
    flex: 1,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  destinationCountry: {
    fontSize: 14,
    color: '#757575',
  },
  checkboxContainer: {
    marginLeft: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#00B5AD',
    borderColor: '#00B5AD',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  continueButton: {
    borderRadius: 12,
    height: 52,
  },
});