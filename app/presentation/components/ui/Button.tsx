// src/presentation/components/ui/Button.tsx
import { theme } from '@/app/theme';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle
} from 'react-native';

type ButtonVariant = 'contained' | 'outlined' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  title: string;
}

interface ButtonPadding {
  paddingVertical: number;
  paddingHorizontal: number;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  startIcon,
  endIcon,
  fullWidth = false,
  loading = false,
  disabled = false,
  title,
  style,
  ...rest
}) => {
  const getBackgroundColor = (): string => {
    if (variant === 'text' || variant === 'outlined') return 'transparent';
    if (disabled) return theme.colors.neutral.gray300;
    
    switch (color) {
      case 'primary': return theme.colors.primary.main;
      case 'secondary': return theme.colors.secondary.main;
      case 'success': return theme.colors.feedback.success;
      case 'error': return theme.colors.feedback.error;
      case 'warning': return theme.colors.feedback.warning;
      case 'info': return theme.colors.feedback.info;
      default: return theme.colors.primary.main;
    }
  };

  const getTextColor = (): string => {
    if (disabled) return theme.colors.neutral.gray500;
    if (variant === 'contained') {
      return color === 'secondary' || color === 'warning' 
        ? theme.colors.neutral.black 
        : theme.colors.neutral.white;
    }
    
    switch (color) {
      case 'primary': return theme.colors.primary.main;
      case 'secondary': return theme.colors.secondary.main;
      case 'success': return theme.colors.feedback.success;
      case 'error': return theme.colors.feedback.error;
      case 'warning': return theme.colors.feedback.warning;
      case 'info': return theme.colors.feedback.info;
      default: return theme.colors.primary.main;
    }
  };

  const getBorderColor = (): string => {
    if (variant !== 'outlined') return 'transparent';
    if (disabled) return theme.colors.neutral.gray300;
    
    switch (color) {
      case 'primary': return theme.colors.primary.main;
      case 'secondary': return theme.colors.secondary.main;
      case 'success': return theme.colors.feedback.success;
      case 'error': return theme.colors.feedback.error;
      case 'warning': return theme.colors.feedback.warning;
      case 'info': return theme.colors.feedback.info;
      default: return theme.colors.primary.main;
    }
  };

  const getPadding = (): ButtonPadding => {
    switch (size) {
      case 'small': return { paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.sm };
      case 'medium': return { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md };
      case 'large': return { paddingVertical: 14, paddingHorizontal: theme.spacing.lg };
      default: return { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md };
    }
  };

  const buttonStyles: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor(),
    borderWidth: variant === 'outlined' ? 1 : 0,
    width: fullWidth ? '100%' : 'auto',
    ...getPadding(),
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyles, style as ViewStyle]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={getTextColor()} 
            style={styles.loader} 
          />
        ) : (
          <>
            {startIcon && <View style={styles.startIcon}>{startIcon}</View>}
            <Text style={[styles.text, { color: getTextColor() } as TextStyle]}>
              {title}
            </Text>
            {endIcon && <View style={styles.endIcon}>{endIcon}</View>}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.border.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 600,
  },
  loader: {
    marginRight: theme.spacing.xs,
  },
  startIcon: {
    marginRight: theme.spacing.xs,
  },
  endIcon: {
    marginLeft: theme.spacing.xs,
  },
});