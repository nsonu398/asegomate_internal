// app/presentation/screens/createPolicy/PolicyReviewScreen.tsx
import { Button } from '@/app/presentation/components/ui/Button';
import { TextInput } from '@/app/presentation/components/ui/TextInput';
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.collapsibleSection,
        {
          backgroundColor: theme.colors.neutral.gray100,
          borderColor: theme.colors.neutral.gray200,
        },
      ]}
    >
      <TouchableOpacity style={styles.sectionHeader} onPress={onToggle}>
        <View style={styles.sectionHeaderLeft}>
          {icon}
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.neutral.gray900 },
            ]}
          >
            {title}
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.colors.neutral.gray500}
        />
      </TouchableOpacity>

      {isExpanded && <View style={styles.sectionContent}>{children}</View>}
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
  placeholder: {
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  walletIcon: {
    marginRight: 12,
  },
  walletText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 0,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 3,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 32,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  collapsibleSection: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  sectionContent: {
    padding: 20,
    paddingTop: 0,
  },
  detailRow: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  detailValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  dateColumn: {
    flex: 1,
  },
  input: {
    borderRadius: 12,
  },
  paymentDetailsContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: '400',
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  paymentSubtext: {
    fontSize: 14,
    marginBottom: 16,
  },
  paymentDivider: {
    borderTopWidth: 1,
    marginVertical: 16,
    borderStyle: 'dashed',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  proceedButton: {
    borderRadius: 12,
    height: 52,
  },
});
export const PolicyReviewScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Section expansion states
  const [expandedSections, setExpandedSections] = useState({
    tripDetails: false,
    traveller1: false,
    traveller2: false,
  });

  // Form states
  const [invoiceType, setInvoiceType] = useState<'passenger' | 'tap'>('passenger');
  const [conveniencePercentage, setConveniencePercentage] = useState('');
  const [discount, setDiscount] = useState('');
  const [walletBalance] = useState(837); // Example wallet balance

  // Sample data - in real app, this would come from previous screens/context
  const tripData = {
    type: 'Single Trip',
    destination: 'Oman',
    startDate: '22nd May \'25',
    endDate: '26th May \'25',
    days: 5,
    travellers: 1,
  };

  const travellerData = [
    {
      id: 1,
      name: 'Sakshi Shah',
      fullName: 'Sakshi Shah',
      dateOfBirth: '19/05/2002',
      email: 'Anc@gmail.com',
      mobile: '9999666633',
      insurer: 'ADITYA BIRLA CAPITAL HEALTH INSURANCE CO. LTD',
      sumInsured: '$ 50000',
    },
    {
      id: 2,
      name: 'Sanjana Shah',
      fullName: 'Handdnxndnxnd',
      dateOfBirth: '19/05/2002',
      email: 'Anc@gmail.com',
      mobile: '9999666633',
      insurer: 'ADITYA BIRLA CAPITAL HEALTH INSURANCE CO. LTD',
      sumInsured: '$ 50000',
    },
  ];

  // Payment calculation
  const baseAmount = 1503;
  const convenienceFees = 0;
  const platformFees = 0;
  const discountAmount = 0;
  const subtotal = baseAmount + convenienceFees + platformFees;
  const total = subtotal - discountAmount;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleBack = () => {
    router.back();
  };

  const handleProceedToPayment = () => {
    // Navigate to payment screen
    console.log('Proceeding to payment...');
    router.push('/(createPolicy)/policy-payment');
  };

  const getWalletBackgroundColor = () => {
    return isDarkMode ? theme.colors.secondary.main + '30' : '#FFE8E8';
  };

  const getWalletTextColor = () => {
    return isDarkMode ? theme.colors.secondary.main : theme.colors.secondary.main;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.neutral.background },
      ]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
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
          Review & Pay
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Asego Wallet Balance */}
        <View
          style={[
            styles.walletContainer,
            { backgroundColor: getWalletBackgroundColor() },
          ]}
        >
          <Ionicons
            name="wallet-outline"
            size={24}
            color={getWalletTextColor()}
            style={styles.walletIcon}
          />
          <Text
            style={[styles.walletText, { color: getWalletTextColor() }]}
          >
            Asego Wallet Balance ₹{walletBalance}
          </Text>
        </View>

        {/* Invoice Type */}
        <View style={[styles.section,{marginBottom:13}]}>
          <Text
            style={[
              styles.sectionLabel,
              { color: theme.colors.neutral.gray900 },
            ]}
          >
            Invoice Type
          </Text>
          <View style={[styles.radioGroup,{marginTop:6}]}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setInvoiceType('passenger')}
            >
              <View
                style={[
                  styles.radioButton,
                  {
                    borderColor:
                      invoiceType === 'passenger'
                        ? theme.colors.primary.main
                        : theme.colors.neutral.gray400,
                  },
                ]}
              >
                {invoiceType === 'passenger' && (
                  <View
                    style={[
                      styles.radioButtonInner,
                      { backgroundColor: theme.colors.primary.main },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.radioLabel,
                  { color: theme.colors.neutral.gray900 },
                ]}
              >
                Passenger Wise
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setInvoiceType('tap')}
            >
              <View
                style={[
                  styles.radioButton,
                  {
                    borderColor:
                      invoiceType === 'tap'
                        ? theme.colors.primary.main
                        : theme.colors.neutral.gray400,
                  },
                ]}
              >
                {invoiceType === 'tap' && (
                  <View
                    style={[
                      styles.radioButtonInner,
                      { backgroundColor: theme.colors.primary.main },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.radioLabel,
                  { color: theme.colors.neutral.gray900 },
                ]}
              >
                TAP Wise
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trip Details */}
        <CollapsibleSection
          title="Trip Details"
          icon={
            <Ionicons
              name="airplane"
              size={20}
              color={theme.colors.primary.main}
            />
          }
          isExpanded={expandedSections.tripDetails}
          onToggle={() => toggleSection('tripDetails')}
        >
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.neutral.gray500 }]}>
              TRIP TYPE
            </Text>
            <View style={styles.detailValue}>
              <Ionicons name="briefcase-outline" size={16} color={theme.colors.neutral.gray600} />
              <Text style={[styles.detailText, { color: theme.colors.neutral.gray900 }]}>
                {tripData.type}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.neutral.gray500 }]}>
              DESTINATION
            </Text>
            <View style={styles.detailValue}>
              <Ionicons name="airplane-outline" size={16} color={theme.colors.neutral.gray600} />
              <Text style={[styles.detailText, { color: theme.colors.neutral.gray900 }]}>
                {tripData.destination}
              </Text>
            </View>
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateColumn}>
              <Text style={[styles.detailLabel, { color: theme.colors.neutral.gray500 }]}>
                START DATE
              </Text>
              <View style={styles.detailValue}>
                <Ionicons name="calendar-outline" size={16} color={theme.colors.neutral.gray600} />
                <Text style={[styles.detailText, { color: theme.colors.neutral.gray900 }]}>
                  {tripData.startDate}
                </Text>
              </View>
            </View>

            <View style={styles.dateColumn}>
              <Text style={[styles.detailLabel, { color: theme.colors.neutral.gray500 }]}>
                END DATE
              </Text>
              <View style={styles.detailValue}>
                <Ionicons name="calendar-outline" size={16} color={theme.colors.neutral.gray600} />
                <Text style={[styles.detailText, { color: theme.colors.neutral.gray900 }]}>
                  {tripData.endDate}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.neutral.gray500 }]}>
              NUMBER OF TRIP DAYS
            </Text>
            <View style={styles.detailValue}>
              <Ionicons name="sunny-outline" size={16} color={theme.colors.neutral.gray600} />
              <Text style={[styles.detailText, { color: theme.colors.neutral.gray900 }]}>
                {tripData.days}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.neutral.gray500 }]}>
              NUMBER OF TRAVELLERS
            </Text>
            <View style={styles.detailValue}>
              <Ionicons name="people-outline" size={16} color={theme.colors.neutral.gray600} />
              <Text style={[styles.detailText, { color: theme.colors.neutral.gray900 }]}>
                {tripData.travellers}
              </Text>
            </View>
          </View>
        </CollapsibleSection>

        {/* Traveller Details */}
        {travellerData.map((traveller, index) => (
          <CollapsibleSection
            key={traveller.id}
            title={traveller.name}
            icon={
              <Ionicons
                name="person"
                size={20}
                color={theme.colors.primary.main}
              />
            }
            isExpanded={expandedSections[`traveller${traveller.id}` as keyof typeof expandedSections]}
            onToggle={() => toggleSection(`traveller${traveller.id}` as keyof typeof expandedSections)}
          >
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.neutral.gray500 }]}>
                FULL NAME
              </Text>
              <Text style={[styles.detailText, { color: theme.colors.neutral.gray900 }]}>
                {traveller.fullName}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.neutral.gray500 }]}>
                DATE OF BIRTH
              </Text>
              <Text style={[styles.detailText, { color: theme.colors.neutral.gray900 }]}>
                {traveller.dateOfBirth}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.neutral.gray500 }]}>
                EMAIL ADDRESS
              </Text>
              <Text style={[styles.detailText, { color: theme.colors.neutral.gray900 }]}>
                {traveller.email}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.neutral.gray500 }]}>
                MOBILE NUMBER
              </Text>
              <Text style={[styles.detailText, { color: theme.colors.neutral.gray900 }]}>
                {traveller.mobile}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.neutral.gray500 }]}>
                INSURER
              </Text>
              <Text style={[styles.detailText, { color: theme.colors.neutral.gray900 }]}>
                {traveller.insurer}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.neutral.gray500 }]}>
                SUM INSURED
              </Text>
              <Text style={[styles.detailText, { color: theme.colors.neutral.gray900 }]}>
                {traveller.sumInsured}
              </Text>
            </View>
          </CollapsibleSection>
        ))}

        {/* Convenience Percentage */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              { color: theme.colors.neutral.gray900 },
            ]}
          >
            Convenience Percentage
          </Text>
          <TextInput
            placeholder="Convenience Percentage"
            value={conveniencePercentage}
            onChangeText={setConveniencePercentage}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {/* Discount */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              { color: theme.colors.neutral.gray900 },
            ]}
          >
            Discount
          </Text>
          <TextInput
            placeholder="Discount"
            value={discount}
            onChangeText={setDiscount}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {/* Payment Details */}
        <View
          style={[
            styles.paymentDetailsContainer,
            {
              backgroundColor: theme.colors.neutral.gray100,
              borderColor: theme.colors.neutral.gray300,
            },
          ]}
        >
          <View style={styles.paymentHeader}>
            <Ionicons
              name="card-outline"
              size={20}
              color={theme.colors.primary.main}
            />
            <Text
              style={[
                styles.paymentTitle,
                { color: theme.colors.neutral.gray900 },
              ]}
            >
              Payment Details
            </Text>
          </View>

          <View style={styles.paymentRow}>
            <Text
              style={[
                styles.paymentLabel,
                { color: theme.colors.neutral.gray500 },
              ]}
            >
              Convenience Fees
            </Text>
            <Text
              style={[
                styles.paymentValue,
                { color: theme.colors.neutral.gray900 },
              ]}
            >
              ₹{convenienceFees}
            </Text>
          </View>
          <Text
            style={[
              styles.paymentSubtext,
              { color: theme.colors.neutral.gray500 },
            ]}
          >
            (Including 18% GST)
          </Text>

          <View style={styles.paymentRow}>
            <Text
              style={[
                styles.paymentLabel,
                { color: theme.colors.neutral.gray500 },
              ]}
            >
              Platform Fees
            </Text>
            <Text
              style={[
                styles.paymentValue,
                { color: theme.colors.neutral.gray900 },
              ]}
            >
              ₹{platformFees}
            </Text>
          </View>
          <Text
            style={[
              styles.paymentSubtext,
              { color: theme.colors.neutral.gray500 },
            ]}
          >
            (Including 18% GST)
          </Text>

          <View style={styles.paymentRow}>
            <Text
              style={[
                styles.paymentLabel,
                { color: theme.colors.neutral.gray500 },
              ]}
            >
              Subtotal
            </Text>
            <Text
              style={[
                styles.paymentValue,
                { color: theme.colors.neutral.gray900 },
              ]}
            >
              ₹{subtotal.toLocaleString()}
            </Text>
          </View>

          <View style={styles.paymentRow}>
            <Text
              style={[
                styles.paymentLabel,
                { color: theme.colors.neutral.gray500 },
              ]}
            >
              Discount
            </Text>
            <Text
              style={[
                styles.paymentValue,
                { color: theme.colors.neutral.gray900 },
              ]}
            >
              ₹{discountAmount}
            </Text>
          </View>

          <View
            style={[
              styles.paymentDivider,
              { borderColor: theme.colors.neutral.gray200 },
            ]}
          />

          <View style={styles.paymentRow}>
            <Text
              style={[
                styles.totalLabel,
                { color: theme.colors.neutral.gray900 },
              ]}
            >
              Total
            </Text>
            <Text
              style={[
                styles.totalValue,
                { color: theme.colors.neutral.gray900 },
              ]}
            >
              ₹{total.toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Proceed to Payment Button */}
      <View
        style={[
          styles.buttonContainer,
          { backgroundColor: theme.colors.neutral.background },
        ]}
      >
        <Button
          title="Proceed To Payment"
          onPress={handleProceedToPayment}
          fullWidth
          size="large"
          style={[
            styles.proceedButton,
            { backgroundColor: theme.colors.primary.main },
          ]}
        />
      </View>
    </View>
  );
};