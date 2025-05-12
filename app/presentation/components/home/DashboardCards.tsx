// app/presentation/components/home/DashboardCards.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

interface DashboardCard {
  id: string;
  title: string;
  backgroundColor: string;
  borderColor: string;
  image?: any;
  route?: string;
}

const cards: DashboardCard[] = [
  {
    id: '1',
    title: 'My\nSmartboard',
    backgroundColor: '#FFE8E8',
    borderColor: '#F07238',
    route: '/smartboard',
  },
  {
    id: '2',
    title: 'Travel Assistance\n& Insurance',
    backgroundColor: '#E0FFFE',
    borderColor: '#00B5AD',
    route: '/travel-assistance',
  },
  {
    id: '3',
    title: 'Get Quote',
    backgroundColor: '#E0FFFE',
    borderColor: '#00B5AD',
    route: '/quotes/get',
  },
  {
    id: '4',
    title: 'Claim & Track',
    backgroundColor: '#FFE8E8',
    borderColor: '#F07238',
    route: '/claims',
  },
];

export const DashboardCards: React.FC = () => {
  const handleCardPress = (card: DashboardCard) => {
    // Handle navigation here
    console.log('Navigate to:', card.route);
  };

  return (
    <View style={styles.dashboardGrid}>
      {cards.map((card) => (
        <TouchableOpacity
          key={card.id}
          style={[
            styles.dashboardCard,
            { 
              backgroundColor: card.backgroundColor,
              borderColor: card.borderColor,
              borderWidth: 0.52,
            },
          ]}
          activeOpacity={0.8}
          onPress={() => handleCardPress(card)}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <View style={styles.cardArrow}>
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </View>
          </View>
          <View style={styles.cardImageContainer}>
            <Image
              source={
                card.id === '1'
                  ? require('@/assets/images/icon-my-smartboard-logo.png')
                  : card.id === '2'
                  ? require('@/assets/images/icon-travel-insurance-logo.png')
                  : card.id === '3'
                  ? require('@/assets/images/icon-get-quote-logo.png')
                  : require('@/assets/images/icon-claim-track-logo.png')
              }
              style={styles.cardImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
  },
  dashboardCard: {
    width: cardWidth - 8,
    height: 175,
    borderRadius: 20,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  cardArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImageContainer: {
    position: 'absolute',
    right: -10,
    bottom: -20,
    width: 130,
    height: 130,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
});