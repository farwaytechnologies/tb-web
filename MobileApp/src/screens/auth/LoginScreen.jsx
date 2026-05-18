import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { colors, font, spacing, radius } from '../../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err) {
      Alert.alert('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[colors.bg, '#1a1040']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Ionicons name="hardware-chip-outline" size={40} color={colors.primary} />
            </View>
            <Text style={styles.brand}>TechBorg</Text>
            <Text style={styles.tagline}>Learn. Build. Grow.</Text>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Text style={styles.heading}>Welcome back</Text>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotWrap}
            >
              <Text style={styles.forgot}>Forgot password?</Text>
            </TouchableOpacity>
            <Button title="Sign In" onPress={handleLogin} loading={loading} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  logoWrap: { alignItems: 'center', marginBottom: spacing.xl },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.primary + '55',
  },
  brand: { color: colors.text, fontSize: font.xxl, fontWeight: '800' },
  tagline: { color: colors.textMuted, fontSize: font.md, marginTop: 4 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  heading: { color: colors.text, fontSize: font.xl, fontWeight: '700', marginBottom: spacing.lg },
  forgotWrap: { alignSelf: 'flex-end', marginBottom: spacing.md },
  forgot: { color: colors.primary, fontSize: font.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { color: colors.textMuted, fontSize: font.md },
  link: { color: colors.primary, fontSize: font.md, fontWeight: '600' },
});
