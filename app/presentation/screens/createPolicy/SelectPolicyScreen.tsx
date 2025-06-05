// app/presentation/screens/createPolicy/SelectPolicyScreen.tsx
import { Button } from '@/app/presentation/components/ui/Button';
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { usePolicy } from '../../contexts/PolicyContext';

const { height: screenHeight } = Dimensions.get('window');

interface InsurancePlan {
  id: string;
  productName: string;
  sumInsured: string;
  premium: string;
  provider: string;
  providerLogo?: any;
  isRecommended?: boolean;
  addOns: number;
  isSelected: boolean;
}

interface SelectPolicyScreenProps {
  travellerNumber?: string;
}

export const SelectPolicyScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const {availablePlans} = usePolicy();
  
  const travellerNumber = params.travellerNumber || '2';
  
  // Sample insurance plans data
  const [insurancePlans, setInsurancePlans] = useState<InsurancePlan[]>([
    {
      id: 'style_pro',
      productName: 'Style Pro',
      sumInsured: '$1,50,000',
      premium: '₹3,608',
      provider: 'ICICI Lombard',
      isRecommended: true,
      addOns: 1,
      isSelected: true,
    },
    {
      id: 'ic_saver_50k',
      productName: 'IC Saver 50K Including',
      sumInsured: '$1,50,000',
      premium: '₹3,608',
      provider: 'ICICI Lombard',
      isRecommended: false,
      addOns: 0,
      isSelected: false,
    },
  ]);

  const [sameAsTraveller1, setSameAsTraveller1] = useState(true);
  const [totalAmount, setTotalAmount] = useState(9830);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddOnsExpanded, setIsAddOnsExpanded] = useState(false);
  const [sameAddOnsAsTraveller1, setSameAddOnsAsTraveller1] = useState(true);
  const animationValue = useRef(new Animated.Value(0)).current;
  const addOnsAnimationValue = useRef(new Animated.Value(0)).current;

  // Sample summary data
  const summaryData = {
    traveller1: {
      plan: {
        name: 'Style Pro',
        price: 3608
      },
      addOns: [
        {
          name: 'Political Risk & Catastrophe Evacuation',
          price: 180
        }
      ]
    },
    traveller2: {
      plan: {
        name: 'Style Pro',
        price: 3608
      },
      addOns: []
    }
  };

  // Sample add-ons data
  const availableAddOns = [
    {
      id: 'political_risk',
      name: 'Political Risk & Catastrophe Evacuation',
      price: 180,
      isSelected: true,
      note: null
    },
    {
      id: 'pre_existing_disease',
      name: 'Pre-Existing Disease',
      price: 180,
      isSelected: false,
      note: 'Note: On selection of this add-on a supporting document has to be uploaded'
    },
    {
      id: 'cruise_cover',
      name: 'Cruise Cover',
      price: 250,
      isSelected: false,
      note: null
    }
  ];

  const handlePlanSelection = (planId: string) => {
    setInsurancePlans(prev => 
      prev.map(plan => ({
        ...plan,
        isSelected: plan.id === planId
      }))
    );
  };

  const handleRemovePlan = (planId: string) => {
    setInsurancePlans(prev => 
      prev.map(plan => 
        plan.id === planId 
          ? { ...plan, isSelected: false }
          : plan
      )
    );
  };

  const handleAddOns = (planId: string) => {
    // Navigate to add-ons selection screen
    router.push({
      pathname: '/(createPolicy)/add-ons-selection',
      params: { 
        planId: planId,
        travellerNumber: travellerNumber
      }
    });
  };

  const handleViewBenefits = (planId: string) => {
    // Navigate to benefits details screen
    console.log('View benefits for plan:', planId);
  };

  const handleContinue = () => {
  // Navigate to policy review screen
  router.push({
    pathname: '/(createPolicy)/policy-review',
    params: {
      travellerNumber: travellerNumber,
      selectedPlanId: insurancePlans.find(plan => plan.isSelected)?.id || '',
      totalAmount: totalAmount.toString(),
    }
  });
};

  const handleBack = () => {
    router.back();
  };

  const toggleSummary = () => {
    // Close add-ons if open, then toggle summary
    if (isAddOnsExpanded) {
      closeAddOns();
    }
    
    const toValue = isExpanded ? 0 : 1;
    
    Animated.timing(animationValue, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  const closeSummary = () => {
    Animated.timing(animationValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setIsExpanded(false);
  };

  const closeAddOns = () => {
    Animated.timing(addOnsAnimationValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setIsAddOnsExpanded(false);
  };

  const handleAddOnSelect = (addOnId: string) => {
    // Handle add-on selection logic here
    console.log('Selected add-on:', addOnId);
  };

  const handleAddOnRemove = (addOnId: string) => {
    // Handle add-on removal logic here
    console.log('Removed add-on:', addOnId);
  };

  const getCardBackgroundColor = (plan: InsurancePlan) => {
    if (plan.isSelected) {
      return isDarkMode ? theme.colors.primary.main + '30' : '#E0FFFE';
    }
    return isDarkMode ? theme.colors.neutral.gray100 : theme.colors.neutral.white;
  };

  const getCardBorderColor = (plan: InsurancePlan) => {
    if (plan.isSelected) {
      return theme.colors.primary.main;
    }
    return isDarkMode ? theme.colors.neutral.gray400 : theme.colors.neutral.gray200;
  };

  useEffect(() => {
    console.log(availablePlans);    
  }, [availablePlans]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.neutral.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.neutral.background} 
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.neutral.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.neutral.gray900} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.colors.neutral.gray900 }]}>
            Choose Plan
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.neutral.gray600 }]}>
            Traveller {travellerNumber}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <View style={[styles.stepIndicator, { backgroundColor: theme.colors.secondary.main + '20' }]}>
            <Text style={[styles.stepNumber, { color: theme.colors.secondary.main }]}>1</Text>
            <View style={styles.stepLines}>
              <View style={[styles.stepLine, { backgroundColor: theme.colors.primary.main }]} />
              <View style={[styles.stepLine, { backgroundColor: theme.colors.primary.main }]} />
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Same as Traveller 1 Option */}
        <TouchableOpacity 
          style={[styles.sameAsTravellerOption, {
            backgroundColor: theme.colors.neutral.gray100,
            borderColor: theme.colors.neutral.gray300
          }]}
          onPress={() => setSameAsTraveller1(!sameAsTraveller1)}
        >
          <View style={[
            styles.checkbox,
            {
              backgroundColor: sameAsTraveller1 ? theme.colors.primary.main : 'transparent',
              borderColor: sameAsTraveller1 ? theme.colors.primary.main : theme.colors.neutral.gray400
            }
          ]}>
            {sameAsTraveller1 && (
              <Ionicons name="checkmark" size={16} color={theme.colors.neutral.white} />
            )}
          </View>
          <Text style={[styles.sameAsTravellerText, { color: theme.colors.neutral.gray900 }]}>
            Choose same plan as traveller 1
          </Text>
        </TouchableOpacity>

        {/* Insurance Plans */}
        <View style={styles.plansContainer}>
          {insurancePlans.map((plan, index) => (
            <View 
              key={plan.id}
              style={[
                styles.planCard,
                {
                  backgroundColor: getCardBackgroundColor(plan),
                  borderColor: getCardBorderColor(plan),
                }
              ]}
            >
              {/* Recommended Badge */}
              {plan.isRecommended && (
                <View style={[styles.recommendedBadge, { backgroundColor: '#D946EF' }]}>
                  <Text style={[styles.recommendedText, { color: theme.colors.neutral.white }]}>
                    Recommended
                  </Text>
                </View>
              )}

              {/* Provider Header with Logo Background */}
              <View style={[styles.providerHeaderContainer, { backgroundColor: theme.colors.neutral.sOrange }]}>
                <View style={styles.providerContent}>
                  <View style={styles.providerLogoSection}>
                    <View style={styles.providerLogo}>
                      <Text style={[styles.logoText, { color: '#E74C3C' }]}>ICICI</Text>
                      <Text style={[styles.logoSubtext, { color: '#1E3A8A' }]}>Lombard</Text>
                    </View>
                    <Text style={[styles.providerTagline, { color: '#E74C3C' }]}>
                      Nibhaye Vaade
                    </Text>
                    <View style={[styles.orangeLine, { backgroundColor: '#FF9500' }]} />
                  </View>
                  <View style={styles.menuIcon}>
                    <View style={styles.menuDot} />
                    <View style={styles.menuDot} />
                    <View style={styles.menuDot} />
                  </View>
                </View>
              </View>

              {/* Product Info */}
              <View style={styles.productInfoSection}>
                <Text style={[styles.productLabel, { color: theme.colors.neutral.gray400 }]}>
                  PRODUCT NAME
                </Text>
                <View style={styles.productNameRow}>
                  <Text style={[styles.productName, { color: theme.colors.neutral.gray900 }]}>
                    {plan.productName}
                  </Text>
                  <TouchableOpacity onPress={() => handleViewBenefits(plan.id)}>
                    <Text style={[styles.viewBenefits, { color: theme.colors.primary.main }]}>
                      View benefits
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Amounts Row */}
              <View style={styles.amountsSection}>
                <View style={styles.amountColumn}>
                  <Text style={[styles.amountLabel, { color: theme.colors.neutral.gray400 }]}>
                    SUM INSURED
                  </Text>
                  <Text style={[styles.amountValue, { color: theme.colors.neutral.gray900 }]}>
                    {plan.sumInsured}
                  </Text>
                </View>
                <View style={[styles.verticalDivider, { backgroundColor: theme.colors.neutral.gray200 }]} />
                <View style={styles.amountColumn}>
                  <Text style={[styles.amountLabel, { color: theme.colors.neutral.gray400 }]}>
                    PREMIUM
                  </Text>
                  <Text style={[styles.amountValue, { color: theme.colors.neutral.gray900 }]}>
                    {plan.premium}
                  </Text>
                </View>
              </View>

              {/* Separator Line */}
              <View style={[styles.sectionSeparator, { backgroundColor: theme.colors.neutral.gray200 }]} />

              {/* Add-ons Row */}
              <View style={styles.addOnsSection}>
                <TouchableOpacity 
                  style={styles.addOnsButton}
                  onPress={() => handleAddOns(plan.id)}
                >
                  <Ionicons name="add" size={20} color={theme.colors.primary.main} />
                  <Text style={[styles.addOnsText, { color: theme.colors.primary.main }]}>
                    Choose Add - Ons
                  </Text>
                </TouchableOpacity>
                
                <View style={[styles.selectedBadge, { backgroundColor: theme.colors.secondary.main + '20' }]}>
                  <Text style={[styles.selectedText, { color: theme.colors.secondary.main }]}>
                    {plan.addOns} Selected
                  </Text>
                </View>
              </View>

              {/* Action Button */}
              {plan.isSelected ? (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.removeButton, { 
                    borderColor: theme.colors.secondary.main,
                    backgroundColor: 'transparent'
                  }]}
                  onPress={() => handleRemovePlan(plan.id)}
                >
                  <Ionicons name="remove" size={20} color={theme.colors.secondary.main} />
                  <Text style={[styles.actionButtonText, { color: theme.colors.secondary.main }]}>
                    Remove Plan
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.selectButton, { 
                    borderColor: theme.colors.primary.main,
                    backgroundColor: 'transparent'
                  }]}
                  onPress={() => handlePlanSelection(plan.id)}
                >
                  <Ionicons name="add" size={20} color={theme.colors.primary.main} />
                  <Text style={[styles.actionButtonText, { color: theme.colors.primary.main }]}>
                    Select Plan
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View style={{height:110}}>

        </View>
      </ScrollView>

      {/* Bottom Section with Expandable Summary */}
      <View style={styles.bottomContainer}>
        <Animated.View 
          style={[
            styles.summarySection,
            {
              backgroundColor: theme.colors.neutral.gray100,
              height: isExpanded 
                ? animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [110, 400],
                  })
                : isAddOnsExpanded
                ? addOnsAnimationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [110, 600],
                  })
                : 110,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 10,
            }
          ]}
        >
          {/* Close Button (only in expanded state) */}
          {(isExpanded || isAddOnsExpanded) && (
            <View style={styles.expandedHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={isExpanded ? closeSummary : closeAddOns}
              >
                <Ionicons name="close" size={24} color={theme.colors.neutral.gray900} />
              </TouchableOpacity>
            </View>
          )}

          {/* Expanded Content */}
          {isExpanded && (
            <Animated.View 
              style={[
                styles.expandedContent,
                {
                  opacity: animationValue,
                }
              ]}
            >
              <ScrollView showsVerticalScrollIndicator={false} style={styles.expandedScrollView}>
                {/* Traveller 1 Section */}
                <View style={styles.travellerSection}>
                  <Text style={[styles.travellerTitle, { color: theme.colors.primary.main }]}>
                    TRAVELLER 1
                  </Text>

                  {/* Plan Section */}
                  <View style={styles.summaryRow}>
                    <View style={styles.summaryRowHeader}>
                      <Text style={[styles.summaryRowTitle, { color: theme.colors.neutral.gray900 }]}>
                        Plan
                      </Text>
                      <TouchableOpacity>
                        <Ionicons name="pencil" size={16} color={theme.colors.neutral.gray500} />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.summaryDivider, { backgroundColor: theme.colors.neutral.gray200 }]} />
                    <View style={styles.summaryItem}>
                      <Text style={[styles.summaryItemName, { color: theme.colors.neutral.gray900 }]}>
                        {summaryData.traveller1.plan.name}
                      </Text>
                      <Text style={[styles.summaryItemPrice, { color: theme.colors.neutral.gray900 }]}>
                        ₹{summaryData.traveller1.plan.price.toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {/* Add-Ons Section */}
                  <View style={styles.summaryRow}>
                    <View style={styles.summaryRowHeader}>
                      <Text style={[styles.summaryRowTitle, { color: theme.colors.neutral.gray900 }]}>
                        Add - Ons
                      </Text>
                      <TouchableOpacity>
                        <Ionicons name="pencil" size={16} color={theme.colors.neutral.gray500} />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.summaryDivider, { backgroundColor: theme.colors.neutral.gray200 }]} />
                    {summaryData.traveller1.addOns.map((addon, index) => (
                      <View key={index} style={styles.summaryItem}>
                        <Text style={[styles.summaryItemName, { color: theme.colors.neutral.gray900 }]}>
                          {addon.name}
                        </Text>
                        <Text style={[styles.summaryItemPrice, { color: theme.colors.neutral.gray900 }]}>
                          ₹{addon.price}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Traveller 2 Section */}
                <View style={styles.travellerSection}>
                  <Text style={[styles.travellerTitle, { color: theme.colors.primary.main }]}>
                    TRAVELLER 2
                  </Text>

                  {/* Plan Section */}
                  <View style={styles.summaryRow}>
                    <View style={styles.summaryRowHeader}>
                      <Text style={[styles.summaryRowTitle, { color: theme.colors.neutral.gray900 }]}>
                        Plan
                      </Text>
                      <TouchableOpacity>
                        <Ionicons name="pencil" size={16} color={theme.colors.neutral.gray500} />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.summaryDivider, { backgroundColor: theme.colors.neutral.gray200 }]} />
                    <View style={styles.summaryItem}>
                      <Text style={[styles.summaryItemName, { color: theme.colors.neutral.gray900 }]}>
                        {summaryData.traveller2.plan.name}
                      </Text>
                      <Text style={[styles.summaryItemPrice, { color: theme.colors.neutral.gray900 }]}>
                        ₹{summaryData.traveller2.plan.price.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </Animated.View>
          )}

          {/* Fixed Bottom Section - Summary Header and Continue Button */}
          <View style={styles.fixedBottom}>
            {/* Summary Header */}
            <View style={styles.summaryHeader}>
              <TouchableOpacity 
                style={styles.summaryLeft}
                onPress={toggleSummary}
                activeOpacity={0.7}
              >
                <Text style={[styles.summaryTitle, { color: theme.colors.neutral.gray600 }]}>
                  SUMMARY
                </Text>
                {(!isExpanded && !isAddOnsExpanded) && (
                  <Ionicons 
                    name="chevron-down" 
                    size={20} 
                    color={theme.colors.neutral.gray600} 
                    style={styles.chevronIcon}
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* Price and Continue Button Row */}
            <View style={styles.priceRow}>
              <Text style={[styles.summaryPrice, { color: theme.colors.neutral.gray900 }]}>
                ₹{totalAmount.toLocaleString()}
              </Text>
              
              <Button
                title="Continue"
                onPress={handleContinue}
                size="large"
                style={[styles.continueButton, { backgroundColor: theme.colors.primary.main }]}
              />
            </View>
          </View>
        </Animated.View>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  headerRight: {
    width: 40,
    alignItems: 'center',
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepLines: {
    position: 'absolute',
    right: -20,
    flexDirection: 'row',
    gap: 2,
  },
  stepLine: {
    width: 8,
    height: 2,
    borderRadius: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sameAsTravellerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sameAsTravellerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -1,
    left: '50%',
    transform: [{ translateX: -50 }],
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  providerHeaderContainer: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  providerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  providerLogoSection: {
    flex: 1,
  },
  providerLogo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 4,
  },
  logoSubtext: {
    fontSize: 16,
    fontWeight: '700',
  },
  providerTagline: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 8,
  },
  orangeLine: {
    width: 60,
    height: 3,
    borderRadius: 2,
  },
  menuIcon: {
    flexDirection: 'row',
    padding: 8,
    gap: 3,
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9CA3AF',
  },
  productInfoSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  productLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  productNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  viewBenefits: {
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  amountsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  amountColumn: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  verticalDivider: {
    width: 1,
    marginHorizontal: 20,
    alignSelf: 'stretch',
  },
  sectionSeparator: {
    height: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addOnsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  addOnsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addOnsText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  selectedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  selectButton: {},
  removeButton: {},
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // New Bottom Section Styles
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  summarySection: {
    position: 'relative',
  },
  expandedHeader: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedContent: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 110, // Leave space for fixed bottom section
  },
  expandedScrollView: {
    paddingHorizontal: 20,
  },
  fixedBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: 'inherit',
  },
  summaryHeader: {
    marginBottom: 0,
    alignItems: 'flex-start',
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryPrice: {
    fontSize: 28,
    fontWeight: '700',
    flex: 1,
    textAlign: 'left',
  },
  continueButton: {
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 32,
    marginLeft: 16,
  },
  travellerSection: {
    marginBottom: 24,
  },
  travellerTitle: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  summaryRow: {
    marginBottom: 20,
  },
  summaryRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryRowTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryItemName: {
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
    marginRight: 16,
  },
  summaryItemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Add-ons Section Styles
  addOnsHeader: {
    marginBottom: 20,
  },
  addOnsTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
  },
  addOnsList: {
    gap: 16,
  },
  addOnCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
  },
  addOnContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addOnInfo: {
    flex: 1,
    marginRight: 16,
  },
  addOnName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  addOnNote: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  addOnPriceLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  addOnPrice: {
    fontSize: 20,
    fontWeight: '700',
  },
  addOnAction: {
    justifyContent: 'center',
  },
  selectAddOnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
  },
  selectAddOnButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  addOnRemoveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
  },
  addOnRemoveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});