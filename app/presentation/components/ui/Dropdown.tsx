// app/presentation/components/ui/Dropdown.tsx
import { useTheme } from "@/app/presentation/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DropdownProps {
  label: string;
  placeholder?: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
  error?: string;
  disabled?: boolean;
  maxHeight?: number;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = "Select an option",
  options,
  value,
  onSelect,
  error,
  disabled = false,
  maxHeight = 200,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <View style={[styles.container, { zIndex: isOpen ? 1000 : 1 }]}>
      <Text style={[styles.label, { color: theme.colors.neutral.gray900 }]}>
        {label}
      </Text>

      <TouchableOpacity
        style={[
          styles.selectButton,
          {
            borderColor: error
              ? theme.colors.feedback.error
              : theme.colors.neutral.gray300,
            backgroundColor: disabled
              ? theme.colors.neutral.gray200
              : theme.colors.neutral.gray100,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
        onPress={toggleDropdown}
        disabled={disabled}
      >
        <Text
          style={[
            styles.selectButtonText,
            {
              color: value
                ? theme.colors.neutral.gray900
                : theme.colors.neutral.gray400,
            },
          ]}
        >
          {value || placeholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.colors.neutral.gray500}
        />
      </TouchableOpacity>

      {isOpen && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.colors.neutral.white,
              borderColor: theme.colors.neutral.gray200,
              maxHeight,
            },
          ]}
        >
          <ScrollView
            style={[
              styles.dropdownScroll,
              { backgroundColor: theme.colors.neutral.gray100 },
            ]}
            nestedScrollEnabled
          >
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownItem,
                  {
                    backgroundColor:
                      value === option
                        ? theme.colors.primary.main + "20"
                        : theme.colors.neutral.gray100,
                    borderBottomColor: theme.colors.neutral.gray100,
                    borderBottomWidth: index < options.length - 1 ? 1 : 0,
                  },
                ]}
                onPress={() => handleSelect(option)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    {
                      color:
                        value === option
                          ? theme.colors.primary.main
                          : theme.colors.neutral.gray900,
                      fontWeight: value === option ? "600" : "400",
                    },
                  ]}
                >
                  {option}
                </Text>
                {value === option && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={theme.colors.primary.main}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {error && (
        <Text
          style={[styles.errorText, { color: theme.colors.feedback.error }]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: "relative",
    zIndex: 1000,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectButtonText: {
    fontSize: 16,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 1000,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownScroll: {
    flex: 1,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  dropdownItemText: {
    fontSize: 16,
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
