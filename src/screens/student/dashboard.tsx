import { useEffect, useState } from 'react';
import type { AndroidSymbol } from 'expo-symbols';
import * as NavigationBar from 'expo-navigation-bar';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { SFSymbol } from 'sf-symbols-typescript';

const BLACK = '#111111';
const BLACK_DARK = '#000000';
const INK = '#111111';
const MUTED = '#666666';
const BORDER = '#d6d6d6';

type Tab = 'home' | 'schedule' | 'files' | 'menu';

const tabs: { key: Tab; label: string; ios: SFSymbol; android: AndroidSymbol }[] = [
  { key: 'home', label: 'Home', ios: 'house.fill', android: 'home' },
  { key: 'schedule', label: 'Schedule', ios: 'calendar', android: 'event' },
  { key: 'files', label: 'Files', ios: 'folder.fill', android: 'folder' },
  { key: 'menu', label: 'Menu', ios: 'line.3.horizontal', android: 'menu' },
];

type Subject = {
  id: string;
  title: string;
  description: string;
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
    lessons: 24,
    color: '#eeeeee',
    icon: 'function',
    androidIcon: 'calculate',
  },
  {
    id: 'science',
    title: 'Science',
    description: 'Explore how the world works',
    lessons: 18,
    color: '#e8e8e8',
    icon: 'atom',
    androidIcon: 'science',
  },
  {
    id: 'english',
    title: 'English',
    description: 'Find your voice in writing',
    lessons: 16,
    color: '#f1f1f1',
    icon: 'text.book.closed',
    androidIcon: 'menu_book',
  },
  {
    id: 'history',
    title: 'History',
    description: 'Learn from stories of the past',
    lessons: 12,
    color: '#e5e5e5',
    icon: 'building.columns',
    androidIcon: 'account_balance',
  },
  {
    id: 'coding',
    title: 'Coding',
    description: 'Make ideas come to life',
    lessons: 20,
    color: '#ededed',
    icon: 'chevron.left.forwardslash.chevron.right',
    androidIcon: 'code',
  },
  {
    id: 'languages',
    title: 'Languages',
    description: 'Connect with more of the world',
    lessons: 14,
    color: '#f4f4f4',
    icon: 'bubble.left.and.bubble.right',
    androidIcon: 'translate',
  },
];

function Icon({
  ios,
  android,
  size = 20,
  color = BLACK,
}: {
  ios: SFSymbol;
  android: AndroidSymbol;
  size?: number;
  color?: string;
}) {
  return <SymbolView name={{ ios, android, web: android }} size={size} tintColor={color} />;
}

