import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { forgotPassword } from '../../api/auth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, font, spacing } from '../../theme';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return Alert.alert('Error', 'Enter your email');
    setLoading(true);
    try {
      await forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reset Password</Text>
      {sent ? (
        <Text style={styles.success}>
          Check your email for a reset link. Follow the instructions to set a new password.
        </Text>
      ) : (
        <>
          <Text style={styles.sub}>Enter your email and we'll send you a reset link.</Text>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button title="Send Reset Link" onPress={handleSubmit} loading={loading} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, paddingTop: 80 },
  heading: { color: colors.text, fontSize: font.xl, fontWeight: '700', marginBottom: spacing.sm },
  sub: { color: colors.textMuted, fontSize: font.md, marginBottom: spacing.lg },
  success: { color: colors.success, fontSize: font.base, lineHeight: 24 },
});
