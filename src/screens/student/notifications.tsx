import { useMemo, useState } from 'react';
import type { AndroidSymbol } from 'expo-symbols';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { SFSymbol } from 'sf-symbols-typescript';

import { STUDENT_COLORS, StudentBottomNav, StudentIcon } from '@/components/student/student-ui';

type Filter = 'All' | 'Unread';
type NotificationKind = 'schedule' | 'message' | 'progress' | 'tip';

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  kind: NotificationKind;
  unread: boolean;
  action?: 'schedule' | 'messages';
};

const notificationIcons: Record<NotificationKind, { ios: SFSymbol; android: AndroidSymbol }> = {
  schedule: { ios: 'calendar.badge.clock', android: 'event' },
  message: { ios: 'bubble.left.fill', android: 'chat_bubble' },
  progress: { ios: 'chart.bar.fill', android: 'bar_chart' },
  tip: { ios: 'lightbulb.fill', android: 'lightbulb' },
};

const notificationData: NotificationItem[] = [
  {
    id: 'maya-session',
    title: 'Your session starts tomorrow',
    body: 'Mathematics with Maya Chen is scheduled for Tuesday at 4:00 PM.',
    time: '18 min ago',
    kind: 'schedule',
    unread: true,
    action: 'schedule',
  },
  {
    id: 'maya-message',
    title: 'Maya sent you a message',
    body: 'I added two practice problems for our next session.',
    time: '2 hours ago',
    kind: 'message',
    unread: true,
    action: 'messages',
  },
  {
    id: 'weekly-goal',
    title: 'You are close to your weekly goal',
    body: 'Complete two more sessions this week to reach 5 guided lessons.',
    time: 'Yesterday',
    kind: 'progress',
    unread: false,
  },
  {
    id: 'study-tip',
    title: 'A study tip for you',
    body: 'Try explaining a new concept out loud. Teaching it helps make it stick.',
    time: 'Sep 12',
    kind: 'tip',
    unread: false,
  },
];

