// app/presentation/screens/createPolicy/CalendarScreen.tsx
import { Button } from '@/app/presentation/components/ui/Button';
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { CalendarList, DateData } from 'react-native-calendars';

interface CalendarScreenProps {
  dateType?: 'start' | 'end';
  selectedDate?: string;
  startDate?: string; // For end date selection validation
}

export const CalendarScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const dateType = params.dateType as 'start' | 'end';
  const currentSelectedDate = params.selectedDate as string;
  const startDate = params.startDate as string;
  
  const [selectedDate, setSelectedDate] = useState<string>(currentSelectedDate || '');

  const handleDateSelect = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const handleContinue = () => {
    if (selectedDate) {
      // Navigate back with the selected date
      router.back();
      // Pass the selected date back to the previous screen
      router.setParams({
        [dateType === 'start' ? 'selectedStartDate' : 'selectedEndDate']: selectedDate
      });
    }
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
    const year = date.getFullYear().toString().slice(-2);
    
    const getDaySuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    return `${day}${getDaySuffix(day)} ${month}' ${year}`;
  };

  // Get minimum date (today for start date, start date for end date)
  const getMinDate = () => {
    const today = new Date();
    if (dateType === 'end' && startDate) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + 1); // End date should be at least 1 day after start
      return start.toISOString().split('T')[0];
    }
    return today.toISOString().split('T')[0];
  };

  // Calendar theme
  const calendarTheme = {
    backgroundColor: isDarkMode ? theme.colors.neutral.gray200 : theme.colors.neutral.white,
    calendarBackground: isDarkMode ? theme.colors.neutral.gray200 : theme.colors.neutral.white,
    textSectionTitleColor: theme.colors.neutral.gray600,
    selectedDayBackgroundColor: theme.colors.secondary.main,
    selectedDayTextColor: theme.colors.neutral.white,
    todayTextColor: theme.colors.primary.main,
    dayTextColor: theme.colors.neutral.gray900,
    textDisabledColor: theme.colors.neutral.gray400,
    dotColor: theme.colors.primary.main,
    selectedDotColor: theme.colors.neutral.white,
    arrowColor: theme.colors.neutral.gray700,
    disabledArrowColor: theme.colors.neutral.gray400,
    monthTextColor: theme.colors.neutral.gray900,
    indicatorColor: theme.colors.primary.main,
    textDayFontFamily: 'System',
    textMonthFontFamily: 'System',
    textDayHeaderFontFamily: 'System',
    textDayFontWeight: '400' as const,
    textMonthFontWeight: '600' as const,
    textDayHeaderFontWeight: '500' as const,
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14,
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.neutral.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.neutral.background} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.neutral.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.neutral.gray900} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerLabel, { color: theme.colors.neutral.gray500 }]}>
            {dateType === 'start' ? 'START DATE' : 'END DATE'}
          </Text>
          <Text style={[styles.headerDate, { color: theme.colors.neutral.gray900 }]}>
            {selectedDate ? formatDateForDisplay(selectedDate) : 
             (dateType === 'start' ? '11th Oct\' 24' : 'Select Date')}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <CalendarList
          onDayPress={handleDateSelect}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: theme.colors.secondary.main,
            },
          }}
          minDate={getMinDate()}
          theme={calendarTheme}
          firstDay={1} // Monday as first day
          pastScrollRange={0} // Don't show past months
          futureScrollRange={12} // Show next 12 months
          scrollEnabled={true}
          showScrollIndicator={false}
          horizontal={false} // Vertical scrolling
          pagingEnabled={false} // Smooth scrolling instead of paging
          calendarHeight={350} // Height of each calendar month
          style={styles.calendar}
        />
      </View>

      {/* Continue Button */}
      <View style={[styles.buttonContainer, { backgroundColor: theme.colors.neutral.background }]}>
        <Button
          title="Continue"
          onPress={handleContinue}
          fullWidth
          size="large"
          style={[styles.continueButton, { backgroundColor: theme.colors.primary.main }]}
          disabled={!selectedDate}
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
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  calendar: {
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  continueButton: {
    borderRadius: 12,
    height: 52,
  },
});