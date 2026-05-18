import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { createPost } from '../api/community';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { colors, font, spacing, radius } from '../theme';

const CATEGORIES = ['general', 'question', 'showcase', 'resource', 'announcement'];

export default function CreatePostScreen({ navigation }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Error', 'Title and body are required');
      return;
    }
    setLoading(true);
    try {
      await createPost({ title: title.trim(), body: body.trim(), category, author: user._id });
      navigation.goBack();
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
        <Text style={styles.label}>Category</Text>
        <View style={styles.catRow}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.catChip, category === c && styles.catChipActive]}
              onPress={() => setCategory(c)}
            >
              <Text style={[styles.catText, category === c && styles.catTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="Post title..."
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Body</Text>
        <TextInput
          style={styles.bodyInput}
          placeholder="Share your thoughts..."
          placeholderTextColor={colors.textMuted}
          value={body}
          onChangeText={setBody}
          multiline
          textAlignVertical="top"
        />

        <Button title="Post" onPress={handleSubmit} loading={loading} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, flexGrow: 1 },
  label: { color: colors.textMuted, fontSize: font.sm, marginBottom: 8, marginTop: spacing.md },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.cardBorder,
  },
  catChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  catText: { color: colors.textMuted, fontSize: font.sm, textTransform: 'capitalize' },
  catTextActive: { color: colors.white, fontWeight: '600' },
  titleInput: {
    backgroundColor: colors.card, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.cardBorder,
    color: colors.text, fontSize: font.base,
    paddingHorizontal: spacing.md, paddingVertical: 12,
  },
  bodyInput: {
    backgroundColor: colors.card, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.cardBorder,
    color: colors.text, fontSize: font.base,
    paddingHorizontal: spacing.md, paddingVertical: 12,
    minHeight: 160,
  },
});
