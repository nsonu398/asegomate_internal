// app/home.tsx
import { Button } from '@/app/presentation/components/ui/Button';
import { useAuth } from '@/app/presentation/contexts/AuthContext';
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.neutral.background }]}>
      <Text style={[styles.welcomeText, { color: theme.colors.neutral.gray800 }]}>
        Welcome back, {user?.name}!
      </Text>
      <Text style={[styles.emailText, { color: theme.colors.neutral.gray600 }]}>
        {user?.email}
      </Text>
      <Button
        title="Logout"
        onPress={logout}
        variant="outlined"
        color="error"
        style={styles.logoutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    marginBottom: 32,
  },
  logoutButton: {
    marginTop: 16,
  },
});