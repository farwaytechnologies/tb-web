import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getJobs } from '../api/misc';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';
import { colors, font, spacing, radius } from '../theme';

export default function JobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await getJobs();
      setJobs(res.data || []);
    } catch (_) {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingScreen />;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('JobApply', { job: item })}
      activeOpacity={0.85}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="briefcase-outline" size={26} color={colors.secondary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.metaRow}>
          {item.location && (
            <View style={styles.meta}>
              <Ionicons name="location-outline" size={13} color={colors.textMuted} />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
          )}
          {item.level && (
            <View style={styles.meta}>
              <Ionicons name="bar-chart-outline" size={13} color={colors.textMuted} />
              <Text style={styles.metaText}>{item.level}</Text>
            </View>
          )}
        </View>
        {item.description && (
          <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(j) => j._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="briefcase-outline" message="No job listings available" />}
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
    width: 50, height: 50, borderRadius: radius.sm,
    backgroundColor: colors.secondary + '22',
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  info: { flex: 1 },
  title: { color: colors.text, fontSize: font.base, fontWeight: '600', marginBottom: 4 },
  metaRow: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { color: colors.textMuted, fontSize: font.sm },
  desc: { color: colors.textMuted, fontSize: font.sm, lineHeight: 18 },
});
