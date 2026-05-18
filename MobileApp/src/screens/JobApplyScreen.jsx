import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { applyJob } from '../api/misc';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { colors, font, spacing, radius } from '../theme';

export default function JobApplyScreen({ route, navigation }) {
  const { job } = route.params;
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    experience: '',
    course: '',
    coverLetter: '',
  });
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleApply = async () => {
    if (!form.name || !form.email) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }
    setLoading(true);
    try {
      await applyJob({ ...form, jobId: job._id });
      Alert.alert('Applied!', 'Your application has been submitted.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Job info */}
        <View style={styles.jobCard}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          {job.location && <Text style={styles.jobMeta}>{job.location} · {job.level}</Text>}
        </View>

        <Text style={styles.sectionTitle}>Your Application</Text>
        <Input label="Full Name" value={form.name} onChangeText={set('name')} placeholder="John Doe" />
        <Input label="Email" value={form.email} onChangeText={set('email')} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
        <Input label="Years of Experience" value={form.experience} onChangeText={set('experience')} placeholder="e.g. 2 years" keyboardType="numeric" />
        <Input label="Relevant Course / Qualification" value={form.course} onChangeText={set('course')} placeholder="e.g. Full Stack Development" />
        <Input label="Cover Letter" value={form.coverLetter} onChangeText={set('coverLetter')} placeholder="Tell us why you're a great fit..." multiline />

        <Button title="Submit Application" onPress={handleApply} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, flexGrow: 1 },
  jobCard: {
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.cardBorder,
    padding: spacing.md, marginBottom: spacing.lg,
  },
  jobTitle: { color: colors.text, fontSize: font.lg, fontWeight: '700' },
  jobMeta: { color: colors.textMuted, fontSize: font.sm, marginTop: 4 },
  sectionTitle: { color: colors.text, fontSize: font.base, fontWeight: '700', marginBottom: spacing.md },
});
