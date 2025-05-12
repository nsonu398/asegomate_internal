// app/presentation/screens/smartboard/SmartboardScreen.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const SmartboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smartboard Screen</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
});