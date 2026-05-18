import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getExam, submitExam } from '../api/exams';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import Button from '../components/Button';
import { colors, font, spacing, radius } from '../theme';

export default function TakeExamScreen({ route, navigation }) {
  const { examId } = route.params;
  const { user } = useAuth();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getExam(examId);
        setExam(res.data);
        setAnswers(new Array(res.data.questions.length).fill(null));
        setTimeLeft(res.data.duration * 60);
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!exam || result) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [exam, result]);

  const handleSubmit = async (auto = false) => {
    if (!auto) {
      const unanswered = answers.filter((a) => a === null).length;
      if (unanswered > 0) {
        Alert.alert('Unanswered Questions', `You have ${unanswered} unanswered question(s). Submit anyway?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit', onPress: () => doSubmit() },
        ]);
        return;
      }
    }
    doSubmit();
  };

  const doSubmit = async () => {
    clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const res = await submitExam(examId, {
        userId: user._id,
        userName: user.name,
        answers: answers.map((a) => (a === null ? -1 : a)),
      });
      setResult(res.data);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (loading) return <LoadingScreen />;
  if (!exam) return <View style={styles.container}><Text style={styles.err}>Exam not found</Text></View>;

  // Result screen
  if (result) {
    const passed = result.score >= exam.passMark;
    return (
      <View style={styles.container}>
        <View style={styles.resultCard}>
          <Ionicons
            name={passed ? 'trophy-outline' : 'close-circle-outline'}
            size={64}
            color={passed ? colors.success : colors.danger}
          />
          <Text style={styles.resultTitle}>{passed ? 'Congratulations!' : 'Better luck next time'}</Text>
          <Text style={styles.resultScore}>{result.score} / {result.total}</Text>
          <Text style={styles.resultPct}>{Math.round((result.score / result.total) * 100)}%</Text>
          <Text style={[styles.resultStatus, { color: passed ? colors.success : colors.danger }]}>
            {passed ? 'PASSED' : 'FAILED'}
          </Text>
          <Button title="Back to Exams" onPress={() => navigation.goBack()} style={{ marginTop: spacing.lg }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Timer */}
      <View style={styles.timerBar}>
        <Text style={styles.examTitle} numberOfLines={1}>{exam.title}</Text>
        <View style={[styles.timer, timeLeft < 60 && { backgroundColor: colors.danger + '33' }]}>
          <Ionicons name="time-outline" size={16} color={timeLeft < 60 ? colors.danger : colors.primary} />
          <Text style={[styles.timerText, timeLeft < 60 && { color: colors.danger }]}>
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.questions}>
        {exam.questions.map((q, qi) => (
          <View key={qi} style={styles.questionCard}>
            <Text style={styles.qNum}>Q{qi + 1}</Text>
            <Text style={styles.qText}>{q.question}</Text>
            {q.options.map((opt, oi) => (
              <TouchableOpacity
                key={oi}
                style={[styles.option, answers[qi] === oi && styles.optionSelected]}
                onPress={() => {
                  const updated = [...answers];
                  updated[qi] = oi;
                  setAnswers(updated);
                }}
              >
                <View style={[styles.optionDot, answers[qi] === oi && styles.optionDotSelected]} />
                <Text style={[styles.optionText, answers[qi] === oi && { color: colors.primary }]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <Button title="Submit Exam" onPress={() => handleSubmit(false)} loading={submitting} style={{ marginTop: spacing.md }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  timerBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  examTitle: { color: colors.text, fontSize: font.base, fontWeight: '600', flex: 1, marginRight: 8 },
  timer: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.primary + '22', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.full,
  },
  timerText: { color: colors.primary, fontWeight: '700', fontSize: font.base },
  questions: { padding: spacing.lg },
  questionCard: {
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.cardBorder,
    padding: spacing.md, marginBottom: spacing.md,
  },
  qNum: { color: colors.primary, fontSize: font.sm, fontWeight: '700', marginBottom: 4 },
  qText: { color: colors.text, fontSize: font.base, marginBottom: spacing.md, lineHeight: 22 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: spacing.sm, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.cardBorder, marginBottom: 8,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  optionDot: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: colors.cardBorder,
  },
  optionDotSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  optionText: { color: colors.text, fontSize: font.base, flex: 1 },
  resultCard: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  resultTitle: { color: colors.text, fontSize: font.xl, fontWeight: '700', marginTop: spacing.md },
  resultScore: { color: colors.text, fontSize: 48, fontWeight: '800', marginTop: spacing.md },
  resultPct: { color: colors.textMuted, fontSize: font.lg },
  resultStatus: { fontSize: font.xl, fontWeight: '800', marginTop: spacing.sm, letterSpacing: 2 },
  err: { color: colors.danger, textAlign: 'center', marginTop: 40 },
});
