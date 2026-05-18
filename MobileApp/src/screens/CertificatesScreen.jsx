import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Share, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCertificates } from '../api/courses';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';
import { colors, font, spacing, radius } from '../theme';

export default function CertificatesScreen() {
  const { user } = useAuth();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await getCertificates(user._id);
      setCerts((res.data || []).filter((e) => e.certificateId));
    } catch (_) {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const handleShare = async (cert) => {
    try {
      await Share.share({
        message: `I completed "${cert.courseId?.title || 'a course'}" on TechBorg! Certificate ID: ${cert.certificateId}`,
      });
    } catch (_) {}
  };

  if (loading) return <LoadingScreen />;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="ribbon" size={32} color={colors.warning} />
      </View>
      <View style={styles.info}>
        <Text style={styles.courseTitle}>{item.courseId?.title || 'Course'}</Text>
        <Text style={styles.certId}>ID: {item.certificateId}</Text>
        <Text style={styles.date}>
          Completed: {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 'N/A'}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleShare(item)} style={styles.shareBtn}>
        <Ionicons name="share-outline" size={22} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={certs}
        keyExtractor={(c) => c._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="ribbon-outline" message="No certificates yet. Complete a course to earn one!" />}
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
    borderWidth: 1, borderColor: colors.warning + '44',
    padding: spacing.md, marginBottom: spacing.md,
  },
  iconWrap: {
    width: 56, height: 56, borderRadius: radius.sm,
    backgroundColor: colors.warning + '22',
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  info: { flex: 1 },
  courseTitle: { color: colors.text, fontSize: font.base, fontWeight: '600', marginBottom: 2 },
  certId: { color: colors.textMuted, fontSize: font.sm, marginBottom: 2 },
  date: { color: colors.textMuted, fontSize: font.sm },
  shareBtn: { padding: 8 },
});
