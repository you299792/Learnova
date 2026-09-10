import { useEffect, useMemo, useState } from 'react';
import type { AndroidSymbol } from 'expo-symbols';
import { Image } from 'expo-image';
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

type Day = {
  id: string;
  label: string;
  date: string;
  month: string;
};

type Session = {
  id: string;
  day: string;
  time: string;
  period: string;
  subject: string;
  tutor: string;
  initials: string;
  duration: string;
  color: string;
};

const weekdayIds = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const weekdayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function getCurrentWeek(): Day[] {
  const today = new Date();
  const monday = new Date(today);
  const daysSinceMonday = (today.getDay() + 6) % 7;
  monday.setDate(today.getDate() - daysSinceMonday);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      id: weekdayIds[date.getDay()],
      label: weekdayLabels[date.getDay()],
      date: String(date.getDate()),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    };
  });
}

function getWeekRangeLabel(currentWeek: Day[]) {
  const firstDay = currentWeek[0];
  const lastDay = currentWeek[currentWeek.length - 1];
  const year = new Date().getFullYear();
  return firstDay.month === lastDay.month
    ? `${firstDay.month} ${firstDay.date} - ${lastDay.date}, ${year}`
    : `${firstDay.month} ${firstDay.date} - ${lastDay.month} ${lastDay.date}, ${year}`;
}

function getTodayId() {
  return weekdayIds[new Date().getDay()];
}

