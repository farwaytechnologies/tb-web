import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getProgress, markLessonComplete } from '../api/courses';
import { colors, font, spacing, radius } from '../theme';
import { BASE_URL } from '../api/client';

// Lazy-load WebView to avoid crash if not yet linked
let WebView = null;
try {
  WebView = require('react-native-webview').WebView;
} catch (_) {
  WebView = null;
}

export default function CoursePlayerScreen({ route }) {
  const { courseId, course } = route.params;
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [activeModule, setActiveModule] = useState(0);
  const [activeVideo, setActiveVideo] = useState(0);
  const [showModules, setShowModules] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProgress(user._id, courseId);
        setProgress(res.data);
      } catch (_) {}
    })();
  }, []);

  const currentVideo = course?.modules?.[activeModule]?.videos?.[activeVideo];
  const lessonKey = `${activeModule}-${activeVideo}`;
  const isCompleted = progress?.completedLessons?.includes(lessonKey);

  const videoUri = currentVideo?.video
    ? (currentVideo.video.startsWith('http') ? currentVideo.video : `${BASE_URL}/${currentVideo.video}`)
    : null;

  const handleMarkComplete = async () => {
    if (!progress?._id || isCompleted) return;
    try {
      const res = await markLessonComplete(progress._id, lessonKey);
      setProgress(res.data);
    } catch (_) {}
  };

  return (
    <View style={styles.container}>
      {/* Video player */}
      <View style={styles.playerWrap}>
        {videoUri && WebView ? (
          <WebView
            source={{ uri: videoUri }}
            style={styles.player}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
          />
        ) : (
          <View style={[styles.player, styles.noVideo]}>
            <Ionicons name="videocam-off-outline" size={40} color={colors.textMuted} />
            <Text style={styles.noVideoText}>{videoUri ? 'Video player unavailable' : 'No video available'}</Text>
          </View>
        )}
      </View>

      {/* Video info */}
      <View style={styles.infoBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.videoTitle} numberOfLines={2}>{currentVideo?.title || 'Select a lesson'}</Text>
          <Text style={styles.moduleName}>{course?.modules?.[activeModule]?.name}</Text>
        </View>
        {!isCompleted && (
          <TouchableOpacity style={styles.completeBtn} onPress={handleMarkComplete}>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />
            <Text style={styles.completeBtnText}>Done</Text>
          </TouchableOpacity>
        )}
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          </View>
        )}
      </View>

      {/* Progress bar */}
      {progress && (
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress.progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress.progressPercent}% complete</Text>
        </View>
      )}

      {/* Module toggle */}
      <TouchableOpacity style={styles.toggleRow} onPress={() => setShowModules(!showModules)}>
        <Text style={styles.toggleText}>Course Content</Text>
        <Ionicons name={showModules ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
      </TouchableOpacity>

      {showModules && (
        <ScrollView style={styles.moduleList}>
          {course?.modules?.map((mod, mi) => (
            <View key={mi}>
              <Text style={styles.modHeader}>{mod.name}</Text>
              {mod.videos?.map((v, vi) => {
                const key = `${mi}-${vi}`;
                const done = progress?.completedLessons?.includes(key);
                const active = mi === activeModule && vi === activeVideo;
                return (
                  <TouchableOpacity
                    key={vi}
                    style={[styles.lessonRow, active && styles.lessonActive]}
                    onPress={() => { setActiveModule(mi); setActiveVideo(vi); setShowModules(false); }}
                  >
                    <Ionicons
                      name={done ? 'checkmark-circle' : 'play-circle-outline'}
                      size={18}
                      color={done ? colors.success : active ? colors.primary : colors.textMuted}
                    />
                    <Text style={[styles.lessonText, active && { color: colors.primary }]} numberOfLines={1}>
                      {v.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  playerWrap: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
  player: { flex: 1 },
  noVideo: { alignItems: 'center', justifyContent: 'center' },
  noVideoText: { color: colors.textMuted, marginTop: 8 },
  infoBar: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.cardBorder,
  },
  videoTitle: { color: colors.text, fontSize: font.base, fontWeight: '600' },
  moduleName: { color: colors.textMuted, fontSize: font.sm, marginTop: 2 },
  completeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 8 },
  completeBtnText: { color: colors.success, fontSize: font.sm, fontWeight: '600' },
  completedBadge: { padding: 8 },
  progressWrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 8, gap: 10 },
  progressBg: { flex: 1, height: 6, backgroundColor: colors.cardBorder, borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  progressText: { color: colors.textMuted, fontSize: font.sm, width: 80, textAlign: 'right' },
  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.cardBorder,
  },
  toggleText: { color: colors.text, fontSize: font.base, fontWeight: '600' },
  moduleList: { flex: 1 },
  modHeader: {
    color: colors.textMuted, fontSize: font.sm, fontWeight: '700',
    paddingHorizontal: spacing.md, paddingVertical: 8,
    backgroundColor: colors.card, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  lessonRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: spacing.md, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.cardBorder,
  },
  lessonActive: { backgroundColor: colors.primary + '15' },
  lessonText: { color: colors.text, fontSize: font.sm, flex: 1 },
});
