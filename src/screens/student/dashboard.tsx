import { useState } from 'react';
import type { AndroidSymbol } from 'expo-symbols';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { SFSymbol } from 'sf-symbols-typescript';
import { StudentBottomNav, StudentHeader, StudentIcon as Icon } from '@/components/student/student-ui';

const BLACK = '#111111';
const BLACK_DARK = '#000000';
const INK = '#111111';
const MUTED = '#666666';
const BORDER = '#d6d6d6';
const ACCENT = '#FED701';

type Subject = {
  id: string;
  title: string;
  description: string;
  tutor: string;
  lessons: number;
  color: string;
  icon: SFSymbol;
  androidIcon: AndroidSymbol;
};

const subjects: Subject[] = [
  {
    id: 'math',
    title: 'Mathematics',
    description: 'Build confidence with numbers',
    tutor: 'Maya Chen',
    lessons: 24,
    color: '#eeeeee',
    icon: 'function',
    androidIcon: 'calculate',
  },
  {
    id: 'science',
    title: 'Science',
    description: 'Explore how the world works',
    tutor: 'Maya Chen',
    lessons: 18,
    color: '#e8e8e8',
    icon: 'atom',
    androidIcon: 'science',
  },
  {
    id: 'english',
    title: 'English',
    description: 'Find your voice in writing',
    tutor: 'Theo Brooks',
    lessons: 16,
    color: '#f1f1f1',
    icon: 'text.book.closed',
    androidIcon: 'menu_book',
  },
  {
    id: 'history',
    title: 'History',
    description: 'Learn from stories of the past',
    tutor: 'Jordan Lee',
    lessons: 12,
    color: '#e5e5e5',
    icon: 'building.columns',
    androidIcon: 'account_balance',
  },
  {
    id: 'coding',
    title: 'Coding',
    description: 'Make ideas come to life',
    tutor: 'Sam Rivera',
    lessons: 20,
    color: '#ededed',
    icon: 'chevron.left.forwardslash.chevron.right',
    androidIcon: 'code',
  },
  {
    id: 'languages',
    title: 'Languages',
    description: 'Connect with more of the world',
    tutor: 'Jordan Lee',
    lessons: 14,
    color: '#f4f4f4',
    icon: 'bubble.left.and.bubble.right',
    androidIcon: 'translate',
  },
];

