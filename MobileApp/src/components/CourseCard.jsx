import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, font, spacing } from '../theme';
import { BASE_URL } from '../api/client';

export default function CourseCard({ course, onPress }) {
  const imageUri = course.image
    ? (course.image.startsWith('http') ? course.image : `${BASE_URL}/${course.image}`)
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {imageUri
        ? <Image source={{ uri: imageUri }} style={styles.image} />
        : <View style={[styles.image, styles.placeholder]} />
      }
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.instructor} numberOfLines={1}>
          <Ionicons name="person-outline" size={12} color={colors.textMuted} /> {course.instructor || 'TechBorg'}
        </Text>
        <View style={styles.footer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{course.level || 'All Levels'}</Text>
          </View>
          <Text style={styles.price}>
            {course.price ? `₹${course.price}` : 'Free'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  image: { width: '100%', height: 160 },
  placeholder: { backgroundColor: colors.cardBorder },
  body: { padding: spacing.md },
  title: { color: colors.text, fontSize: font.base, fontWeight: '600', marginBottom: 4 },
  instructor: { color: colors.textMuted, fontSize: font.sm, marginBottom: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: {
    backgroundColor: colors.primaryDark + '33',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  badgeText: { color: colors.primary, fontSize: font.sm },
  price: { color: colors.success, fontWeight: '700', fontSize: font.base },
});
