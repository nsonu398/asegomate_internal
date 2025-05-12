// app/presentation/screens/MainScreen.tsx
import { BottomNavigation } from '@/app/presentation/components/navigation/BottomNavigation';
import React, { useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { CalculatorScreen } from './calculator/CalculatorScreen';
import { HomeContent } from './home/HomeContent';
import { OthersScreen } from './others/OthersScreen';
import { ServicesScreen } from './services/ServicesScreen';
import { SmartboardScreen } from './smartboard/SmartboardScreen';

export const MainScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeContent />;
      case 'smartboard':
        return <SmartboardScreen />;
      case 'services':
        return <ServicesScreen />;
      case 'others':
        return <OthersScreen />;
      case 'calculator':
        return <CalculatorScreen />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.content}>
        {renderContent()}
      </View>
      <BottomNavigation
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 100 : 90,
  },
});