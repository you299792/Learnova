import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StudentIcon as Icon } from '@/components/student/student-ui';

const BLACK = '#111111';
const BLACK_DARK = '#000000';
const INK = '#111111';
const MUTED = '#666666';
const BORDER = '#d6d6d6';
const ACCENT = '#FED701';

const subjects = [
  { name: 'Mathematics', tutor: 'Maya Chen', color: '#e7e7e7' },
  { name: 'English writing', tutor: 'Theo Brooks', color: '#ededed' },
  { name: 'Intro to coding', tutor: 'Sam Rivera', color: '#e4e4e4' },
];

export default function StudentProfile() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <Icon ios="chevron.left" android="arrow_back" size={20} />
          </Pressable>
          <Text style={styles.topBarTitle}>Profile</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.profileHero}>
          <View style={styles.profileAvatar}>
            <Image
              accessibilityLabel="Alex Morgan profile picture"
              contentFit="cover"
              source={{ uri: 'https://i.scdn.co/image/ab67616d00001e028f33770d5cb6b7bbbd59686a' }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.name}>Batu Khan</Text>
          <Text style={styles.role}>Student account</Text>
          <Text style={styles.email}>batu_khan@gmail.com</Text>
          <Pressable style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}>
            <Icon ios="pencil" android="edit" size={15} color={BLACK} />
            <Text style={styles.editButtonText}>Edit profile</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Recent subjects</Text>
            <Text style={styles.sectionSubtitle}>Subjects you&apos;ve been learning recently</Text>
          </View>
          <Icon ios="book.closed.fill" android="menu_book" size={21} color={BLACK} />
        </View>

        <View style={styles.subjectList}>
          {subjects.map((subject) => (
            <View key={subject.name} style={styles.subjectCard}>
              <View style={[styles.subjectIcon, { backgroundColor: subject.color }]}>
                <Icon ios="book.fill" android="menu_book" size={19} />
              </View>
              <View style={styles.subjectCopy}>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text style={styles.subjectTutor}>with {subject.tutor}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon ios="phone.fill" android="phone" size={18} color={MUTED} />
            <Text style={styles.infoLabel}>Mobile number</Text>
            <Text style={styles.infoValue}>+1 (555) 014-7826</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon ios="calendar" android="event" size={18} color={MUTED} />
            <Text style={styles.infoLabel}>Member since</Text>
            <Text style={styles.infoValue}>September 2025</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon ios="clock" android="schedule" size={18} color={MUTED} />
            <Text style={styles.infoLabel}>Preferred study time</Text>
            <Text style={styles.infoValue}>Afternoons</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f5f5f5', flex: 1 },
  content: { alignSelf: 'center', maxWidth: 920, paddingBottom: 32, paddingHorizontal: 16, paddingTop: 12, width: '100%' },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  backButton: { alignItems: 'center', backgroundColor: '#fff', borderColor: BORDER, borderRadius: 20, borderWidth: 1, height: 40, justifyContent: 'center', width: 40 },
  topBarTitle: { color: INK, fontSize: 20, fontWeight: '800' },
  topBarSpacer: { height: 40, width: 40 },
  profileHero: { alignItems: 'center', backgroundColor: BLACK_DARK, borderRadius: 20, padding: 24 },
  profileAvatar: { alignItems: 'center', backgroundColor: '#333', borderRadius: 40, height: 80, justifyContent: 'center', width: 80 },
  profileImage: { borderRadius: 40, height: '100%', width: '100%' },
  name: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 14 },
  role: { color: '#c7c7c7', fontSize: 13, marginTop: 4 },
  email: { color: '#999', fontSize: 12, marginTop: 5 },
  editButton: { alignItems: 'center', backgroundColor: ACCENT, borderRadius: 18, flexDirection: 'row', gap: 7, marginTop: 16, paddingHorizontal: 15, paddingVertical: 9 },
  editButtonText: { color: BLACK, fontSize: 12, fontWeight: '800' },
  sectionHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13, marginTop: 28 },
  sectionTitle: { color: INK, fontSize: 20, fontWeight: '800' },
  sectionSubtitle: { color: MUTED, fontSize: 13, marginTop: 4 },
  subjectList: { gap: 10 },
  subjectCard: { alignItems: 'center', backgroundColor: '#fff', borderColor: BORDER, borderRadius: 16, borderWidth: 1, flexDirection: 'row', padding: 13 },
  subjectIcon: { alignItems: 'center', borderRadius: 12, height: 42, justifyContent: 'center', width: 42 },
  subjectCopy: { flex: 1, marginLeft: 12 },
  subjectName: { color: INK, fontSize: 14, fontWeight: '800' },
  subjectTutor: { color: MUTED, fontSize: 11, marginTop: 4 },
  infoCard: { backgroundColor: '#fff', borderColor: BORDER, borderRadius: 16, borderWidth: 1, marginTop: 14, paddingHorizontal: 16 },
  infoRow: { alignItems: 'center', borderBottomColor: '#ededed', borderBottomWidth: 1, flexDirection: 'row', minHeight: 52 },
  infoLabel: { color: MUTED, flex: 1, fontSize: 12, marginLeft: 10 },
  infoValue: { color: INK, fontSize: 12, fontWeight: '700' },
  pressed: { opacity: 0.82 },
});