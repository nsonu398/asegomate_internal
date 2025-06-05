// app/presentation/screens/createPolicy/PolicyFilterScreen.tsx
import { Button } from '@/app/presentation/components/ui/Button';
import { usePolicyFilter } from '@/app/presentation/contexts/PolicyFilterContext';
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface FilterSectionProps {
 title: string;
 options: string[];
 selectedOptions: string[];
 onToggleOption: (option: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
 title,
 options,
 selectedOptions,
 onToggleOption,
}) => {
 const { theme } = useTheme();

 return (
   <View style={styles.filterSection}>
     <Text style={[styles.sectionTitle, { color: theme.colors.neutral.gray900 }]}>
       {title}
     </Text>
     <View style={styles.optionsContainer}>
       {options.map((option) => {
         const isSelected = selectedOptions.includes(option);
         return (
           <TouchableOpacity
             key={option}
             style={[
               styles.optionItem,
               {
                 backgroundColor: theme.colors.neutral.background,
                 borderColor: theme.colors.neutral.gray200,
               }
             ]}
             onPress={() => onToggleOption(option)}
             activeOpacity={0.7}
           >
             <View
               style={[
                 styles.checkbox,
                 {
                   backgroundColor: isSelected
                     ? theme.colors.primary.main
                     : 'transparent',
                   borderColor: isSelected
                     ? theme.colors.primary.main
                     : theme.colors.neutral.gray400,
                 },
               ]}
             >
               {isSelected && (
                 <Ionicons
                   name="checkmark"
                   size={16}
                   color={theme.colors.neutral.white}
                 />
               )}
             </View>
             <Text
               style={[
                 styles.optionText,
                 { color: theme.colors.neutral.gray900 },
               ]}
             >
               {option}
             </Text>
           </TouchableOpacity>
         );
       })}
     </View>
   </View>
 );
};

export const PolicyFilterScreen: React.FC = () => {
 const { theme, isDarkMode } = useTheme();
 const router = useRouter();
 const {
   filters,
   filterOptions,
   setSelectedInsurers,
   setSelectedSumInsured,
   setSelectedPlans,
   clearAllFilters,
   getFilterCount,
 } = usePolicyFilter();

 const handleInsurerToggle = (insurer: string) => {
   const newInsurers = filters.selectedInsurers.includes(insurer)
     ? filters.selectedInsurers.filter(i => i !== insurer)
     : [...filters.selectedInsurers, insurer];
   setSelectedInsurers(newInsurers);
 };

 const handleSumInsuredToggle = (sumInsured: string) => {
   const newSumInsured = filters.selectedSumInsured.includes(sumInsured)
     ? filters.selectedSumInsured.filter(s => s !== sumInsured)
     : [...filters.selectedSumInsured, sumInsured];
   setSelectedSumInsured(newSumInsured);
 };

 const handlePlanToggle = (plan: string) => {
   const newPlans = filters.selectedPlans.includes(plan)
     ? filters.selectedPlans.filter(p => p !== plan)
     : [...filters.selectedPlans, plan];
   setSelectedPlans(newPlans);
 };

 const handleClearAll = () => {
   clearAllFilters();
 };

 const handleApplyFilter = () => {
   router.back();
 };

 const handleBack = () => {
   router.back();
 };

 const handleClose = () => {
   router.back();
 };

 return (
   <View
     style={[
       styles.container,
       { backgroundColor: theme.colors.neutral.background },
     ]}
   >
     <StatusBar
       barStyle={isDarkMode ? 'light-content' : 'dark-content'}
       backgroundColor={theme.colors.neutral.background}
     />

     {/* Header */}
     <View
       style={[
         styles.header,
         { backgroundColor: theme.colors.neutral.background },
       ]}
     >
       <TouchableOpacity style={styles.backButton} onPress={handleBack}>
         <Ionicons
           name="arrow-back"
           size={24}
           color={theme.colors.neutral.gray900}
         />
       </TouchableOpacity>
       <Text
         style={[styles.headerTitle, { color: theme.colors.neutral.gray900 }]}
       >
         Filters
       </Text>
       <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
         <Ionicons
           name="close"
           size={24}
           color={theme.colors.neutral.gray900}
         />
       </TouchableOpacity>
     </View>

     {/* Content */}
     <View style={styles.content}>
       <ScrollView
         style={styles.filtersContainer}
         showsVerticalScrollIndicator={false}
       >
         {/* All Insurer Section */}
         <FilterSection
           title={`All Insurer${filters.selectedInsurers.length > 0 ? ` (${filters.selectedInsurers.length})` : ''}`}
           options={filterOptions.insurers}
           selectedOptions={filters.selectedInsurers}
           onToggleOption={handleInsurerToggle}
         />

         {/* All Sum Insured Section */}
         <FilterSection
           title={`All Sum Insured${filters.selectedSumInsured.length > 0 ? ` (${filters.selectedSumInsured.length})` : ''}`}
           options={filterOptions.sumInsured}
           selectedOptions={filters.selectedSumInsured}
           onToggleOption={handleSumInsuredToggle}
         />

         {/* All Plans Section */}
         <FilterSection
           title={`All Plans${filters.selectedPlans.length > 0 ? ` (${filters.selectedPlans.length})` : ''}`}
           options={filterOptions.plans}
           selectedOptions={filters.selectedPlans}
           onToggleOption={handlePlanToggle}
         />
       </ScrollView>
     </View>

     {/* Bottom Buttons */}
     <View
       style={[
         styles.bottomContainer,
         { backgroundColor: theme.colors.neutral.background },
       ]}
     >
       <Button
         title="Clear All"
         onPress={handleClearAll}
         variant="outlined"
         style={[
           styles.clearButton,
           {
             borderColor: theme.colors.primary.main,
           },
         ]}
       />
       <Button
         title="Apply Filter"
         onPress={handleApplyFilter}
         style={[
           styles.applyButton,
           { backgroundColor: theme.colors.primary.main },
         ]}
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
 headerTitle: {
   fontSize: 20,
   fontWeight: '700',
 },
 closeButton: {
   width: 40,
   height: 40,
   justifyContent: 'center',
   alignItems: 'center',
 },
 content: {
   flex: 1,
   paddingHorizontal: 24,
 },
 filtersContainer: {
   flex: 1,
 },
 filterSection: {
   marginBottom: 32,
 },
 sectionTitle: {
   fontSize: 18,
   fontWeight: '600',
   marginBottom: 16,
 },
 optionsContainer: {
   gap: 12,
 },
 optionItem: {
   flexDirection: 'row',
   alignItems: 'center',
   paddingVertical: 16,
   paddingHorizontal: 4,
   borderBottomWidth: 1,
 },
 checkbox: {
   width: 24,
   height: 24,
   borderRadius: 4,
   borderWidth: 2,
   justifyContent: 'center',
   alignItems: 'center',
   marginRight: 16,
 },
 optionText: {
   fontSize: 16,
   fontWeight: '500',
   flex: 1,
 },
 bottomContainer: {
   flexDirection: 'row',
   paddingHorizontal: 24,
   paddingVertical: 24,
   paddingBottom: Platform.OS === 'ios' ? 40 : 24,
   gap: 16,
 },
 clearButton: {
   flex: 1,
   borderRadius: 12,
   height: 52,
 },
 applyButton: {
   flex: 1,
   borderRadius: 12,
   height: 52,
 },
});