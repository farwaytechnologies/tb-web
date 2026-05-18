import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPosts, likePost } from '../api/community';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import EmptyState from '../components/EmptyState';
import { colors, font, spacing, radius } from '../theme';

const CATEGORIES = ['All', 'general', 'question', 'showcase', 'resource', 'announcement'];

export default function CommunityScreen({ navigation }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const res = await getPosts();
      setPosts(res.data?.posts || res.data || []);
    } catch (_) {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id !== postId) return p;
          const liked = p.likes?.includes(user._id);
          return {
            ...p,
            likes: liked
              ? p.likes.filter((id) => id !== user._id)
              : [...(p.likes || []), user._id],
          };
        })
      );
    } catch (_) {}
  };

  const filtered = posts.filter((p) => {
    if (category !== 'All' && p.category !== category) return false;
    if (search.trim() && !p.title?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <LoadingScreen />;

  const renderPost = ({ item }) => {
    const liked = item.likes?.includes(user._id);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('PostDetail', { postId: item._id })}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.author?.name?.[0]?.toUpperCase() || '?'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.authorName}>{item.author?.name || 'Anonymous'}</Text>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={[styles.catBadge, { backgroundColor: getCatColor(item.category) + '22' }]}>
            <Text style={[styles.catText, { color: getCatColor(item.category) }]}>{item.category}</Text>
          </View>
        </View>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postBody} numberOfLines={3}>{item.body}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.action} onPress={() => handleLike(item._id)}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={18} color={liked ? colors.danger : colors.textMuted} />
            <Text style={styles.actionText}>{item.likes?.length || 0}</Text>
          </TouchableOpacity>
          <View style={styles.action}>
            <Ionicons name="chatbubble-outline" size={18} color={colors.textMuted} />
            <Text style={styles.actionText}>Reply</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search posts..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Category filter */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(c) => c}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, category === item && styles.chipActive]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.chips}
        showsHorizontalScrollIndicator={false}
      />

      <FlatList
        data={filtered}
        keyExtractor={(p) => p._id}
        renderItem={renderPost}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="people-outline" message="No posts yet" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreatePost')}>
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

function getCatColor(cat) {
  const map = { general: colors.secondary, question: colors.warning, showcase: colors.success, resource: colors.primary, announcement: colors.danger };
  return map[cat] || colors.textMuted;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.card, margin: spacing.lg, marginBottom: spacing.sm,
    borderRadius: radius.sm, borderWidth: 1, borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: font.base, paddingVertical: 10 },
  chips: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.cardBorder,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textMuted, fontSize: font.sm, textTransform: 'capitalize' },
  chipTextActive: { color: colors.white, fontWeight: '600' },
  list: { padding: spacing.lg, paddingBottom: 80, flexGrow: 1 },
  card: {
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.cardBorder, padding: spacing.md, marginBottom: spacing.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primary + '33', alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  avatarText: { color: colors.primary, fontWeight: '700', fontSize: font.base },
  authorName: { color: colors.text, fontSize: font.sm, fontWeight: '600' },
  date: { color: colors.textMuted, fontSize: 11 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full },
  catText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  postTitle: { color: colors.text, fontSize: font.base, fontWeight: '700', marginBottom: 4 },
  postBody: { color: colors.textMuted, fontSize: font.sm, lineHeight: 20, marginBottom: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.lg, borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingTop: spacing.sm },
  action: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { color: colors.textMuted, fontSize: font.sm },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    elevation: 6, shadowColor: colors.primary, shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
});
