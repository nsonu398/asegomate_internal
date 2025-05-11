// app/presentation/screens/home/HomeScreen.tsx
import { useAuth } from '@/app/presentation/contexts/AuthContext';
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with padding

interface DashboardCard {
  id: string;
  title: string;
  backgroundColor: string;
  borderColor: string;
  image?: any;
  type: 'large' | 'medium';
  route?: string;
}

interface RepositoryTab {
  id: string;
  title: string;
  route?: string;
}

interface ContentCard {
  id: string;
  title: string;
  subtitle?: string;
  image?: any;
  backgroundColor: string;
}

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const dashboardCards: DashboardCard[] = [
    {
        id: '1',
        title: 'My\nSmartboard',
        backgroundColor: '#FFE8E8',
        borderColor: '#F07238',
        type: 'medium',
        route: '/smartboard',
      },
      {
        id: '2',
        title: 'Travel Assistance\n& Insurance',
        backgroundColor: '#E0FFFE',
        borderColor: '#00B5AD',
        type: 'medium',
        route: '/travel-assistance',
      },
      {
        id: '3',
        title: 'Get Quote',
        backgroundColor: '#E0FFFE',
        borderColor: '#00B5AD',
        type: 'medium',
        route: '/quotes/get',
      },
      {
        id: '4',
        title: 'Claim & Track',
        backgroundColor: '#FFE8E8',
        borderColor: '#F07238',
        type: 'medium',
        route: '/claims',
      },
  ];

  const repositoryTabs: RepositoryTab[] = [
    { id: '1', title: 'Sales', route: '/docs/sales' },
    { id: '2', title: 'Claims', route: '/docs/claims' },
    { id: '3', title: 'Marketing', route: '/docs/marketing' },
  ];

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

  const renderDashboardCard = ({ item }: { item: DashboardCard }) => (
    <TouchableOpacity
      style={[
        styles.dashboardCard,
        { 
            backgroundColor: item.backgroundColor,
            borderColor: item.borderColor,
            borderWidth: 0.52,
          },
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.cardArrow}>
          <Ionicons name="arrow-forward" size={20} color="#000" />
        </View>
      </View>
      <View style={styles.cardImageContainer}>
        <Image
          source={
            item.id === '1'
              ? require('@/assets/images/icon-my-smartboard-logo.png')
              : item.id === '2'
              ? require('@/assets/images/icon-travel-insurance-logo.png')
              : item.id === '3'
              ? require('@/assets/images/icon-get-quote-logo.png')
              : require('@/assets/images/icon-claim-track-logo.png')
          }
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.neutral.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.neutral.background} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={[styles.greeting, { color: theme.colors.neutral.gray900 }]}>
                Hey, {user?.name?.split(' ')[0] || 'User'}
              </Text>
              <Text style={[styles.tasksText, { color: theme.colors.neutral.gray600 }]}>
                You have <Text style={styles.tasksCount}>3 tasks</Text> to work on today
              </Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications" size={24} color="#000" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton}>
                <View style={[styles.profileAvatar, { backgroundColor: '#FFE8E8' }]}>
                  <Text style={styles.profileAvatarText}>
                    {user?.name?.charAt(0).toUpperCase() || 'S'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Dashboard Cards */}
        <View style={styles.dashboardGrid}>
          {dashboardCards.map((card) => (
            <View key={card.id} style={styles.cardWrapper}>
              {renderDashboardCard({ item: card })}
            </View>
          ))}
        </View>

        {/* Docs Repository */}
        <View style={[styles.docsRepository, { backgroundColor: '#EBF7FF', borderColor:'#0090F4', borderWidth:0.52 }]}>
          <Text style={styles.docsTitle}>Docs Repository</Text>
          <View style={styles.docsTabs}>
            {repositoryTabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.docsTab, { backgroundColor: '#FFFFFF' }]}
              >
                <Text style={styles.docsTabText}>{tab.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.docsImageContainer}>
            <Image
              source={require('@/assets/images/icon-docs-repo-logo.png')}
              style={styles.docsImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Content Cards Carousel */}
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
      </ScrollView>

      {/* Bottom Navigation with FAB */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={24} color={theme.colors.primary.main} />
            <Text style={[styles.navText, { color: theme.colors.primary.main }]}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="grid" size={24} color="#999999" />
            <Text style={styles.navText}>Smartboard</Text>
          </TouchableOpacity>
          
          <View style={styles.fabContainer}>
            <TouchableOpacity style={styles.fab}>
              <Ionicons name="calculator" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="list" size={24} color="#999999" />
            <Text style={styles.navText}>Services</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="ellipsis-horizontal-circle" size={24} color="#999999" />
            <Text style={styles.navText}>Others</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  tasksText: {
    fontSize: 16,
  },
  tasksCount: {
    color: '#00B5AD',
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  profileButton: {},
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6D00',
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
  },
  cardWrapper: {
    width: cardWidth - 8,
  },
  dashboardCard: {
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
  docsRepository: {
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  docsTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  docsTabs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  docsTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    // Shadow for iOS
    shadowColor: '#006FFD33',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 5.84,
    // Elevation for Android
    elevation: 5,
  },
  docsTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  docsImageContainer: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    width: 100,
    height: 100,
  },
  docsImage: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    paddingBottom: 100, // Add padding to prevent content from being hidden behind bottom nav
  },
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
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
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
    color: '#999999',
  },
  fabContainer: {
    width: 70,              // Increased from 60
    height: 60,
    marginHorizontal: 10,
    alignItems: 'center',   // Added for centering
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 35,
    backgroundColor: '#FF6D00',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25, // Raise the FAB above the navbar
    elevation: 8,
    shadowColor: '#FF6D00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});