export default function StudentDashboard() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['math', 'coding']);
  const [activeTab, setActiveTab] = useState<Tab>('home');

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    void NavigationBar.setVisibilityAsync('hidden');

    return () => {
      void NavigationBar.setVisibilityAsync('visible');
    };
  }, []);

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
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>YOUR LEARNING SPACE</Text>
            <Text style={styles.title}>Good morning, Nigga.</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable accessibilityLabel="Messages" style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}>
              <Icon ios="bubble.left.fill" android="chat_bubble" size={21} color="#fff" />
            </Pressable>
            <Pressable accessibilityLabel="Notifications" style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}>
              <Icon ios="bell.fill" android="notifications" size={21} color="#fff" />
              <View style={styles.notificationDot} />
            </Pressable>
            <Pressable accessibilityLabel="Profile" style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}>
              <Text style={styles.avatarText}>A</Text>
            </Pressable>
          </View>
        </View>

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

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Choose your subjects</Text>
            <Text style={styles.sectionSubtitle}>You can change these any time</Text>
          </View>
          <Text style={styles.selectedCount}>{selectedSubjects.length} selected</Text>
        </View>

        <View style={styles.subjectGrid}>
          {subjects.map((subject) => {
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
                  {selected && <Icon ios="checkmark" android="check" color="#fff" size={13} />}
                </View>
              </Pressable>
            );
          })}
        </View>

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

        <Pressable onPress={() => router.replace('/')} style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}>
          <Icon ios="arrow.left" android="arrow_back" size={15} color={MUTED} />
          <Text style={styles.signOutText}>Back to sign in</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.bottomNav}>
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={tab.label}
              onPress={() => setActiveTab(tab.key)}
              style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
              <Icon ios={tab.ios} android={tab.android} size={25} color={active ? BLACK : MUTED} />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
              {active && <View style={styles.tabIndicator} />}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f5f5f5', flex: 1 },
  content: { alignSelf: 'center', maxWidth: 920, paddingHorizontal: 16, paddingTop: 12, width: '100%' },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  eyebrow: { color: BLACK, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: INK, fontSize: 24, fontWeight: '800', marginTop: 5 },
  headerActions: { alignItems: 'center', flexDirection: 'row', gap: 7 },
  headerButton: { alignItems: 'center', backgroundColor: BLACK, borderColor: BLACK, borderRadius: 20, borderWidth: 1, elevation: 3, height: 40, justifyContent: 'center', position: 'relative', shadowColor: BLACK_DARK, shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.18, shadowRadius: 5, width: 40 },
  notificationDot: { backgroundColor: '#fff', borderColor: BLACK, borderRadius: 5, borderWidth: 2, height: 10, position: 'absolute', right: 1, top: 1, width: 10 },
  avatar: { alignItems: 'center', backgroundColor: BLACK, borderRadius: 21, elevation: 3, height: 42, justifyContent: 'center', shadowColor: BLACK_DARK, shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.18, shadowRadius: 5, width: 42 },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  welcomeCard: { alignItems: 'center', backgroundColor: BLACK_DARK, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, overflow: 'hidden', padding: 24 },
  welcomeCopy: { flex: 1, maxWidth: 550 },
  welcomeEyebrow: { color: '#c8c8c8', fontSize: 11, fontWeight: '800', letterSpacing: 1.3 },
  welcomeTitle: { color: '#fff', fontSize: 25, fontWeight: '800', lineHeight: 32, marginTop: 7 },
  welcomeDescription: { color: '#d0d0d0', fontSize: 14, lineHeight: 21, marginTop: 8 },
  welcomeIcon: { alignItems: 'center', backgroundColor: '#333333', borderRadius: 32, height: 64, justifyContent: 'center', marginLeft: 18, width: 64 },
  sectionHeading: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { color: INK, fontSize: 20, fontWeight: '800' },
  sectionSubtitle: { color: MUTED, fontSize: 13, marginTop: 4 },
  selectedCount: { color: BLACK, fontSize: 12, fontWeight: '800' },
  subjectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  subjectCard: { backgroundColor: '#fff', borderColor: BORDER, borderRadius: 16, borderWidth: 1, flexBasis: '45%', flexGrow: 1, minHeight: 160, minWidth: 0, padding: 16, position: 'relative' },
  subjectCardSelected: { borderColor: BLACK, borderWidth: 1.5 },
  subjectIcon: { alignItems: 'center', borderRadius: 12, height: 42, justifyContent: 'center', width: 42 },
  subjectCardBody: { paddingRight: 8 },
  subjectTitle: { color: INK, fontSize: 16, fontWeight: '800', marginTop: 13 },
  subjectDescription: { color: MUTED, fontSize: 12, lineHeight: 17, marginTop: 4 },
  lessonCount: { color: '#8a9a9b', fontSize: 11, fontWeight: '700', marginTop: 12 },
  check: { alignItems: 'center', borderColor: BORDER, borderRadius: 10, borderWidth: 1.5, height: 20, justifyContent: 'center', position: 'absolute', right: 14, top: 14, width: 20 },
  checkSelected: { backgroundColor: BLACK, borderColor: BLACK },
  progressSection: { backgroundColor: '#fff', borderRadius: 16, marginTop: 30, padding: 20 },
  progressHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  progressEyebrow: { color: BLACK, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  progressTitle: { color: INK, fontSize: 16, fontWeight: '800', marginTop: 5 },
  progressValue: { color: BLACK, fontSize: 18, fontWeight: '800' },
  progressTrack: { backgroundColor: '#e5e5e5', borderRadius: 4, height: 8, marginTop: 18, overflow: 'hidden' },
  progressFill: { backgroundColor: BLACK, borderRadius: 4, height: '100%', width: '60%' },
  progressHint: { color: MUTED, fontSize: 12, marginTop: 9 },
  signOut: { alignItems: 'center', alignSelf: 'center', flexDirection: 'row', gap: 7, marginTop: 24, padding: 8 },
  signOutText: { color: MUTED, fontSize: 13, fontWeight: '700' },
  bottomNav: { alignItems: 'center', backgroundColor: '#fff', borderColor: BORDER, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, paddingHorizontal: 8, paddingTop: 8 },
  tabButton: { alignItems: 'center', flex: 1, paddingHorizontal: 4, paddingTop: 2, position: 'relative' },
  tabLabel: { color: MUTED, fontSize: 12, fontWeight: '700', marginTop: 5 },
  tabLabelActive: { color: BLACK },
  tabIndicator: { backgroundColor: BLACK, borderRadius: 2, bottom: -10, height: 3, position: 'absolute', width: 20 },
  pressed: { opacity: 0.82 },
});