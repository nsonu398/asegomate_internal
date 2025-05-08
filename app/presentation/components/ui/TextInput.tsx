// src/presentation/components/ui/TextInput.tsx
import { theme } from '@/app/theme';
import React, { useState } from 'react';
import {
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onEndIconPress?: () => void;
  fullWidth?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  startIcon,
  endIcon,
  onEndIconPress,
  fullWidth = true,
  style,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
        ]}
      >
        {startIcon && (
          <View style={styles.startIcon}>{startIcon}</View>
        )}
        <RNTextInput
          style={[styles.input, style]}
          placeholderTextColor={theme.colors.neutral.gray400}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        {endIcon && (
          <TouchableOpacity 
            style={styles.endIcon} 
            onPress={onEndIconPress}
            disabled={!onEndIconPress}
          >
            {endIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.gray700,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray300,
    borderRadius: theme.border.radius.md,
    backgroundColor: theme.colors.neutral.white,
    paddingHorizontal: theme.spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.gray800,
  },
  focusedInput: {
    borderColor: theme.colors.primary.main,
  },
  errorInput: {
    borderColor: theme.colors.feedback.error,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.feedback.error,
    marginTop: theme.spacing.xs,
  },
  startIcon: {
    marginRight: theme.spacing.xs,
  },
  endIcon: {
    marginLeft: theme.spacing.xs,
  },
});