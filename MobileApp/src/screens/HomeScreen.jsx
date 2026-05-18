import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getCourses } from '../api/courses';
import { getNotifications } from '../api/misc';
import CourseCard from '../components/CourseCard';
import LoadingScreen from '../components/LoadingScreen';
import { colors, font, spacing, radius } from '../theme';

const QUICK_LINKS = [
  { label: 'My Learning', icon: 'book-outline', screen: 'MyLearning' },
  { label: 'Exams', icon: 'clipboard-outline', screen: 'Exams' },
  { label: 'Community', icon: 'people-outline', screen: 'Community' },
  { label: 'Jobs', icon: 'briefcase-outline', screen: 'Jobs' },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [cRes, nRes] = await Promise.all([getCourses(), getNotifications()]);
      setCourses((cRes.data || []).slice(0, 6));
      const notifications = nRes.data || [];
      setUnread(notifications.filter((n) => !n.readBy?.includes(user?._id)).length);
    } catch (_) {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingScreen />;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.sub}>What are you learning today?</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.bell}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          {unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick links */}
      <View style={styles.quickRow}>
        {QUICK_LINKS.map((q) => (
          <TouchableOpacity
            key={q.label}
            style={styles.quickBtn}
            onPress={() => navigation.navigate(q.screen)}
          >
            <View style={styles.quickIcon}>
              <Ionicons name={q.icon} size={22} color={colors.primary} />
            </View>
            <Text style={styles.quickLabel}>{q.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Featured courses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Courses</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Courses')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        {courses.map((c) => (
          <CourseCard
            key={c._id}
            course={c}
            onPress={() => navigation.navigate('CourseDetail', { courseId: c._id })}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: spacing.lg, paddingTop: 56,
  },
  greeting: { color: colors.text, fontSize: font.xl, fontWeight: '700' },
  sub: { color: colors.textMuted, fontSize: font.md, marginTop: 2 },
  bell: { position: 'relative', padding: 4 },
  badge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: colors.danger, borderRadius: 10,
    minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  quickRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, marginBottom: spacing.lg,
  },
  quickBtn: { alignItems: 'center', flex: 1 },
  quickIcon: {
    width: 52, height: 52, borderRadius: radius.md,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center',
    marginBottom: 6, borderWidth: 1, borderColor: colors.cardBorder,
  },
  quickLabel: { color: colors.textMuted, fontSize: 11, textAlign: 'center' },
  section: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { color: colors.text, fontSize: font.lg, fontWeight: '700' },
  seeAll: { color: colors.primary, fontSize: font.sm },
});
