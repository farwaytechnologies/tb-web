import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getExams } from '../api/exams';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';
import { colors, font, spacing, radius } from '../theme';

export default function ExamsScreen({ navigation }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await getExams();
      setExams((res.data || []).filter((e) => e.active));
    } catch (_) {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingScreen />;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TakeExam', { examId: item._id })}
      activeOpacity={0.85}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="clipboard-outline" size={28} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        {item.courseName && (
          <Text style={styles.course}>{item.courseName}</Text>
        )}
        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <Ionicons name="time-outline" size={13} color={colors.textMuted} />
            <Text style={styles.metaText}>{item.duration} min</Text>
          </View>
          <View style={styles.meta}>
            <Ionicons name="checkmark-circle-outline" size={13} color={colors.textMuted} />
            <Text style={styles.metaText}>Pass: {item.passMark}%</Text>
          </View>
          <View style={styles.meta}>
            <Ionicons name="help-circle-outline" size={13} color={colors.textMuted} />
            <Text style={styles.metaText}>{item.questions?.length} Qs</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={exams}
        keyExtractor={(e) => e._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="clipboard-outline" message="No exams available" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
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
    padding: spacing.md, marginBottom: spacing.md,
  },
  iconWrap: {
    width: 52, height: 52, borderRadius: radius.sm,
    backgroundColor: colors.primary + '22',
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  info: { flex: 1 },
  title: { color: colors.text, fontSize: font.base, fontWeight: '600', marginBottom: 2 },
  course: { color: colors.textMuted, fontSize: font.sm, marginBottom: 6 },
  metaRow: { flexDirection: 'row', gap: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { color: colors.textMuted, fontSize: font.sm },
});