export default function StudentNotifications() {
  const [filter, setFilter] = useState<Filter>('All');
  const [readIds, setReadIds] = useState<string[]>([]);
  const unreadCount = notificationData.filter((item) => item.unread && !readIds.includes(item.id)).length;
  const visibleNotifications = useMemo(
    () => notificationData.filter((item) => filter === 'All' || (item.unread && !readIds.includes(item.id))),
    [filter, readIds],
  );

  function openNotification(item: NotificationItem) {
    setReadIds((current) => current.includes(item.id) ? current : [...current, item.id]);
    if (item.action === 'schedule') router.push('/schedule');
    if (item.action === 'messages') router.push('/messages');
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <Pressable accessibilityLabel="Go back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/menu'))} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <StudentIcon ios="chevron.left" android="arrow_back" size={20} />
          </Pressable>
          <View style={styles.pageHeaderCopy}>
            <Text style={styles.eyebrow}>YOUR LEARNING SPACE</Text>
            <Text style={styles.title}>Notifications</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.intro}>
          <View style={styles.introCopy}>
            <Text style={styles.eyebrow}>KEEP IN THE LOOP</Text>
            <Text style={styles.introTitle}>Small updates, steady progress.</Text>
            <Text style={styles.introText}>Reminders, messages, and helpful nudges from your learning space.</Text>
          </View>
          <View style={styles.introIcon}>
            <StudentIcon ios="bell.fill" android="notifications" color="#fff" size={24} />
          </View>
        </View>

        <View style={styles.toolbar}>
          <View style={styles.filterRow}>
            {(['All', 'Unread'] as Filter[]).map((item) => {
              const selected = filter === item;
              return (
                <Pressable
                  key={item}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  onPress={() => setFilter(item)}
                  style={({ pressed }) => [styles.filterButton, selected && styles.filterButtonSelected, pressed && styles.pressed]}>
                  <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{item}</Text>
                  {item === 'Unread' && unreadCount > 0 && <Text style={[styles.filterCount, selected && styles.filterCountSelected]}>{unreadCount}</Text>}
                </Pressable>
              );
            })}
          </View>
          {unreadCount > 0 && (
            <Pressable accessibilityRole="button" onPress={() => setReadIds(notificationData.map((item) => item.id))}>
              <Text style={styles.markRead}>Mark all read</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{filter === 'Unread' ? 'Unread updates' : 'Recent updates'}</Text>
            <Text style={styles.sectionSubtitle}>Your latest learning activity</Text>
          </View>
          <Text style={styles.count}>{visibleNotifications.length} updates</Text>
        </View>

        <View style={styles.list}>
          {visibleNotifications.map((item) => {
            const isUnread = item.unread && !readIds.includes(item.id);
            const icon = notificationIcons[item.kind];
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                onPress={() => openNotification(item)}
                style={({ pressed }) => [styles.notificationCard, isUnread && styles.notificationCardUnread, pressed && styles.pressed]}>
                <View style={[styles.notificationIcon, isUnread && styles.notificationIconUnread]}>
                  <StudentIcon ios={icon.ios} android={icon.android} color={isUnread ? STUDENT_COLORS.black : STUDENT_COLORS.muted} size={20} />
                </View>
                <View style={styles.notificationCopy}>
                  <View style={styles.notificationHeading}>
                    <Text style={[styles.notificationTitle, isUnread && styles.notificationTitleUnread]}>{item.title}</Text>
                    {isUnread && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notificationBody}>{item.body}</Text>
                  <Text style={styles.notificationTime}>{item.time}</Text>
                </View>
                {item.action && <StudentIcon ios="chevron.right" android="chevron_right" color={STUDENT_COLORS.muted} size={16} />}
              </Pressable>
            );
          })}
        </View>

        {visibleNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <StudentIcon ios="checkmark.circle.fill" android="check_circle" color={STUDENT_COLORS.muted} size={27} />
            <Text style={styles.emptyTitle}>You are all caught up</Text>
            <Text style={styles.emptyText}>New updates will appear here as your learning space changes.</Text>
          </View>
        )}
      </ScrollView>
      <StudentBottomNav activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: STUDENT_COLORS.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: 920, paddingBottom: 28, paddingHorizontal: 16, paddingTop: 12, width: '100%' },
  pageHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  backButton: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 20, borderWidth: 1, height: 40, justifyContent: 'center', width: 40 },
  pageHeaderCopy: { flex: 1, marginLeft: 12 },
  title: { color: STUDENT_COLORS.ink, fontSize: 28, fontWeight: '800', marginTop: 5 },
  headerSpacer: { height: 40, width: 40 },
  intro: { alignItems: 'center', backgroundColor: STUDENT_COLORS.blackDark, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, overflow: 'hidden', padding: 22 },
  introCopy: { flex: 1, maxWidth: 600 },
  eyebrow: { color: '#c8c8c8', fontSize: 10, fontWeight: '800', letterSpacing: 1.3 },
  introTitle: { color: '#fff', fontSize: 22, fontWeight: '800', lineHeight: 29, marginTop: 7 },
  introText: { color: '#d0d0d0', fontSize: 13, lineHeight: 19, marginTop: 7 },
  introIcon: { alignItems: 'center', backgroundColor: '#333333', borderRadius: 30, height: 60, justifyContent: 'center', marginLeft: 16, width: 60 },
  toolbar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterButton: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 17, borderWidth: 1, flexDirection: 'row', gap: 6, paddingHorizontal: 14, paddingVertical: 8 },
  filterButtonSelected: { backgroundColor: STUDENT_COLORS.black, borderColor: STUDENT_COLORS.black },
  filterText: { color: STUDENT_COLORS.muted, fontSize: 12, fontWeight: '800' },
  filterTextSelected: { color: '#fff' },
  filterCount: { color: STUDENT_COLORS.black, fontSize: 10, fontWeight: '800' },
  filterCountSelected: { color: '#fff' },
  markRead: { color: STUDENT_COLORS.black, fontSize: 11, fontWeight: '800' },
  sectionHeader: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13 },
  sectionTitle: { color: STUDENT_COLORS.ink, fontSize: 20, fontWeight: '800' },
  sectionSubtitle: { color: STUDENT_COLORS.muted, fontSize: 13, marginTop: 4 },
  count: { color: STUDENT_COLORS.black, fontSize: 12, fontWeight: '800' },
  list: { gap: 10 },
  notificationCard: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 16, borderWidth: 1, flexDirection: 'row', minHeight: 105, padding: 13 },
  notificationCardUnread: { borderColor: STUDENT_COLORS.black, borderWidth: 1.5 },
  notificationIcon: { alignItems: 'center', backgroundColor: '#eeeeee', borderRadius: 13, height: 46, justifyContent: 'center', width: 46 },
  notificationIconUnread: { backgroundColor: STUDENT_COLORS.accent },
  notificationCopy: { flex: 1, marginHorizontal: 12 },
  notificationHeading: { alignItems: 'center', flexDirection: 'row' },
  notificationTitle: { color: STUDENT_COLORS.ink, flex: 1, fontSize: 14, fontWeight: '700' },
  notificationTitleUnread: { fontWeight: '800' },
  notificationBody: { color: STUDENT_COLORS.muted, fontSize: 12, lineHeight: 17, marginTop: 5 },
  notificationTime: { color: '#8a8a8a', fontSize: 10, marginTop: 7 },
  unreadDot: { backgroundColor: STUDENT_COLORS.accent, borderRadius: 5, height: 10, marginLeft: 8, width: 10 },
  emptyState: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 30 },
  emptyTitle: { color: STUDENT_COLORS.ink, fontSize: 16, fontWeight: '800', marginTop: 12 },
  emptyText: { color: STUDENT_COLORS.muted, fontSize: 12, lineHeight: 18, marginTop: 5, textAlign: 'center' },
  pressed: { opacity: 0.82 },
});