// app/presentation/screens/createPolicy/SearchDestinationScreen.tsx
import { Country } from "@/app/core/domain/entities/Country";
import { Button } from "@/app/presentation/components/ui/Button";
import { TextInput } from "@/app/presentation/components/ui/TextInput";
import { useTheme } from "@/app/presentation/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Header } from "../../components/ui/Header";
import { useMasterData } from "../../contexts/MasterDataContext";
import { useTripDetails } from "../../contexts/TripDetailsContext";

interface Destination extends Country {
  isSelected?: boolean;
}

interface SearchDestinationScreenProps {
  countryRegion: string;
}

export const SearchDestinationScreen: React.FC<
  SearchDestinationScreenProps
> = ({ countryRegion }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const { countries } = useMasterData();
  const { setDestination, tripDetails } = useTripDetails();

  //state
  const [searchQuery, setSearchQuery] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] =
    useState<Destination[]>();

  useEffect(() => {
    if (countryRegion && countries) {
      setDestinations(
        countries
          .filter(
            (country) =>
              country.countryRegion.toLowerCase() ===
              countryRegion.toLowerCase()
          )
          .map((country) => ({
            ...country,
            isSelected:
              country.countryId === tripDetails.destination?.countryId,
          }))
      );
    }
  }, [countryRegion, countries]);

  useEffect(() => {
    if (destinations) {
      if (searchQuery && searchQuery.length > 0) {
        setFilteredDestinations(
          destinations.filter((dest) =>
            dest.countryName.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } else {
        setFilteredDestinations(destinations);
      }
    }
  }, [destinations, searchQuery]);

  const handleDestinationSelect = (destination: Destination) => {
    setDestinations((prev) =>
      prev.map((dest) => ({
        ...dest,
        isSelected: dest.countryId === destination.countryId,
      }))
    );
  };

  const handleContinue = () => {
    setDestination(destinations.find((dest) => dest.isSelected) || null);
    router.back();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.neutral.background },
      ]}
    >
      {/* Header */}
      <Header title="Select Destination" onBackPress={() => router.back()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Input */}
        <TextInput
          startIcon={
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.neutral.gray600}
            />
          }
          placeholder="Where To?"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Popular Destinations */}
        <View style={styles.destinationsContainer}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.neutral.gray900 },
            ]}
          >
            Popular Destinations
          </Text>

          {filteredDestinations &&
            filteredDestinations.length > 0 &&
            filteredDestinations.map((destination) => (
              <TouchableOpacity
                key={destination.countryId}
                style={styles.destinationItem}
                onPress={() => handleDestinationSelect(destination)}
                activeOpacity={0.7}
              >
                <View style={styles.destinationContent}>
                  <View style={styles.destinationInfo}>
                    <View style={styles.locationIcon}>
                      <Ionicons
                        name="location"
                        size={20}
                        color={theme.colors.primary.main}
                      />
                    </View>
                    <View style={styles.destinationText}>
                      <Text
                        style={[
                          styles.destinationName,
                          { color: theme.colors.neutral.gray700 },
                        ]}
                      >
                        {destination.countryName}
                      </Text>
                      <Text
                        style={[
                          styles.destinationCountry,
                          { color: theme.colors.neutral.gray600 },
                        ]}
                      >
                        {destination.countryRegion}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.checkboxContainer}>
                    <View
                      style={[
                        styles.checkbox,
                        destination.isSelected && styles.checkboxSelected,
                      ]}
                    >
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
      <View
        style={[
          styles.buttonContainer,
          {
            borderColor: theme.colors.neutral.gray400,
            backgroundColor: theme.colors.neutral.gray100,
          },
        ]}
      >
        <Button
          title="Continue"
          onPress={handleContinue}
          fullWidth
          size="large"
          disabled={!destinations.some((dest) => dest.isSelected)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight || 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
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
    borderWidth: 0,
  },
  destinationsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  destinationItem: {
    marginBottom: 16,
  },
  destinationContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  destinationInfo: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  destinationCountry: {
    fontSize: 14,
    color: "#757575",
  },
  checkboxContainer: {
    marginLeft: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#00B5AD",
    borderColor: "#00B5AD",
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    borderTopWidth: 1,
  },
  continueButton: {
    borderRadius: 12,
    height: 52,
  },
});
