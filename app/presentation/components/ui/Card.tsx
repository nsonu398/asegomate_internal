// src/presentation/components/ui/Card.tsx
import { theme } from '@/app/theme';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  elevation?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Card: React.FC<CardProps> = ({
  elevation = 'sm',
  bordered = false,
  padding = 'md',
  style,
  children,
  ...rest
}) => {
  const getShadow = () => {
    if (elevation === 'none') return {};
    return theme.shadows[elevation];
  };

  const getPadding = () => {
    if (padding === 'none') return 0;
    return theme.spacing[padding];
  };

  return (
    <View
      style={[
        styles.card,
        getShadow(),
        {
          borderWidth: bordered ? theme.border.width.thin : 0,
          padding: getPadding(),
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.border.radius.md,
    borderColor: theme.colors.neutral.gray200,
  },
});