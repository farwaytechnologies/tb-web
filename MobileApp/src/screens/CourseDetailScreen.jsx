import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Image, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCourse, getEnrollments } from '../api/courses';
import { createPaymentOrder, verifyPayment } from '../api/misc';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import Button from '../components/Button';
import { colors, font, spacing, radius } from '../theme';
import { BASE_URL } from '../api/client';

export default function CourseDetailScreen({ route, navigation }) {
  const { courseId } = route.params;
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [cRes, eRes] = await Promise.all([
          getCourse(courseId),
          getEnrollments(user._id),
        ]);
        setCourse(cRes.data);
        const isEnrolled = (eRes.data || []).some(
          (e) => e.courseId?._id === courseId || e.courseId === courseId
        );
        setEnrolled(isEnrolled);
      } catch (_) {}
      setLoading(false);
    })();
  }, [courseId]);

  const handleEnroll = async () => {
    if (!course) return;
    if (course.price && course.price > 0) {
      // Paid course — initiate Razorpay (web-based via WebView or deep link)
      Alert.alert(
        'Payment Required',
        `This course costs ₹${course.price}. Payment will open in browser.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Proceed',
            onPress: () => navigation.navigate('Payment', { courseId, price: course.price, title: course.title }),
          },
        ]
      );
      return;
    }
    // Free course — direct enroll
    setEnrolling(true);
    try {
      const api = (await import('../api/courses')).enroll;
      await api({ userId: user._id, courseId, fullName: user.name, email: user.email, phone: user.phone || '' });
      setEnrolled(true);
      Alert.alert('Enrolled!', 'You have been enrolled in this course.');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!course) return (
    <View style={styles.container}>
      <Text style={styles.error}>Course not found</Text>
    </View>
  );

  const imageUri = course.image
    ? (course.image.startsWith('http') ? course.image : `${BASE_URL}/${course.image}`)
    : null;

  return (
    <ScrollView style={styles.container}>
      {imageUri
        ? <Image source={{ uri: imageUri }} style={styles.banner} />
        : <View style={[styles.banner, { backgroundColor: colors.card }]} />
      }

      <View style={styles.body}>
        <Text style={styles.title}>{course.title}</Text>

        <View style={styles.metaRow}>
          {course.level && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{course.level}</Text>
            </View>
          )}
          {course.duration && (
            <View style={styles.tag}>
              <Ionicons name="time-outline" size={12} color={colors.textMuted} />
              <Text style={styles.tagText}> {course.duration}</Text>
            </View>
          )}
        </View>

        {course.instructor && (
          <Text style={styles.instructor}>
            <Ionicons name="person-outline" size={14} color={colors.textMuted} /> {course.instructor}
          </Text>
        )}

        <Text style={styles.desc}>{course.description}</Text>

        {/* Modules */}
        {course.modules?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Course Content</Text>
            <Text style={styles.moduleCount}>
              {course.modules.length} modules · {course.modules.reduce((a, m) => a + (m.videos?.length || 0), 0)} lessons
            </Text>
            {course.modules.map((mod, i) => (
              <View key={i} style={styles.module}>
                <TouchableOpacity
                  style={styles.moduleHeader}
                  onPress={() => setExpanded(expanded === i ? null : i)}
                >
                  <Text style={styles.moduleName}>{mod.name}</Text>
                  <Ionicons
                    name={expanded === i ? 'chevron-up' : 'chevron-down'}
                    size={18} color={colors.textMuted}
                  />
                </TouchableOpacity>
                {expanded === i && mod.videos?.map((v, j) => (
                  <View key={j} style={styles.lesson}>
                    <Ionicons name="play-circle-outline" size={16} color={colors.primary} />
                    <Text style={styles.lessonTitle}>{v.title}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* CTA */}
      <View style={styles.cta}>
        {enrolled ? (
          <Button
            title="Continue Learning"
            onPress={() => navigation.navigate('CoursePlayer', { courseId, course })}
          />
        ) : (
          <Button
            title={course.price ? `Enroll for ₹${course.price}` : 'Enroll for Free'}
            onPress={handleEnroll}
            loading={enrolling}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  banner: { width: '100%', height: 220 },
  body: { padding: spacing.lg },
  title: { color: colors.text, fontSize: font.xl, fontWeight: '700', marginBottom: spacing.sm },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: spacing.sm },
  tag: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.cardBorder,
  },
  tagText: { color: colors.textMuted, fontSize: font.sm },
  instructor: { color: colors.textMuted, fontSize: font.md, marginBottom: spacing.md },
  desc: { color: colors.textMuted, fontSize: font.base, lineHeight: 22, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { color: colors.text, fontSize: font.lg, fontWeight: '700', marginBottom: 4 },
  moduleCount: { color: colors.textMuted, fontSize: font.sm, marginBottom: spacing.md },
  module: {
    backgroundColor: colors.card, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.cardBorder, marginBottom: 8, overflow: 'hidden',
  },
  moduleHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: spacing.md,
  },
  moduleName: { color: colors.text, fontSize: font.base, fontWeight: '600', flex: 1 },
  lesson: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: spacing.md, paddingVertical: 8,
    borderTopWidth: 1, borderTopColor: colors.cardBorder,
  },
  lessonTitle: { color: colors.textMuted, fontSize: font.sm, flex: 1 },
  cta: { padding: spacing.lg, paddingTop: 0 },
  error: { color: colors.danger, textAlign: 'center', marginTop: 40 },
});
