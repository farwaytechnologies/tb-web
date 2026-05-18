import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, font, spacing, radius } from '../../theme';

const ROLES = ['student', 'tutor'];

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', referralCode: '' });
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Error', 'Name, email and password are required');
      return;
    }
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      Alert.alert('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.sub}>Join TechBorg and start learning</Text>

        <Input label="Full Name" value={form.name} onChangeText={set('name')} placeholder="John Doe" />
        <Input label="Email" value={form.email} onChangeText={set('email')} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
        <Input label="Password" value={form.password} onChangeText={set('password')} placeholder="Min 6 characters" secureTextEntry />
        <Input label="Referral Code (optional)" value={form.referralCode} onChangeText={set('referralCode')} placeholder="Enter referral code" autoCapitalize="none" />

        {/* Role selector */}
        <Text style={styles.roleLabel}>I am a</Text>
        <View style={styles.roleRow}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.roleBtn, form.role === r && styles.roleBtnActive]}
              onPress={() => set('role')(r)}
            >
              <Text style={[styles.roleText, form.role === r && styles.roleTextActive]}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button title="Create Account" onPress={handleRegister} loading={loading} style={{ marginTop: spacing.md }} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.link}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.lg, paddingTop: 60 },
  heading: { color: colors.text, fontSize: font.xxl, fontWeight: '800', marginBottom: 4 },
  sub: { color: colors.textMuted, fontSize: font.md, marginBottom: spacing.xl },
  roleLabel: { color: colors.textMuted, fontSize: font.sm, marginBottom: 8 },
  roleRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  roleBtn: {
    flex: 1, paddingVertical: 10, borderRadius: radius.sm,
    borderWidth: 1.5, borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  roleBtnActive: { borderColor: colors.primary, backgroundColor: colors.primary + '22' },
  roleText: { color: colors.textMuted, fontWeight: '600' },
  roleTextActive: { color: colors.primary },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { color: colors.textMuted, fontSize: font.md },
  link: { color: colors.primary, fontSize: font.md, fontWeight: '600' },
});
