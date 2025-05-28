// app/presentation/screens/createPolicy/PolicyPaymentScreen.tsx
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Interface for the component's props (though none are strictly needed for this design)
interface PolicyPaymentScreenProps {}

export const PolicyPaymentScreen: React.FC<PolicyPaymentScreenProps> = () => {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handlePayWithAsegoWallet = () => {
    console.log('Paying with Asego Wallet');
    // Implement logic for Asego Wallet payment
  };

  const handlePayOnline = () => {
    console.log('Paying Online');
    // Implement logic for online payment (e.g., navigate to a webview or payment gateway)
  };

  const handleSendPaymentLink = () => {
    console.log('Sending Payment Link');
    // Implement logic to send a payment link
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.neutral.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.neutral.background}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.neutral.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.neutral.gray900} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.colors.neutral.gray900 }]}>
            Review & Pay
          </Text>
        </View>

        {/* Empty right side to balance the header, as per design */}
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Payment Options */}
      <View style={styles.paymentOptionsContainer}>
        {/* Pay with Asego Wallet */}
        <TouchableOpacity
          style={[
            styles.paymentOptionCard,
            {
              backgroundColor: theme.colors.neutral.white,
              borderColor: theme.colors.neutral.gray200,
            },
          ]}
          onPress={handlePayWithAsegoWallet}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary.main + '20' }]}>
            <Ionicons name="wallet-outline" size={24} color={theme.colors.primary.main} />
          </View>
          <View style={styles.paymentOptionTextContainer}>
            <Text style={[styles.paymentOptionTitle, { color: theme.colors.neutral.gray900 }]}>
              Pay with Asego Wallet
            </Text>
            <View style={[
              styles.walletBalanceContainer,
              { backgroundColor: '#FEE8E8', borderColor: '#FEE8E8' } // Specific colors from image
            ]}>
              <Ionicons name="card-outline" size={16} color="#E74C3C" />
              <Text style={[styles.walletBalanceText, { color: '#E74C3C' }]}>
                Asego Wallet Balance ₹0.00
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Pay Online */}
        <TouchableOpacity
          style={[
            styles.paymentOptionCard,
            {
              backgroundColor: theme.colors.neutral.white,
              borderColor: theme.colors.neutral.gray200,
              marginTop: 16, // Spacing between cards
            },
          ]}
          onPress={handlePayOnline}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary.main + '20' }]}>
            <Ionicons name="card-outline" size={24} color={theme.colors.primary.main} />
          </View>
          <View style={styles.paymentOptionTextContainer}>
            <Text style={[styles.paymentOptionTitle, { color: theme.colors.neutral.gray900 }]}>
              Pay Online
            </Text>
          </View>
        </TouchableOpacity>

        {/* Send Payment Link */}
        <TouchableOpacity
          style={[
            styles.paymentOptionCard,
            {
              backgroundColor: theme.colors.neutral.white,
              borderColor: theme.colors.neutral.gray200,
              marginTop: 16, // Spacing between cards
            },
          ]}
          onPress={handleSendPaymentLink}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary.main + '20' }]}>
            <Ionicons name="mail-outline" size={24} color={theme.colors.primary.main} />
          </View>
          <View style={styles.paymentOptionTextContainer}>
            <Text style={[styles.paymentOptionTitle, { color: theme.colors.neutral.gray900 }]}>
              Send Payment Link
            </Text>
          </View>
        </TouchableOpacity>
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
  headerRightPlaceholder: {
    width: 40, // To visually balance the back button on the left
  },
  paymentOptionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  paymentOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentOptionTextContainer: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  walletBalanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  walletBalanceText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});
