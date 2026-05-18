import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Image, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getEnrollments } from '../api/courses';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';
import { colors, font, spacing, radius } from '../theme';
import { BASE_URL } from '../api/client';

export default function MyLearningScreen({ navigation }) {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await getEnrollments(user._id);
      setEnrollments(res.data || []);
    } catch (_) {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingScreen />;

  const renderItem = ({ item }) => {
    const course = item.courseId;
    const imageUri = course?.image
      ? (course.image.startsWith('http') ? course.image : `${BASE_URL}/${course.image}`)
      : null;
    const statusColor = item.status === 'Accepted' ? colors.success : item.status === 'Rejected' ? colors.danger : colors.warning;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (item.status === 'Accepted' && course) {
            navigation.navigate('CoursePlayer', { courseId: course._id, course });
          }
        }}
        activeOpacity={0.85}
      >
        {imageUri
          ? <Image source={{ uri: imageUri }} style={styles.thumb} />
          : <View style={[styles.thumb, { backgroundColor: colors.cardBorder }]} />
        }
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>{course?.title || 'Course'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
          </View>
          {item.completed && (
            <View style={styles.completedRow}>
              <Ionicons name="ribbon-outline" size={14} color={colors.success} />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </View>
        {item.status === 'Accepted' && (
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={enrollments}
        keyExtractor={(e) => e._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState icon="book-outline" message="You haven't enrolled in any courses yet" />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.lg, flexGrow: 1 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.cardBorder,
    marginBottom: spacing.md, overflow: 'hidden',
  },
  thumb: { width: 90, height: 80 },
  info: { flex: 1, padding: spacing.md },
  title: { color: colors.text, fontSize: font.base, fontWeight: '600', marginBottom: 6 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.full },
  statusText: { fontSize: font.sm, fontWeight: '600' },
  completedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  completedText: { color: colors.success, fontSize: font.sm },
});
