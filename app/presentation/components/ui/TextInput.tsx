// app/presentation/components/ui/TextInput.tsx
import { useTheme } from '@/app/presentation/contexts/ThemeContext';
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
  const { theme } = useTheme();

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.neutral.gray900 }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.neutral.gray100,
            borderColor: error 
              ? theme.colors.feedback.error
              : isFocused 
              ? theme.colors.primary.main 
              : theme.colors.neutral.gray300,
            borderWidth: isFocused ? 1.1 : 0.8,
          }
        ]}
      >
        {startIcon && (
          <View style={styles.startIcon}>{startIcon}</View>
        )}
        <RNTextInput
          style={[styles.input, { color: theme.colors.neutral.gray900 }, style]}
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
        <Text style={[styles.errorText, { color: theme.colors.feedback.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  startIcon: {
    marginRight: 8,
  },
  endIcon: {
    marginLeft: 8,
  },
});