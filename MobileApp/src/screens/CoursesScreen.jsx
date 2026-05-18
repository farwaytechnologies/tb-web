import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TextInput, TouchableOpacity, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCourses } from '../api/courses';
import CourseCard from '../components/CourseCard';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';
import { colors, font, spacing, radius } from '../theme';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data || []);
    } catch (_) {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let list = courses;
    if (level !== 'All') list = list.filter((c) => c.level === level);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.title?.toLowerCase().includes(q) || c.instructor?.toLowerCase().includes(q));
    }
    setFiltered(list);
  }, [courses, search, level]);

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Level filter */}
      <View style={styles.filterRow}>
        {LEVELS.map((l) => (
          <TouchableOpacity
            key={l}
            style={[styles.chip, level === l && styles.chipActive]}
            onPress={() => setLevel(l)}
          >
            <Text style={[styles.chipText, level === l && styles.chipTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(c) => c._id}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() => navigation.navigate('CourseDetail', { courseId: item._id })}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="search-outline" message="No courses found" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, margin: spacing.lg,
    borderRadius: radius.sm, borderWidth: 1, borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: colors.text, fontSize: font.base, paddingVertical: 12 },
  filterRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: 8, marginBottom: spacing.md },
  chip: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.cardBorder,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textMuted, fontSize: font.sm },
  chipTextActive: { color: colors.white, fontWeight: '600' },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
});
