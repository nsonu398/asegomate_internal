// app/presentation/components/home/ContentCarousel.tsx
import React from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface ContentCard {
  id: string;
  title: string;
  subtitle?: string;
  image?: any;
  backgroundColor: string;
}

const contentCards: ContentCard[] = [
  {
    id: '1',
    title: 'AVOIDED MISHAPS:\nHow to Safeguard Your\nTravel Investment',
    backgroundColor: '#1A3B5C',
  },
  {
    id: '2',
    title: '5 Things\nYou need to look out for\nWhen Buying Online\n\nTravel Insurance',
    backgroundColor: '#4DA3CF',
  },
  {
    id: '3',
    title: "TOURIST VISA FOR THE\nUSA FROM INDIA – HERE'S\nHOW TO GET IT RIGHT",
    backgroundColor: '#00B5AD',
  },
];

export const ContentCarousel: React.FC = () => {
  const renderContentCard = ({ item, index }: { item: ContentCard; index: number }) => (
    <View
      style={[
        styles.contentCard,
        { backgroundColor: item.backgroundColor },
        index === 0 && styles.firstCard,
        index === contentCards.length - 1 && styles.lastCard,
      ]}
    >
      <View style={styles.contentCardBrand}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.brandLogo}
          resizeMode="contain"
        />
      </View>
      {item.image && (
        <Image
          source={item.image}
          style={styles.contentCardImage}
          resizeMode="contain"
        />
      )}
      <Text style={styles.contentCardTitle}>{item.title}</Text>
      {item.subtitle && (
        <Text style={styles.contentCardSubtitle}>{item.subtitle}</Text>
      )}
    </View>
  );

  return (
    <FlatList
      data={contentCards}
      renderItem={renderContentCard}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={width * 0.85}
      decelerationRate="fast"
      contentContainerStyle={styles.contentCarousel}
    />
  );
};

const styles = StyleSheet.create({
  contentCarousel: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  contentCard: {
    width: width * 0.85,
    height: 200,
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  firstCard: {
    marginLeft: 0,
  },
  lastCard: {
    marginRight: 0,
  },
  contentCardBrand: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  brandLogo: {
    width: 80,
    height: 20,
  },
  contentCardImage: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 180,
    height: 180,
  },
  contentCardTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 60,
  },
  contentCardSubtitle: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 8,
    opacity: 0.9,
  },
});