import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, font, spacing } from '../theme';

export default function Input({ label, secureTextEntry, error, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.row, error && { borderColor: colors.danger }]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry && !visible}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.eye}>
            <Ionicons name={visible ? 'eye-off' : 'eye'} size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: { color: colors.textMuted, fontSize: font.sm, marginBottom: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: font.base,
    paddingVertical: 12,
  },
  eye: { padding: 4 },
  error: { color: colors.danger, fontSize: font.sm, marginTop: 4 },
});