const sessions: Session[] = [
  { id: 'goals-mon', day: 'mon', time: '4:00', period: 'PM', subject: 'Learning goals', tutor: 'Sam Rivera', initials: 'SR', duration: '30 min', color: '#eaeaea' },
  { id: 'math-tue', day: 'tue', time: '4:00', period: 'PM', subject: 'Mathematics', tutor: 'Maya Chen', initials: 'MC', duration: '60 min', color: '#e7e7e7' },
  { id: 'english-wed', day: 'wed', time: '5:30', period: 'PM', subject: 'English writing', tutor: 'Theo Brooks', initials: 'TB', duration: '45 min', color: '#ededed' },
  { id: 'coding-thu', day: 'thu', time: '4:30', period: 'PM', subject: 'Intro to coding', tutor: 'Sam Rivera', initials: 'SR', duration: '60 min', color: '#e4e4e4' },
  { id: 'science-fri', day: 'fri', time: '3:00', period: 'PM', subject: 'Science lab prep', tutor: 'Maya Chen', initials: 'MC', duration: '45 min', color: '#f1f1f1' },
  { id: 'review-sat', day: 'sat', time: '10:00', period: 'AM', subject: 'Weekly review', tutor: 'Theo Brooks', initials: 'TB', duration: '45 min', color: '#e9e9e9' },
  { id: 'planning-sun', day: 'sun', time: '2:00', period: 'PM', subject: 'Study planning', tutor: 'Sam Rivera', initials: 'SR', duration: '30 min', color: '#eeeeee' },
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

export default function StudentSchedule() {
  const days = useMemo(getCurrentWeek, []);
  const todayId = getTodayId();
  const [selectedDay, setSelectedDay] = useState(days.some((day) => day.id === todayId) ? todayId : 'mon');
  const selectedSessions = useMemo(
    () => sessions.filter((session) => session.day === selectedDay),
    [selectedDay],
  );
  const nextSession = sessions.find((session) => {
    const sessionDay = weekdayIds.indexOf(session.day);
    const currentDay = weekdayIds.indexOf(todayId);
    return sessionDay >= currentDay;
  }) ?? sessions[0];
  const nextSessionDay = days.find((day) => day.id === nextSession.day) ?? days[0];
  const nextSessionDate = nextSession.day === todayId ? 'Today' : `${nextSessionDay.label} ${nextSessionDay.date} ${nextSessionDay.month}`;

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    void NavigationBar.setVisibilityAsync('hidden');
    return () => {
      void NavigationBar.setVisibilityAsync('visible');
    };
  }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>YOUR LEARNING SPACE</Text>
            <Text style={styles.title}>Schedule</Text>
          </View>
          <Pressable accessibilityLabel="Profile" onPress={() => router.push('/profile')} style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}>
            <Image source={{ uri: 'https://i.scdn.co/image/ab67616d00001e028f33770d5cb6b7bbbd59686a' }} style={styles.avatarImage} />
          </Pressable>
        </View>

        <View style={styles.weekHeader}>
          <View>
            <Text style={styles.sectionTitle}>Your week</Text>
            <Text style={styles.sectionSubtitle}>{getWeekRangeLabel(days)}</Text>
          </View>
          <View style={styles.calendarIcon}>
            <Icon ios="calendar" android="event" size={19} color="#fff" />
          </View>
        </View>

        <View style={styles.dayStrip}>
          {days.map((day) => {
            const selected = selectedDay === day.id;
            const hasSession = sessions.some((session) => session.day === day.id);
            return (
              <Pressable
                key={day.id}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => setSelectedDay(day.id)}
                style={({ pressed }) => [styles.dayButton, selected && styles.dayButtonSelected, pressed && styles.pressed]}>
                <Text style={[styles.dayLabel, selected && styles.dayTextSelected]}>{day.label}</Text>
                <Text style={[styles.dayDate, selected && styles.dayTextSelected]}>{day.date}</Text>
                <Text style={[styles.dayMonth, selected && styles.dayTextSelected]}>{day.month}</Text>
                {hasSession && <View style={[styles.sessionDot, selected && styles.sessionDotSelected]} />}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.nextCard}>
          <View style={styles.nextIcon}>
            <Icon ios="clock.fill" android="schedule" size={20} color="#fff" />
          </View>
          <View style={styles.nextCopy}>
            <Text style={styles.nextEyebrow}>NEXT SESSION</Text>
            <Text style={styles.nextTitle}>{nextSession.subject} with {nextSession.tutor.split(' ')[0]}</Text>
            <Text style={styles.nextDetails}>{nextSessionDate} at {nextSession.time} {nextSession.period} · {nextSession.duration}</Text>
          </View>
          <Icon ios="chevron.right" android="chevron_right" size={18} color="#fff" />
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>{days.find((day) => day.id === selectedDay)?.label} sessions</Text>
            <Text style={styles.sectionSubtitle}>Your time with a tutor</Text>
          </View>
          <Text style={styles.sessionCount}>{selectedSessions.length} session{selectedSessions.length === 1 ? '' : 's'}</Text>
        </View>

        {selectedSessions.length > 0 ? (
          <View style={styles.sessionList}>
            {selectedSessions.map((session) => (
              <Pressable key={session.id} style={({ pressed }) => [styles.sessionCard, pressed && styles.pressed]}>
                <View style={styles.timeColumn}>
                  <Text style={styles.sessionTime}>{session.time}</Text>
                  <Text style={styles.sessionPeriod}>{session.period}</Text>
                </View>
                <View style={styles.sessionDivider} />
                <View style={[styles.subjectMark, { backgroundColor: session.color }]}>
                  <Icon ios="book.fill" android="menu_book" size={19} />
                </View>
                <View style={styles.sessionCopy}>
                  <Text style={styles.subjectTitle}>{session.subject}</Text>
                  <Text style={styles.tutorName}>with {session.tutor}</Text>
                  <Text style={styles.duration}>{session.duration}</Text>
                </View>
                <View style={styles.tutorAvatar}>
                  <Text style={styles.tutorInitials}>{session.initials}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Icon ios="calendar.badge.plus" android="event_available" size={25} color={MUTED} />
            <Text style={styles.emptyTitle}>A clear day to review</Text>
            <Text style={styles.emptyDescription}>No tutor sessions are planned for this day.</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        {tabs.map((tab) => {
          const active = tab.key === 'schedule';
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={tab.label}
              onPress={() => {
                if (tab.key === 'home') router.replace('/student');
                if (tab.key === 'files') router.push('/files');
                if (tab.key === 'menu') router.push('/menu');
              }}
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
  content: { alignSelf: 'center', maxWidth: 920, paddingBottom: 32, paddingHorizontal: 16, paddingTop: 12, width: '100%' },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  eyebrow: { color: BLACK, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: INK, fontSize: 28, fontWeight: '800', marginTop: 5 },
  avatar: { alignItems: 'center', backgroundColor: BLACK, borderRadius: 21, elevation: 3, height: 42, justifyContent: 'center', shadowColor: BLACK_DARK, shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.18, shadowRadius: 5, width: 42 },
  avatarImage: { borderRadius: 21, height: '100%', width: '100%' },
  weekHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { color: INK, fontSize: 20, fontWeight: '800' },
  sectionSubtitle: { color: MUTED, fontSize: 13, marginTop: 4 },
  calendarIcon: { alignItems: 'center', backgroundColor: BLACK, borderRadius: 20, height: 40, justifyContent: 'center', width: 40 },
  dayStrip: { backgroundColor: '#fff', borderColor: BORDER, borderRadius: 16, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 6 },
  dayButton: { alignItems: 'center', borderRadius: 11, flex: 1, minHeight: 78, paddingTop: 10, position: 'relative' },
  dayButtonSelected: { backgroundColor: BLACK },
  dayLabel: { color: MUTED, fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },
  dayDate: { color: INK, fontSize: 22, fontWeight: '800', marginTop: 5 },
  dayMonth: { color: MUTED, fontSize: 10, fontWeight: '700', marginTop: 1 },
  dayTextSelected: { color: '#fff' },
  sessionDot: { backgroundColor: BLACK, borderColor: '#fff', borderRadius: 4, borderWidth: 1, bottom: 5, height: 7, position: 'absolute', width: 7 },
  sessionDotSelected: { backgroundColor: '#fff', borderColor: '#fff', borderWidth: 2 },
  nextCard: { alignItems: 'center', backgroundColor: BLACK_DARK, borderRadius: 18, flexDirection: 'row', marginTop: 22, padding: 18 },
  nextIcon: { alignItems: 'center', backgroundColor: '#333', borderRadius: 25, height: 50, justifyContent: 'center', width: 50 },
  nextCopy: { flex: 1, marginLeft: 13 },
  nextEyebrow: { color: '#aaa', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  nextTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 4 },
  nextDetails: { color: '#c7c7c7', fontSize: 12, marginTop: 4 },
  sectionHeading: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13, marginTop: 30 },
  sessionCount: { color: BLACK, fontSize: 12, fontWeight: '800' },
  sessionList: { gap: 10 },
  sessionCard: { alignItems: 'center', backgroundColor: '#fff', borderColor: BORDER, borderRadius: 16, borderWidth: 1, flexDirection: 'row', minHeight: 104, padding: 14 },
  timeColumn: { alignItems: 'center', width: 48 },
  sessionTime: { color: INK, fontSize: 17, fontWeight: '800' },
  sessionPeriod: { color: MUTED, fontSize: 10, fontWeight: '800', marginTop: 1 },
  sessionDivider: { backgroundColor: BORDER, height: 54, marginHorizontal: 12, width: 1 },
  subjectMark: { alignItems: 'center', borderRadius: 12, height: 42, justifyContent: 'center', width: 42 },
  sessionCopy: { flex: 1, marginLeft: 12 },
  subjectTitle: { color: INK, fontSize: 15, fontWeight: '800' },
  tutorName: { color: MUTED, fontSize: 12, marginTop: 4 },
  duration: { color: '#8a9a9b', fontSize: 11, fontWeight: '700', marginTop: 7 },
  tutorAvatar: { alignItems: 'center', backgroundColor: BLACK, borderRadius: 17, height: 34, justifyContent: 'center', width: 34 },
  tutorInitials: { color: '#fff', fontSize: 10, fontWeight: '800' },
  emptyState: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 30 },
  emptyTitle: { color: INK, fontSize: 16, fontWeight: '800', marginTop: 12 },
  emptyDescription: { color: MUTED, fontSize: 12, marginTop: 5 },
  bottomNav: { alignItems: 'center', backgroundColor: '#fff', borderColor: BORDER, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, paddingHorizontal: 8, paddingTop: 8 },
  tabButton: { alignItems: 'center', flex: 1, paddingHorizontal: 4, paddingTop: 2, position: 'relative' },
  tabLabel: { color: MUTED, fontSize: 12, fontWeight: '700', marginTop: 5 },
  tabLabelActive: { color: BLACK },
  tabIndicator: { backgroundColor: BLACK, borderRadius: 2, bottom: -10, height: 3, position: 'absolute', width: 20 },
  pressed: { opacity: 0.82 },
});