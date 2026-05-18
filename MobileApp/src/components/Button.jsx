import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, radius, font } from '../theme';

export default function Button({ title, onPress, loading, variant = 'primary', style }) {
  const bg = variant === 'outline' ? 'transparent' : colors.primary;
  const border = variant === 'outline' ? colors.primary : 'transparent';
  const textColor = colors.white;

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: bg, borderColor: border, borderWidth: variant === 'outline' ? 1.5 : 0 }, style]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color={colors.white} />
        : <Text style={[styles.label, { color: textColor }]}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: font.base,
    fontWeight: '600',
  },
});
