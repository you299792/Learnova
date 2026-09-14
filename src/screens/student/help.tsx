import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AndroidSymbol } from 'expo-symbols';
import type { SFSymbol } from 'sf-symbols-typescript';

import { STUDENT_COLORS, StudentBottomNav, StudentIcon } from '@/components/student/student-ui';

type Topic = {
  title: string;
  description: string;
  ios: SFSymbol;
  android: AndroidSymbol;
  route?: '/schedule' | '/messages' | '/files';
};

type Faq = {
  id: string;
  question: string;
  answer: string;
};

const topics: Topic[] = [
  { title: 'Sessions', description: 'Book, manage, or review tutor sessions', ios: 'calendar', android: 'event', route: '/schedule' },
  { title: 'Messages', description: 'Stay in touch with your tutors', ios: 'bubble.left.and.bubble.right', android: 'forum', route: '/messages' },
  { title: 'Shared files', description: 'Find worksheets and study materials', ios: 'folder.fill', android: 'folder', route: '/files' },
];

const faqs: Faq[] = [
  {
    id: 'book-session',
    question: 'How do I book a tutoring session?',
    answer: 'Choose your subjects on the Home screen, tap Next, then select a tutor and an available time. Your request will appear in Schedule while it is pending.',
  },
  {
    id: 'pending-session',
    question: 'What does “Pending” mean on my schedule?',
    answer: 'Pending means the tutor has not confirmed the request yet. You can still review the session details, and you will receive a notification when the status changes.',
  },
  {
    id: 'message-tutor',
    question: 'Where can I message my tutor?',
    answer: 'Open Messages from the Home header or the Menu screen. Select a conversation to send a text, attach a picture, or send a quick like.',
  },
  {
    id: 'find-files',
    question: 'Where are my worksheets and study files?',
    answer: 'Open Files from the bottom navigation. Filter by subject to quickly find guides, diagrams, templates, and practice materials shared by your tutors.',
  },
  {
    id: 'notifications',
    question: 'How do I control reminders?',
    answer: 'Open Menu, choose Settings, and use the notification switches. You can control study reminders, session alerts, and your weekly progress summary independently.',
  },
];

