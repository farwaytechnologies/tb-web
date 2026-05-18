import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing } from '../theme';

export default function EmptyState({ icon = 'folder-open-outline', message = 'Nothing here yet' }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={56} color={colors.cardBorder} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  text: { color: colors.textMuted, fontSize: font.base, marginTop: spacing.md, textAlign: 'center' },
});
