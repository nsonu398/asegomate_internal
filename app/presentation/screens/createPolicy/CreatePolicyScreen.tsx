// app/presentation/screens/createPolicy/CreatePolicyScreen.tsx
import { TripDetailsForm } from '@/app/presentation/components/createPolicy/TripDetailsForm';
import { TripTypeSelector } from '@/app/presentation/components/createPolicy/TripTypeSelector';
import { Button } from '@/app/presentation/components/ui/Button';
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
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

interface CreatePolicyScreenProps {
  onBack?: () => void;
}

export const CreatePolicyScreen: React.FC<CreatePolicyScreenProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const [selectedTripType, setSelectedTripType] = useState('Single Trip');

  const handleGetQuote = () => {
    // Handle get quote action
    console.log('Get Quote pressed');
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
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
      >
        <TripTypeSelector
          selectedType={selectedTripType}
          onTypeSelect={setSelectedTripType}
        />

        <TripDetailsForm />

        <View style={styles.buttonContainer}>
          <Button
            title="Get Quote"
            onPress={handleGetQuote}
            fullWidth
            size="large"
            style={styles.getQuoteButton}
          />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 24,
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
    paddingHorizontal: 24,
  },
  buttonContainer: {
    paddingVertical: 24,
  },
  getQuoteButton: {
    backgroundColor: '#00B5AD',
    borderRadius: 12,
    height: 56,
  },
});