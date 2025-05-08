// src/theme/index.ts
import { border } from './border';
import { colors } from './colors';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  border,
};

export type Theme = typeof theme;