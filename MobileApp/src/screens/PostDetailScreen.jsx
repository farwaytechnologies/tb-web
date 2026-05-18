import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPost, getComments, addComment, likePost } from '../api/community';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { colors, font, spacing, radius } from '../theme';

export default function PostDetailScreen({ route }) {
  const { postId } = route.params;
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [pRes, cRes] = await Promise.all([getPost(postId), getComments(postId)]);
        setPost(pRes.data);
        setComments(cRes.data || []);
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  const handleLike = async () => {
    try {
      await likePost(postId);
      setPost((p) => {
        const liked = p.likes?.includes(user._id);
        return {
          ...p,
          likes: liked ? p.likes.filter((id) => id !== user._id) : [...(p.likes || []), user._id],
        };
      });
    } catch (_) {}
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    setPosting(true);
    try {
      const res = await addComment(postId, comment.trim());
      setComments((prev) => [...prev, res.data]);
      setComment('');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!post) return <View style={styles.container}><Text style={styles.err}>Post not found</Text></View>;

  const liked = post.likes?.includes(user._id);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Post */}
        <View style={styles.postCard}>
          <View style={styles.authorRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{post.author?.name?.[0]?.toUpperCase() || '?'}</Text>
            </View>
            <View>
              <Text style={styles.authorName}>{post.author?.name || 'Anonymous'}</Text>
              <Text style={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</Text>
            </View>
          </View>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.body}>{post.body}</Text>
          <TouchableOpacity style={styles.likeBtn} onPress={handleLike}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? colors.danger : colors.textMuted} />
            <Text style={styles.likeCount}>{post.likes?.length || 0} likes</Text>
          </TouchableOpacity>
        </View>

        {/* Comments */}
        <Text style={styles.commentsHeader}>{comments.length} Comments</Text>
        {comments.map((c) => (
          <View key={c._id} style={styles.commentCard}>
            <View style={styles.commentAvatar}>
              <Text style={styles.avatarText}>{c.author?.name?.[0]?.toUpperCase() || '?'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.commentAuthor}>{c.author?.name || 'Anonymous'}</Text>
              <Text style={styles.commentBody}>{c.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Comment input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          placeholderTextColor={colors.textMuted}
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleComment} disabled={posting}>
          <Ionicons name="send" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingBottom: spacing.xl },
  postCard: {
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.cardBorder, padding: spacing.md, marginBottom: spacing.lg,
  },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primary + '33', alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  avatarText: { color: colors.primary, fontWeight: '700', fontSize: font.base },
  authorName: { color: colors.text, fontWeight: '600', fontSize: font.base },
  date: { color: colors.textMuted, fontSize: font.sm },
  title: { color: colors.text, fontSize: font.lg, fontWeight: '700', marginBottom: spacing.sm },
  body: { color: colors.textMuted, fontSize: font.base, lineHeight: 22, marginBottom: spacing.md },
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  likeCount: { color: colors.textMuted, fontSize: font.sm },
  commentsHeader: { color: colors.text, fontSize: font.base, fontWeight: '700', marginBottom: spacing.md },
  commentCard: {
    flexDirection: 'row', gap: 10,
    backgroundColor: colors.card, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.cardBorder,
    padding: spacing.md, marginBottom: 8,
  },
  commentAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.secondary + '33', alignItems: 'center', justifyContent: 'center',
  },
  commentAuthor: { color: colors.text, fontWeight: '600', fontSize: font.sm, marginBottom: 2 },
  commentBody: { color: colors.textMuted, fontSize: font.sm, lineHeight: 18 },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  commentInput: {
    flex: 1, color: colors.text, fontSize: font.base,
    backgroundColor: colors.bg, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md, paddingVertical: 8, maxHeight: 100,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  err: { color: colors.danger, textAlign: 'center', marginTop: 40 },
});
