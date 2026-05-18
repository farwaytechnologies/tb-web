import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getNotifications, markNotificationRead } from '../api/misc';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';
import { colors, font, spacing, radius } from '../theme';

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
    } catch (_) {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id, user._id);
      setNotifications((prev) =>
        prev.map((n) => n._id === id ? { ...n, readBy: [...(n.readBy || []), user._id] } : n)
      );
    } catch (_) {}
  };

  if (loading) return <LoadingScreen />;

  const renderItem = ({ item }) => {
    const isRead = item.readBy?.includes(user._id);
    return (
      <TouchableOpacity
        style={[styles.card, !isRead && styles.cardUnread]}
        onPress={() => !isRead && handleRead(item._id)}
        activeOpacity={0.85}
      >
        <View style={[styles.dot, isRead && styles.dotRead]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.date}>{new Date(item.date || item.createdAt).toLocaleDateString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(n) => n._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="notifications-off-outline" message="No notifications" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.lg, flexGrow: 1 },
  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.cardBorder,
    padding: spacing.md, marginBottom: 8,
  },
  cardUnread: { borderColor: colors.primary + '55', backgroundColor: colors.primary + '0a' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary, marginTop: 5 },
  dotRead: { backgroundColor: colors.cardBorder },
  title: { color: colors.text, fontSize: font.base, fontWeight: '600', marginBottom: 2 },
  message: { color: colors.textMuted, fontSize: font.sm, lineHeight: 18, marginBottom: 4 },
  date: { color: colors.textMuted, fontSize: 11 },
});
