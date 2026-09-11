import { useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tutors } from '@/components/student/tutor-data';
import { STUDENT_COLORS, StudentBottomNav, StudentIcon } from '@/components/student/student-ui';

type Filter = 'All' | 'Unread';

type Message = {
  id: string;
  tutorId: string;
  preview: string;
  time: string;
  unread: number;
  subject: string;
};

const messages: Message[] = [
  { id: 'maya', tutorId: 'maya-chen', preview: 'I added two practice problems for our next session.', time: '10:42 AM', unread: 2, subject: 'Mathematics' },
  { id: 'sam', tutorId: 'sam-rivera', preview: 'Great progress on the loops exercise. Keep going!', time: 'Yesterday', unread: 1, subject: 'Coding' },
  { id: 'theo', tutorId: 'theo-brooks', preview: 'Your essay outline is looking strong. I left a few notes.', time: 'Sep 10', unread: 0, subject: 'English' },
  { id: 'jordan', tutorId: 'jordan-lee', preview: 'Would you like to review the timeline together?', time: 'Sep 8', unread: 0, subject: 'History' },
];

export function MessagesView() {
  const [filter, setFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');
  const [readIds, setReadIds] = useState<string[]>([]);
  const normalizedQuery = query.trim().toLowerCase();
  const unreadCount = messages.reduce((total, message) => total + (readIds.includes(message.id) ? 0 : message.unread), 0);
  const visibleMessages = useMemo(
    () => messages.filter((message) => {
      const tutor = tutors.find((item) => item.id === message.tutorId);
      const matchesFilter = filter === 'All' || (!readIds.includes(message.id) && message.unread > 0);
      const matchesQuery = `${tutor?.name ?? ''} ${message.subject} ${message.preview}`.toLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    }),
    [filter, normalizedQuery, readIds],
  );

  function openMessage(message: Message) {
    setReadIds((current) => current.includes(message.id) ? current : [...current, message.id]);
    const tutor = tutors.find((item) => item.id === message.tutorId);
    Alert.alert(tutor?.name ?? 'Tutor message', 'Conversation view will be available when messaging is connected.');
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.eyebrow}>YOUR LEARNING SPACE</Text>
            <Text style={styles.title}>Messages</Text>
            <Text style={styles.subtitle}>Stay connected with your tutors</Text>
          </View>
          <View style={styles.messageCount}>
            <Text style={styles.messageCountValue}>{unreadCount}</Text>
            <Text style={styles.messageCountLabel}>UNREAD</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <StudentIcon ios="magnifyingglass" android="search" size={18} color={STUDENT_COLORS.muted} />
          <TextInput
            accessibilityLabel="Search messages"
            onChangeText={setQuery}
            placeholder="Search messages"
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={query}
          />
          {query.length > 0 && (
            <Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')} style={styles.clearButton}>
              <StudentIcon ios="xmark.circle.fill" android="cancel" size={18} color={STUDENT_COLORS.muted} />
            </Pressable>
          )}
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
            <Pressable accessibilityRole="button" onPress={() => setReadIds(messages.map((message) => message.id))}>
              <Text style={styles.markRead}>Mark all read</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{filter === 'Unread' ? 'Unread messages' : 'Recent conversations'}</Text>
            <Text style={styles.sectionSubtitle}>Messages from your learning team</Text>
          </View>
          <Text style={styles.messageTotal}>{visibleMessages.length} chats</Text>
        </View>

        <View style={styles.messageList}>
          {visibleMessages.map((message) => {
            const tutor = tutors.find((item) => item.id === message.tutorId) ?? tutors[0];
            const isUnread = !readIds.includes(message.id) && message.unread > 0;
            return (
              <Pressable
                key={message.id}
                accessibilityRole="button"
                onPress={() => openMessage(message)}
                style={({ pressed }) => [styles.messageCard, isUnread && styles.messageCardUnread, pressed && styles.pressed]}>
                <View style={styles.avatarFrame}>
                  <Image accessibilityLabel={`${tutor.name} profile`} contentFit="cover" source={{ uri: tutor.avatar }} style={styles.avatar} />
                  <View style={styles.onlineDot} />
                </View>
                <View style={styles.messageCopy}>
                  <View style={styles.messageHeading}>
                    <Text style={[styles.tutorName, isUnread && styles.tutorNameUnread]}>{tutor.name}</Text>
                    <Text style={styles.messageTime}>{message.time}</Text>
                  </View>
                  <Text style={styles.subject}>{message.subject}</Text>
                  <Text numberOfLines={2} style={[styles.preview, isUnread && styles.previewUnread]}>{message.preview}</Text>
                </View>
                <View style={styles.messageMeta}>
                  {isUnread && <View style={styles.unreadDot} />}
                  <StudentIcon ios="chevron.right" android="chevron_right" size={16} color={STUDENT_COLORS.muted} />
                </View>
              </Pressable>
            );
          })}
        </View>

        {visibleMessages.length === 0 && (
          <View style={styles.emptyState}>
            <StudentIcon ios="bubble.left.and.bubble.right" android="forum" size={26} color={STUDENT_COLORS.muted} />
            <Text style={styles.emptyTitle}>No messages found</Text>
            <Text style={styles.emptyText}>Try a different search or filter.</Text>
          </View>
        )}
      </ScrollView>
      <StudentBottomNav activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f5f5f5', flex: 1 },
  content: { alignSelf: 'center', maxWidth: 920, paddingBottom: 28, paddingHorizontal: 16, paddingTop: 12, width: '100%' },
  pageHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  eyebrow: { color: STUDENT_COLORS.black, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: STUDENT_COLORS.ink, fontSize: 28, fontWeight: '800', marginTop: 5 },
  subtitle: { color: STUDENT_COLORS.muted, fontSize: 13, marginTop: 5 },
  messageCount: { alignItems: 'center', backgroundColor: STUDENT_COLORS.accent, borderRadius: 15, minWidth: 72, paddingHorizontal: 12, paddingVertical: 9 },
  messageCountValue: { color: STUDENT_COLORS.black, fontSize: 19, fontWeight: '800' },
  messageCountLabel: { color: STUDENT_COLORS.black, fontSize: 9, fontWeight: '800', letterSpacing: 0.6, marginTop: 1 },
  searchBar: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 14, borderWidth: 1, flexDirection: 'row', marginBottom: 16, paddingHorizontal: 14 },
  searchInput: { color: STUDENT_COLORS.ink, flex: 1, fontSize: 14, minHeight: 50, paddingHorizontal: 10 },
  clearButton: { padding: 4 },
  toolbar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 26 },
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
  messageTotal: { color: STUDENT_COLORS.black, fontSize: 12, fontWeight: '800' },
  messageList: { gap: 10 },
  messageCard: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 16, borderWidth: 1, flexDirection: 'row', minHeight: 96, padding: 13 },
  messageCardUnread: { borderColor: STUDENT_COLORS.black, borderWidth: 1.5 },
  avatarFrame: { backgroundColor: '#e5e5e5', borderRadius: 25, height: 50, overflow: 'hidden', position: 'relative', width: 50 },
  avatar: { height: '100%', width: '100%' },
  onlineDot: { backgroundColor: STUDENT_COLORS.accent, borderColor: '#fff', borderRadius: 5, borderWidth: 2, bottom: 1, height: 10, position: 'absolute', right: 1, width: 10 },
  messageCopy: { flex: 1, marginHorizontal: 12 },
  messageHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  tutorName: { color: STUDENT_COLORS.ink, fontSize: 15, fontWeight: '700' },
  tutorNameUnread: { fontWeight: '800' },
  messageTime: { color: STUDENT_COLORS.muted, fontSize: 10 },
  subject: { color: STUDENT_COLORS.black, fontSize: 10, fontWeight: '800', marginTop: 3 },
  preview: { color: STUDENT_COLORS.muted, fontSize: 12, lineHeight: 17, marginTop: 5 },
  previewUnread: { color: STUDENT_COLORS.ink, fontWeight: '600' },
  messageMeta: { alignItems: 'center', gap: 9 },
  unreadDot: { backgroundColor: STUDENT_COLORS.accent, borderRadius: 5, height: 10, width: 10 },
  emptyState: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 30 },
  emptyTitle: { color: STUDENT_COLORS.ink, fontSize: 16, fontWeight: '800', marginTop: 12 },
  emptyText: { color: STUDENT_COLORS.muted, fontSize: 12, marginTop: 5 },
  pressed: { opacity: 0.82 },
});
