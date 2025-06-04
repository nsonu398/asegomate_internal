// app/presentation/components/ui/Header.tsx
import { useTheme } from "@/app/presentation/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  onBackPress?: () => void;
  onClosePress?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  centerComponent?: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: "light-content" | "dark-content";
  statusBarBackgroundColor?: string;
  elevation?: boolean;
  borderBottom?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  showCloseButton = false,
  onBackPress,
  onClosePress,
  rightComponent,
  leftComponent,
  centerComponent,
  backgroundColor,
  statusBarStyle,
  statusBarBackgroundColor,
  elevation = false,
  borderBottom = false,
}) => {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleClosePress = () => {
    if (onClosePress) {
      onClosePress();
    } else {
      router.back();
    }
  };

  const getBackgroundColor = () => {
    return backgroundColor || theme.colors.neutral.background;
  };

  const getStatusBarStyle = () => {
    return statusBarStyle || (isDarkMode ? "light-content" : "dark-content");
  };

  const getStatusBarBackgroundColor = () => {
    return statusBarBackgroundColor || getBackgroundColor();
  };

  return (
    <>
      <StatusBar
        barStyle={getStatusBarStyle()}
        backgroundColor={getStatusBarBackgroundColor()}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor: getBackgroundColor(),
            borderBottomWidth: borderBottom ? 1 : 0,
            borderBottomColor: theme.colors.neutral.gray200,
            ...(elevation && {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 4,
            }),
          },
        ]}
      >
        <View style={styles.content}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            {leftComponent ? (
              leftComponent
            ) : showBackButton ? (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleBackPress}
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={theme.colors.neutral.gray900}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.placeholder} />
            )}
          </View>

          {/* Center Section */}
          <View style={styles.centerSection}>
            {centerComponent ? (
              centerComponent
            ) : (
              <View style={styles.titleContainer}>
                <Text
                  style={[
                    styles.title,
                    { color: theme.colors.neutral.gray900 },
                  ]}
                >
                  {title}
                </Text>
                {subtitle && (
                  <Text
                    style={[
                      styles.subtitle,
                      { color: theme.colors.neutral.gray600 },
                    ]}
                  >
                    {subtitle}
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            {rightComponent ? (
              rightComponent
            ) : showCloseButton ? (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleClosePress}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.colors.neutral.gray900}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.placeholder} />
            )}
          </View>
        </View>
      </View>
    </>
  );
};

// Specific header variants for common use cases
interface StepHeaderProps extends Omit<HeaderProps, "rightComponent"> {
  currentStep: number;
  totalSteps: number;
  stepColor?: string;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  currentStep,
  totalSteps,
  stepColor,
  ...headerProps
}) => {
  const { theme } = useTheme();

  const stepIndicator = (
    <View style={styles.stepIndicatorContainer}>
      <View
        style={[
          styles.stepIndicator,
          {
            backgroundColor: stepColor
              ? stepColor + "20"
              : theme.colors.secondary.main + "20",
          },
        ]}
      >
        <Text
          style={[
            styles.stepNumber,
            {
              color: stepColor || theme.colors.secondary.main,
            },
          ]}
        >
          {currentStep}
        </Text>
        <View style={styles.stepLines}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.stepLine,
                {
                  backgroundColor:
                    index < currentStep
                      ? stepColor || theme.colors.primary.main
                      : theme.colors.neutral.gray300,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );

  return <Header {...headerProps} rightComponent={stepIndicator} />;
};

// Search header variant
interface SearchHeaderProps
  extends Omit<HeaderProps, "title" | "centerComponent"> {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSearchSubmit?: () => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  onSearchSubmit,
  ...headerProps
}) => {
  const { theme } = useTheme();

  const searchComponent = (
    <View
      style={[
        styles.searchContainer,
        {
          backgroundColor: theme.colors.neutral.gray100,
          borderColor: theme.colors.neutral.gray300,
        },
      ]}
    >
      <Ionicons
        name="search"
        size={20}
        color={theme.colors.neutral.gray500}
        style={styles.searchIcon}
      />
      <Text
        style={[
          styles.searchPlaceholder,
          { color: theme.colors.neutral.gray500 },
        ]}
      >
        {searchValue || searchPlaceholder}
      </Text>
    </View>
  );

  return <Header {...headerProps} title="" centerComponent={searchComponent} />;
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight || 24,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  leftSection: {
    width: 40,
    alignItems: "flex-start",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  rightSection: {
    width: 40,
    alignItems: "flex-end",
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
    textAlign: "center",
  },
  // Step indicator styles
  stepIndicatorContainer: {
    alignItems: "center",
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
  },
  stepLines: {
    position: "absolute",
    right: -20,
    flexDirection: "row",
    gap: 2,
  },
  stepLine: {
    width: 8,
    height: 2,
    borderRadius: 1,
  },
  // Search styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
    flex: 1,
  },
});
