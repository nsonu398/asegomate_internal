// app/presentation/components/navigation/BottomNavigation.tsx
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { id: 'smartboard', label: 'Smartboard', icon: 'grid-outline', activeIcon: 'grid' },
  { id: 'services', label: 'Services', icon: 'list-outline', activeIcon: 'list' },
  { id: 'others', label: 'Others', icon: 'ellipsis-horizontal-circle-outline', activeIcon: 'ellipsis-horizontal-circle' },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabPress,
}) => {
  const { theme, isDarkMode } = useTheme();

  // Use darker background in dark mode
  const getNavBackgroundColor = () => {
    return isDarkMode ? theme.colors.neutral.gray400 : theme.colors.neutral.white;
  };

  // Adjust inactive icon/text colors for dark mode
  const getInactiveColor = () => {
    return isDarkMode ? theme.colors.neutral.gray900 : theme.colors.neutral.gray500;
  };

  return (
    <View style={[styles.bottomNavContainer, { backgroundColor: getNavBackgroundColor() }]}>
      <View style={styles.bottomNav}>
        {navItems.map((item, index) => {
          const isActive = activeTab === item.id;
          
          // If this is the middle position (index 2), render the FAB
          if (index === 2) {
            return (
              <React.Fragment key="fab">
                <View style={styles.fabContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.fab, 
                      { 
                        backgroundColor: theme.colors.secondary.main,
                        shadowColor: theme.colors.secondary.main
                      }
                    ]}
                    onPress={() => onTabPress('calculator')}
                  >
                    <Ionicons name="calculator" size={24} color={theme.colors.neutral.white} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  key={item.id}
                  style={styles.navItem}
                  onPress={() => onTabPress(item.id)}
                >
                  <Ionicons
                    name={isActive ? item.activeIcon : item.icon}
                    size={24}
                    color={isActive ? theme.colors.primary.main : getInactiveColor()}
                  />
                  <Text
                    style={[
                      styles.navText,
                      { color: isActive ? theme.colors.primary.main : getInactiveColor() },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            );
          }
          
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.navItem}
              onPress={() => onTabPress(item.id)}
            >
              <Ionicons
                name={isActive ? item.activeIcon : item.icon}
                size={24}
                color={isActive ? theme.colors.primary.main : getInactiveColor()}
              />
              <Text
                style={[
                  styles.navText,
                  { color: isActive ? theme.colors.primary.main : getInactiveColor() },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    minWidth: 60,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
  fabContainer: {
    width: 70,
    height: 60,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});