import { useState } from 'react';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tutors } from '@/components/student/tutor-data';
import { STUDENT_COLORS, StudentIcon } from '@/components/student/student-ui';

type ConversationMessage = {
  id: string;
  text: string;
  fromTutor: boolean;
  time: string;
  picture?: boolean;
};

const starterMessages: Record<string, ConversationMessage[]> = {
  maya: [
    { id: 'maya-1', text: 'I added two practice problems for our next session.', fromTutor: true, time: '10:42 AM' },
    { id: 'maya-2', text: 'I will take a look before we meet. Thanks!', fromTutor: false, time: '10:45 AM' },
  ],
  sam: [
    { id: 'sam-1', text: 'Great progress on the loops exercise. Keep going!', fromTutor: true, time: 'Yesterday' },
  ],
  theo: [
    { id: 'theo-1', text: 'Your essay outline is looking strong. I left a few notes.', fromTutor: true, time: 'Sep 10' },
  ],
  jordan: [
    { id: 'jordan-1', text: 'Would you like to review the timeline together?', fromTutor: true, time: 'Sep 8' },
  ],
};

function currentTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function StudentConversation() {
  const { tutorId, messageId } = useLocalSearchParams<{ tutorId?: string; messageId?: string }>();
  const tutor = tutors.find((item) => item.id === tutorId) ?? tutors[0];
  const [draft, setDraft] = useState('');
  const [conversation, setConversation] = useState(starterMessages[messageId ?? ''] ?? []);
  const [showMenu, setShowMenu] = useState(false);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setConversation((current) => [...current, { id: `message-${Date.now()}`, text, fromTutor: false, time: currentTime() }]);
    setDraft('');
  };

  const sendPicture = () => {
    setConversation((current) => [...current, { id: `picture-${Date.now()}`, text: 'Photo attachment', fromTutor: false, time: currentTime(), picture: true }]);
  };

  const sendLike = () => {
    setConversation((current) => [...current, { id: `like-${Date.now()}`, text: '👍', fromTutor: false, time: currentTime() }]);
  };

  const deleteConversation = () => {
    setConversation([]);
    setShowMenu(false);
  };

  const showActionNotice = (title: string, message: string) => {
    setShowMenu(false);
    Alert.alert(title, message);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Go back to messages" onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <StudentIcon ios="chevron.left" android="arrow_back" size={20} />
          </Pressable>
          <View style={styles.tutorHeader}>
            <View style={styles.headerAvatarFrame}>
              <Image accessibilityLabel={`${tutor.name} profile`} contentFit="cover" source={{ uri: tutor.avatar }} style={styles.headerAvatar} />
              <View style={styles.onlineDot} />
            </View>
            <View>
              <Text style={styles.tutorName}>{tutor.name}</Text>
              <Text style={styles.tutorStatus}>Learnova tutor</Text>
            </View>
          </View>
          <View style={styles.menuAnchor}>
            <Pressable accessibilityLabel="Conversation options" onPress={() => setShowMenu((current) => !current)} style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}>
              <StudentIcon ios="ellipsis" android="more_vert" size={21} />
            </Pressable>
          </View>
        </View>

        <Modal animationType="fade" transparent visible={showMenu} onRequestClose={() => setShowMenu(false)}>
          <Pressable onPress={() => setShowMenu(false)} style={styles.menuOverlay}>
            <View onStartShouldSetResponder={() => true} style={styles.menu}>
              <Pressable accessibilityRole="button" onPress={() => showActionNotice('Block tutor', `You will no longer receive messages from ${tutor.name}.`)} style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
                <StudentIcon ios="nosign" android="block" size={17} color={STUDENT_COLORS.ink} />
                <Text style={styles.menuItemText}>Block</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={deleteConversation} style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
                <StudentIcon ios="trash" android="delete" size={17} color="#b42318" />
                <Text style={styles.deleteMenuItemText}>Delete message</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => showActionNotice('Report tutor', `Thanks. We will review your report about ${tutor.name}.`)} style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
                <StudentIcon ios="exclamationmark.triangle" android="report" size={17} color={STUDENT_COLORS.ink} />
                <Text style={styles.menuItemText}>Report</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>

        <ScrollView contentContainerStyle={styles.messageContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.conversationLabel}>{tutor.subjects[0]} · Conversation</Text>
          <Text style={styles.conversationDate}>Today</Text>
          {conversation.map((message) => (
            <View key={message.id} style={[styles.messageRow, !message.fromTutor && styles.messageRowMine]}>
              <View style={[styles.bubble, message.fromTutor ? styles.tutorBubble : styles.studentBubble, message.picture && styles.pictureBubble]}>
                {message.picture && <StudentIcon ios="photo" android="image" size={24} color={STUDENT_COLORS.muted} />}
                <Text style={[styles.bubbleText, !message.fromTutor && styles.studentBubbleText, message.picture && styles.pictureText]}>{message.text}</Text>
              </View>
              <Text style={[styles.messageTime, !message.fromTutor && styles.messageTimeMine]}>{message.time}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.composerArea}>
          <View style={styles.composer}>
            <Pressable accessibilityLabel="Send a picture" onPress={sendPicture} style={({ pressed }) => [styles.composerButton, pressed && styles.pressed]}>
              <StudentIcon ios="paperclip" android="attach_file" size={20} color={STUDENT_COLORS.muted} />
            </Pressable>
            <View style={styles.inputFrame}>
              <TextInput
                accessibilityLabel="Type a message"
                onChangeText={setDraft}
                onSubmitEditing={sendMessage}
                placeholder="Write a message..."
                placeholderTextColor="#999"
                returnKeyType="send"
                style={styles.input}
                value={draft}
              />
            </View>
            <Pressable accessibilityLabel="Send like" onPress={sendLike} style={({ pressed }) => [styles.composerButton, pressed && styles.pressed]}>
              <StudentIcon ios="hand.thumbsup" android="thumb_up" size={20} color={STUDENT_COLORS.muted} />
            </Pressable>
            <Pressable accessibilityLabel="Send message" disabled={!draft.trim()} onPress={sendMessage} style={({ pressed }) => [styles.sendButton, !draft.trim() && styles.sendButtonDisabled, pressed && styles.pressed]}>
              <StudentIcon ios="arrow.up" android="send" size={17} color="#fff" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: STUDENT_COLORS.background, flex: 1 },
  screen: { flex: 1 },
  header: { alignItems: 'center', backgroundColor: '#fff', borderBottomColor: STUDENT_COLORS.border, borderBottomWidth: 1, flexDirection: 'row', minHeight: 72, paddingHorizontal: 16 },
  backButton: { alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 20, height: 40, justifyContent: 'center', width: 40 },
  tutorHeader: { alignItems: 'center', flex: 1, flexDirection: 'row', marginLeft: 12 },
  headerAvatarFrame: { backgroundColor: '#e5e5e5', borderRadius: 21, height: 42, overflow: 'hidden', position: 'relative', width: 42 },
  headerAvatar: { height: '100%', width: '100%' },
  onlineDot: { backgroundColor: STUDENT_COLORS.accent, borderColor: '#fff', borderRadius: 5, borderWidth: 2, bottom: 0, height: 10, position: 'absolute', right: 0, width: 10 },
  tutorName: { color: STUDENT_COLORS.ink, fontSize: 15, fontWeight: '800', marginLeft: 10 },
  tutorStatus: { color: STUDENT_COLORS.muted, fontSize: 11, marginLeft: 10, marginTop: 3 },
  menuAnchor: { width: 40 },
  menuButton: { alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 20, height: 40, justifyContent: 'center', width: 40 },
  menuOverlay: { alignItems: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.12)', flex: 1, paddingRight: 16, paddingTop: 76 },
  menu: { backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 12, borderWidth: 1, elevation: 10, minWidth: 175, paddingVertical: 5, shadowColor: '#000', shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.2, shadowRadius: 8 },
  menuItem: { alignItems: 'center', flexDirection: 'row', gap: 10, minHeight: 42, paddingHorizontal: 13 },
  menuItemPressed: { backgroundColor: '#f3f3f3' },
  menuItemText: { color: STUDENT_COLORS.ink, fontSize: 13, fontWeight: '700' },
  deleteMenuItemText: { color: '#b42318', fontSize: 13, fontWeight: '700' },
  messageContent: { alignSelf: 'center', maxWidth: 760, padding: 16, paddingBottom: 28, width: '100%' },
  conversationLabel: { color: STUDENT_COLORS.muted, fontSize: 11, fontWeight: '800', letterSpacing: 0.8, textAlign: 'center', textTransform: 'uppercase' },
  conversationDate: { color: STUDENT_COLORS.muted, fontSize: 11, marginBottom: 20, marginTop: 7, textAlign: 'center' },
  messageRow: { alignItems: 'flex-start', marginBottom: 16 },
  messageRowMine: { alignItems: 'flex-end' },
  bubble: { borderRadius: 17, maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 11 },
  tutorBubble: { backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderWidth: 1, borderBottomLeftRadius: 5 },
  studentBubble: { backgroundColor: STUDENT_COLORS.black, borderBottomRightRadius: 5 },
  pictureBubble: { alignItems: 'center', backgroundColor: '#ededed', flexDirection: 'row', gap: 8 },
  bubbleText: { color: STUDENT_COLORS.ink, fontSize: 14, lineHeight: 20 },
  studentBubbleText: { color: '#fff' },
  pictureText: { color: STUDENT_COLORS.muted, fontWeight: '700' },
  messageTime: { color: STUDENT_COLORS.muted, fontSize: 10, marginLeft: 5, marginTop: 5 },
  messageTimeMine: { marginRight: 5 },
  composerArea: { backgroundColor: '#fff', borderTopColor: STUDENT_COLORS.border, borderTopWidth: 1, paddingHorizontal: 12, paddingTop: 10 },
  composer: { alignItems: 'center', alignSelf: 'center', flexDirection: 'row', gap: 4, maxWidth: 760, minHeight: 54, width: '100%' },
  composerButton: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 20, borderWidth: 1, height: 40, justifyContent: 'center', width: 40 },
  inputFrame: { backgroundColor: '#f3f3f3', borderColor: STUDENT_COLORS.border, borderRadius: 17, borderWidth: 1, flex: 1 },
  input: { color: STUDENT_COLORS.ink, fontSize: 14, minHeight: 42, paddingHorizontal: 12 },
  sendButton: { alignItems: 'center', backgroundColor: STUDENT_COLORS.black, borderRadius: 17, height: 34, justifyContent: 'center', width: 34 },
  sendButtonDisabled: { backgroundColor: '#b8b8b8' },
  pressed: { opacity: 0.82 },
});