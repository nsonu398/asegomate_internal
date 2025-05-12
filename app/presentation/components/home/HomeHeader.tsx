// app/presentation/components/home/HomeHeader.tsx
import { useAuth } from '@/app/presentation/contexts/AuthContext';
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

export const HomeHeader: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
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
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    marginBottom: 20,
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
});