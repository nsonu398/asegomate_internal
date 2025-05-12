// app/presentation/screens/home/HomeContent.tsx
import { ContentCarousel } from '@/app/presentation/components/home/ContentCarousel';
import { DashboardCards } from '@/app/presentation/components/home/DashboardCards';
import { DocsRepository } from '@/app/presentation/components/home/DocsRepository';
import { HomeHeader } from '@/app/presentation/components/home/HomeHeader';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export const HomeContent: React.FC = () => {
  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <HomeHeader />
      <DashboardCards />
      <DocsRepository />
      <ContentCarousel />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
});