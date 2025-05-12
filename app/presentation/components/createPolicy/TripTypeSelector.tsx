// app/presentation/components/services/TripTypeSelector.tsx
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

interface TripTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

const tripTypes = ['Single Trip', 'Multi Trip', 'Student', 'Spe'];

export const TripTypeSelector: React.FC<TripTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {tripTypes.map((type) => {
        const isSelected = selectedType === type;
        return (
          <TouchableOpacity
            key={type}
            style={[
              styles.pill,
              isSelected && styles.selectedPill,
              !isSelected && styles.unselectedPill,
            ]}
            onPress={() => onTypeSelect(type)}
          >
            <Text
              style={[
                styles.pillText,
                isSelected && styles.selectedPillText,
                !isSelected && styles.unselectedPillText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  contentContainer: {
    paddingHorizontal: 4,
  },
  pill: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 6,
    borderWidth: 1,
  },
  selectedPill: {
    backgroundColor: '#E0FFFE',
    borderColor: '#00B5AD',
  },
  unselectedPill: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
  },
  pillText: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedPillText: {
    color: '#00B5AD',
  },
  unselectedPillText: {
    color: '#9E9E9E',
  },
});