export default function StudentHelp() {
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLowerCase();
  const visibleFaqs = useMemo(
    () => faqs.filter((faq) => `${faq.question} ${faq.answer}`.toLowerCase().includes(normalizedQuery)),
    [normalizedQuery],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable accessibilityLabel="Go back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/menu'))} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <StudentIcon ios="chevron.left" android="arrow_back" size={20} />
          </Pressable>
          <Text style={styles.topBarTitle}>Help center</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>LEARN WITH CONFIDENCE</Text>
            <Text style={styles.heroTitle}>How can we help?</Text>
            <Text style={styles.heroText}>Find quick answers about sessions, tutors, messages, and your learning space.</Text>
          </View>
          <View style={styles.heroIcon}>
            <StudentIcon ios="questionmark" android="help_outline" color={STUDENT_COLORS.black} size={25} />
          </View>
        </View>

        <View style={styles.searchBar}>
          <StudentIcon ios="magnifyingglass" android="search" color={STUDENT_COLORS.muted} size={18} />
          <TextInput
            accessibilityLabel="Search help articles"
            onChangeText={setQuery}
            placeholder="Search help articles"
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={query}
          />
          {query.length > 0 && (
            <Pressable accessibilityLabel="Clear help search" onPress={() => setQuery('')} style={styles.clearButton}>
              <StudentIcon ios="xmark.circle.fill" android="cancel" color={STUDENT_COLORS.muted} size={18} />
            </Pressable>
          )}
        </View>

        <Text style={styles.sectionTitle}>Explore Learnova</Text>
        <View style={styles.topicList}>
          {topics.map((topic) => (
            <Pressable
              key={topic.title}
              accessibilityRole="button"
              onPress={() => topic.route && router.push(topic.route)}
              style={({ pressed }) => [styles.topicCard, pressed && styles.pressed]}>
              <View style={styles.topicIcon}>
                <StudentIcon ios={topic.ios} android={topic.android} size={19} />
              </View>
              <View style={styles.topicCopy}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDescription}>{topic.description}</Text>
              </View>
              <StudentIcon ios="chevron.right" android="chevron_right" color={STUDENT_COLORS.muted} size={17} />
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Common questions</Text>
            <Text style={styles.sectionSubtitle}>Helpful answers for your next step</Text>
          </View>
          <Text style={styles.resultCount}>{visibleFaqs.length} articles</Text>
        </View>

        <View style={styles.faqList}>
          {visibleFaqs.map((faq) => {
            const expanded = expandedId === faq.id;
            return (
              <Pressable
                key={faq.id}
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                onPress={() => setExpandedId(expanded ? null : faq.id)}
                style={({ pressed }) => [styles.faqCard, expanded && styles.faqCardExpanded, pressed && styles.pressed]}>
                <View style={styles.faqQuestionRow}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <StudentIcon ios={expanded ? 'chevron.up' : 'chevron.down'} android={expanded ? 'expand_less' : 'expand_more'} color={STUDENT_COLORS.muted} size={18} />
                </View>
                {expanded && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
              </Pressable>
            );
          })}
        </View>

        {visibleFaqs.length === 0 && (
          <View style={styles.emptyState}>
            <StudentIcon ios="magnifyingglass" android="search_off" color={STUDENT_COLORS.muted} size={26} />
            <Text style={styles.emptyTitle}>No articles found</Text>
            <Text style={styles.emptyText}>Try searching for sessions, messages, files, or reminders.</Text>
          </View>
        )}

        <View style={styles.contactCard}>
          <View style={styles.contactIcon}>
            <StudentIcon ios="bubble.left.fill" android="chat_bubble" color="#fff" size={19} />
          </View>
          <View style={styles.contactCopy}>
            <Text style={styles.contactTitle}>Still need a hand?</Text>
            <Text style={styles.contactText}>Our support team can help with your learning space.</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => Alert.alert('Contact support', 'Tell us what you need help with and the Learnova team will get back to you soon.')} style={({ pressed }) => [styles.contactButton, pressed && styles.pressed]}>
            <Text style={styles.contactButtonText}>Contact</Text>
          </Pressable>
        </View>
      </ScrollView>
      <StudentBottomNav activeTab="menu" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: STUDENT_COLORS.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: 920, paddingBottom: 30, paddingHorizontal: 16, paddingTop: 12, width: '100%' },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  backButton: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 20, borderWidth: 1, height: 40, justifyContent: 'center', width: 40 },
  topBarTitle: { color: STUDENT_COLORS.ink, fontSize: 20, fontWeight: '800' },
  topBarSpacer: { height: 40, width: 40 },
  hero: { alignItems: 'center', backgroundColor: STUDENT_COLORS.blackDark, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', padding: 21 },
  heroCopy: { flex: 1, maxWidth: 600 },
  eyebrow: { color: '#c8c8c8', fontSize: 10, fontWeight: '800', letterSpacing: 1.3 },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 7 },
  heroText: { color: '#d0d0d0', fontSize: 13, lineHeight: 19, marginTop: 7 },
  heroIcon: { alignItems: 'center', backgroundColor: STUDENT_COLORS.accent, borderRadius: 30, height: 60, justifyContent: 'center', marginLeft: 16, width: 60 },
  searchBar: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 14, borderWidth: 1, flexDirection: 'row', marginTop: 18, paddingHorizontal: 14 },
  searchInput: { color: STUDENT_COLORS.ink, flex: 1, fontSize: 14, minHeight: 50, paddingHorizontal: 10 },
  clearButton: { padding: 4 },
  sectionHeading: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13, marginTop: 29 },
  sectionTitle: { color: STUDENT_COLORS.ink, fontSize: 20, fontWeight: '800' },
  sectionSubtitle: { color: STUDENT_COLORS.muted, fontSize: 13, marginTop: 4 },
  resultCount: { color: STUDENT_COLORS.black, fontSize: 12, fontWeight: '800' },
  topicList: { gap: 10, marginTop: 14 },
  topicCard: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 16, borderWidth: 1, flexDirection: 'row', minHeight: 70, padding: 12 },
  topicIcon: { alignItems: 'center', backgroundColor: STUDENT_COLORS.accent, borderRadius: 12, height: 42, justifyContent: 'center', width: 42 },
  topicCopy: { flex: 1, marginHorizontal: 12 },
  topicTitle: { color: STUDENT_COLORS.ink, fontSize: 14, fontWeight: '800' },
  topicDescription: { color: STUDENT_COLORS.muted, fontSize: 11, marginTop: 4 },
  faqList: { gap: 10 },
  faqCard: { backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 16, borderWidth: 1, padding: 16 },
  faqCardExpanded: { borderColor: STUDENT_COLORS.black },
  faqQuestionRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  faqQuestion: { color: STUDENT_COLORS.ink, flex: 1, fontSize: 14, fontWeight: '800', lineHeight: 20, paddingRight: 12 },
  faqAnswer: { color: STUDENT_COLORS.muted, fontSize: 13, lineHeight: 20, marginTop: 12 },
  emptyState: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 28 },
  emptyTitle: { color: STUDENT_COLORS.ink, fontSize: 16, fontWeight: '800', marginTop: 11 },
  emptyText: { color: STUDENT_COLORS.muted, fontSize: 12, lineHeight: 18, marginTop: 5, textAlign: 'center' },
  contactCard: { alignItems: 'center', backgroundColor: STUDENT_COLORS.blackDark, borderRadius: 17, flexDirection: 'row', marginTop: 25, padding: 15 },
  contactIcon: { alignItems: 'center', backgroundColor: '#333', borderRadius: 21, height: 42, justifyContent: 'center', width: 42 },
  contactCopy: { flex: 1, marginHorizontal: 11 },
  contactTitle: { color: '#fff', fontSize: 14, fontWeight: '800' },
  contactText: { color: '#bdbdbd', fontSize: 11, lineHeight: 16, marginTop: 3 },
  contactButton: { backgroundColor: STUDENT_COLORS.accent, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9 },
  contactButtonText: { color: STUDENT_COLORS.black, fontSize: 11, fontWeight: '800' },
  pressed: { opacity: 0.82 },
});