export default function StudentDashboard() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const visibleSubjects = subjects.filter((subject) =>
    `${subject.title} ${subject.description} ${subject.tutor}`.toLowerCase().includes(normalizedSearch),
  );

  function toggleSubject(id: string) {
    setSelectedSubjects((current) =>
      current.includes(id) ? current.filter((subjectId) => subjectId !== id) : [...current, id],
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 32 }]}
        showsVerticalScrollIndicator={false}>
        <StudentHeader title="Good morning, Batu." showActions />

        <View style={styles.welcomeCard}>
          <View style={styles.welcomeCopy}>
            <Text style={styles.welcomeEyebrow}>READY WHEN YOU ARE</Text>
            <Text style={styles.welcomeTitle}>What would you like to learn today?</Text>
            <Text style={styles.welcomeDescription}>Pick a few subjects and we&apos;ll shape your study plan around them.</Text>
          </View>
          <View style={styles.welcomeIcon}>
            <Icon ios="sparkles" android="auto_awesome" color="#fff" size={26} />
          </View>
        </View>

        <View style={styles.searchBar}>
          <Icon ios="magnifyingglass" android="search" size={19} color={MUTED} />
          <TextInput
            accessibilityLabel="Search subjects or tutor"
            onChangeText={setSearchQuery}
            placeholder="Search subjects or tutor"
            placeholderTextColor="#8a8a8a"
            returnKeyType="search"
            style={styles.searchInput}
            value={searchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable accessibilityLabel="Clear search" onPress={() => setSearchQuery('')} style={styles.clearSearch}>
              <Icon ios="xmark.circle.fill" android="cancel" size={18} color={MUTED} />
            </Pressable>
          )}
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Choose your subjects</Text>
            <Text style={styles.sectionSubtitle}>You can change these any time</Text>
          </View>
          <Text style={styles.selectedCount}>{selectedSubjects.length} selected</Text>
        </View>

        <View style={styles.subjectGrid}>
          {visibleSubjects.map((subject) => {
            const selected = selectedSubjects.includes(subject.id);
            return (
              <Pressable
                key={subject.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                onPress={() => toggleSubject(subject.id)}
                style={({ pressed }) => [styles.subjectCard, selected && styles.subjectCardSelected, pressed && styles.pressed]}>
                <View style={[styles.subjectIcon, { backgroundColor: subject.color }]}>
                  <Icon ios={subject.icon} android={subject.androidIcon} size={21} />
                </View>
                <View style={styles.subjectCardBody}>
                  <Text style={styles.subjectTitle}>{subject.title}</Text>
                  <Text style={styles.subjectDescription}>{subject.description}</Text>
                  <Text style={styles.lessonCount}>{subject.lessons} guided lessons</Text>
                </View>
                <View style={[styles.check, selected && styles.checkSelected]}>
                  {selected && <Icon ios="checkmark" android="check" color={BLACK} size={13} />}
                </View>
              </Pressable>
            );
          })}
        </View>
        {visibleSubjects.length === 0 && (
          <View style={styles.emptySearch}>
            <Text style={styles.emptySearchTitle}>No subjects found</Text>
            <Text style={styles.emptySearchText}>Try a different subject or tutor name.</Text>
          </View>
        )}

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressEyebrow}>THIS WEEK</Text>
              <Text style={styles.progressTitle}>Keep your momentum going</Text>
            </View>
            <Text style={styles.progressValue}>3 / 5</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressHint}>Two more sessions to reach your weekly goal.</Text>
        </View>

      </ScrollView>

      <View style={styles.fixedNextArea}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: selectedSubjects.length === 0 }}
          disabled={selectedSubjects.length === 0}
          onPress={() => router.push({ pathname: '/tutors', params: { subjects: selectedSubjects.join(',') } })}
          style={({ pressed }) => [
            styles.nextButton,
            selectedSubjects.length === 0 && styles.nextButtonDisabled,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.nextButtonText}>Next</Text>
          <Icon ios="arrow.right" android="arrow_forward" size={17} color="#fff" />
        </Pressable>
      </View>

      <StudentBottomNav activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f5f5f5', flex: 1 },
  content: { alignSelf: 'center', maxWidth: 920, paddingBottom: 24, paddingHorizontal: 16, paddingTop: 12, width: '100%' },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  eyebrow: { color: BLACK, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: INK, fontSize: 24, fontWeight: '800', marginTop: 5 },
  headerActions: { alignItems: 'center', flexDirection: 'row', gap: 7 },
  headerButton: { alignItems: 'center', backgroundColor: BLACK, borderColor: BLACK, borderRadius: 20, borderWidth: 1, elevation: 3, height: 40, justifyContent: 'center', position: 'relative', shadowColor: BLACK_DARK, shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.18, shadowRadius: 5, width: 40 },
  notificationDot: { backgroundColor: '#fff', borderColor: BLACK, borderRadius: 5, borderWidth: 2, height: 10, position: 'absolute', right: 1, top: 1, width: 10 },
  avatar: { alignItems: 'center', backgroundColor: BLACK, borderRadius: 21, elevation: 3, height: 42, justifyContent: 'center', shadowColor: BLACK_DARK, shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.18, shadowRadius: 5, width: 42 },
  avatarImage: { borderRadius: 21, height: '100%', width: '100%' },
  welcomeCard: { alignItems: 'center', backgroundColor: BLACK_DARK, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, overflow: 'hidden', padding: 24 },
  welcomeCopy: { flex: 1, maxWidth: 550 },
  welcomeEyebrow: { color: '#c8c8c8', fontSize: 11, fontWeight: '800', letterSpacing: 1.3 },
  welcomeTitle: { color: '#fff', fontSize: 25, fontWeight: '800', lineHeight: 32, marginTop: 7 },
  welcomeDescription: { color: '#d0d0d0', fontSize: 14, lineHeight: 21, marginTop: 8 },
  welcomeIcon: { alignItems: 'center', backgroundColor: '#333333', borderRadius: 32, height: 64, justifyContent: 'center', marginLeft: 18, width: 64 },
  searchBar: { alignItems: 'center', backgroundColor: '#fff', borderColor: BORDER, borderRadius: 14, borderWidth: 1, flexDirection: 'row', marginBottom: 26, paddingHorizontal: 14 },
  searchInput: { color: INK, flex: 1, fontSize: 14, minHeight: 50, paddingHorizontal: 10 },
  clearSearch: { padding: 4 },
  sectionHeading: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { color: INK, fontSize: 20, fontWeight: '800' },
  sectionSubtitle: { color: MUTED, fontSize: 13, marginTop: 4 },
  selectedCount: { color: BLACK, fontSize: 12, fontWeight: '800' },
  subjectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  emptySearch: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  emptySearchTitle: { color: INK, fontSize: 15, fontWeight: '800' },
  emptySearchText: { color: MUTED, fontSize: 12, marginTop: 5 },
  nextButton: { alignItems: 'center', alignSelf: 'stretch', backgroundColor: BLACK, borderRadius: 14, flexDirection: 'row', gap: 10, justifyContent: 'center', marginTop: 20, minHeight: 58, paddingHorizontal: 28 },
  nextButtonDisabled: { backgroundColor: '#b8b8b8' },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  fixedNextArea: { backgroundColor: '#f5f5f5', borderTopColor: BORDER, borderTopWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
  subjectCard: { backgroundColor: '#fff', borderColor: BORDER, borderRadius: 16, borderWidth: 1, flexBasis: '45%', flexGrow: 1, minHeight: 160, minWidth: 0, padding: 16, position: 'relative' },
  subjectCardSelected: { borderColor: BLACK, borderWidth: 1.5, shadowColor: ACCENT, shadowOffset: { height: 2, width: 0 }, shadowOpacity: 0.4, shadowRadius: 0 },
  subjectIcon: { alignItems: 'center', borderRadius: 12, height: 42, justifyContent: 'center', width: 42 },
  subjectCardBody: { paddingRight: 8 },
  subjectTitle: { color: INK, fontSize: 16, fontWeight: '800', marginTop: 13 },
  subjectDescription: { color: MUTED, fontSize: 12, lineHeight: 17, marginTop: 4 },
  lessonCount: { color: '#8a9a9b', fontSize: 11, fontWeight: '700', marginTop: 12 },
  check: { alignItems: 'center', borderColor: BORDER, borderRadius: 10, borderWidth: 1.5, height: 20, justifyContent: 'center', position: 'absolute', right: 14, top: 14, width: 20 },
  checkSelected: { backgroundColor: ACCENT, borderColor: ACCENT },
  progressSection: { backgroundColor: '#fff', borderRadius: 16, marginTop: 30, padding: 20 },
  progressHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  progressEyebrow: { color: BLACK, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  progressTitle: { color: INK, fontSize: 16, fontWeight: '800', marginTop: 5 },
  progressValue: { color: BLACK, fontSize: 18, fontWeight: '800' },
  progressTrack: { backgroundColor: '#e5e5e5', borderRadius: 4, height: 8, marginTop: 18, overflow: 'hidden' },
  progressFill: { backgroundColor: ACCENT, borderRadius: 4, height: '100%', width: '60%' },
  progressHint: { color: MUTED, fontSize: 12, marginTop: 9 },
  bottomNav: { alignItems: 'center', backgroundColor: '#fff', borderColor: BORDER, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, paddingHorizontal: 8, paddingTop: 8 },
  tabButton: { alignItems: 'center', flex: 1, paddingHorizontal: 4, paddingTop: 2, position: 'relative' },
  tabLabel: { color: MUTED, fontSize: 12, fontWeight: '700', marginTop: 5 },
  tabLabelActive: { color: BLACK },
  tabIndicator: { backgroundColor: BLACK, borderRadius: 2, bottom: -10, height: 3, position: 'absolute', width: 20 },
  pressed: { opacity: 0.82 },
});