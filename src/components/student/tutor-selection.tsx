import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { STUDENT_COLORS, StudentIcon } from '@/components/student/student-ui';
import { tutors } from '@/components/student/tutor-data';

const subjectNames: Record<string, string> = {
  math: 'Mathematics',
  science: 'Science',
  english: 'English',
  history: 'History',
  coding: 'Coding',
  languages: 'Languages',
};

export function TutorSelectionView({ selectedSubjectIds }: { selectedSubjectIds: string[] }) {
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const selectedSubjects = selectedSubjectIds.map((id) => subjectNames[id]).filter(Boolean);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <StudentIcon ios="chevron.left" android="arrow_back" size={20} />
          </Pressable>
          <View style={styles.stepIndicator}>
            <View style={styles.stepDone} />
            <View style={styles.stepActive} />
            <View style={styles.stepPending} />
          </View>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.intro}>
          <Text style={styles.eyebrow}>STEP 2 OF 3</Text>
          <Text style={styles.title}>Find your tutor</Text>
          <Text style={styles.subtitle}>Choose someone who can help you make progress with the subjects you selected.</Text>
        </View>

        <View style={styles.subjectSummary}>
          <View style={styles.summaryIcon}>
            <StudentIcon ios="checkmark" android="check" size={16} color={STUDENT_COLORS.black} />
          </View>
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryLabel}>YOUR SUBJECTS</Text>
            <Text style={styles.summaryText}>{selectedSubjects.length > 0 ? selectedSubjects.join('  ·  ') : 'Your learning subjects'}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Recommended for you</Text>
            <Text style={styles.sectionSubtitle}>Tap a tutor to select them</Text>
          </View>
          <Text style={styles.tutorCount}>{tutors.length} tutors</Text>
        </View>

        <View style={styles.tutorList}>
          {tutors.map((tutor) => {
            const selected = selectedTutorId === tutor.id;
            return (
              <Pressable
                key={tutor.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                onPress={() => setSelectedTutorId(tutor.id)}
                style={({ pressed }) => [styles.tutorCard, selected && styles.tutorCardSelected, pressed && styles.pressed]}>
                <View style={styles.cardTopRow}>
                  <View style={styles.avatarFrame}>
                    <Image accessibilityLabel={`${tutor.name} profile`} contentFit="cover" source={{ uri: tutor.avatar }} style={styles.avatar} />
                  </View>
                  <View style={styles.tutorIdentity}>
                    <View style={styles.nameRow}>
                      <Text style={styles.tutorName}>{tutor.name}</Text>
                      <View style={styles.verifiedMark}>
                        <StudentIcon ios="checkmark" android="check" size={10} color="#fff" />
                      </View>
                    </View>
                    <View style={styles.ratingRow}>
                      <StudentIcon ios="star.fill" android="star" size={14} color={STUDENT_COLORS.black} />
                      <Text style={styles.rating}>{tutor.rating}</Text>
                      <Text style={styles.reviewCount}>({tutor.reviews} reviews)</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected && <StudentIcon ios="checkmark" android="check" size={13} color={STUDENT_COLORS.black} />}
                </View>

                <View style={styles.availabilityRow}>
                  <StudentIcon ios="calendar" android="event" size={15} color={STUDENT_COLORS.muted} />
                  <Text style={styles.availability}>{tutor.availability}</Text>
                </View>

                <View style={styles.subjectRow}>
                  {tutor.subjects.map((subject) => (
                    <View key={subject} style={styles.subjectPill}>
                      <Text style={styles.subjectPillText}>{subject}</Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push({ pathname: '/tutor-profile', params: { tutorId: tutor.id } })}
                  style={({ pressed }) => [styles.viewButton, pressed && styles.pressed]}>
                  <Text style={styles.viewButtonText}>View profile</Text>
                  <StudentIcon ios="chevron.right" android="chevron_right" size={14} />
                </Pressable>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: selectedTutorId === null }}
          disabled={selectedTutorId === null}
          onPress={() => router.push('/schedule')}
          style={({ pressed }) => [styles.continueButton, selectedTutorId === null && styles.continueButtonDisabled, pressed && styles.pressed]}>
          <Text style={styles.continueText}>Continue to schedule</Text>
          <StudentIcon ios="arrow.right" android="arrow_forward" size={17} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f5f5f5', flex: 1 },
  content: { alignSelf: 'center', maxWidth: 760, paddingBottom: 32, paddingHorizontal: 16, paddingTop: 12, width: '100%' },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  backButton: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 20, borderWidth: 1, height: 40, justifyContent: 'center', width: 40 },
  topBarSpacer: { height: 40, width: 40 },
  stepIndicator: { alignItems: 'center', flexDirection: 'row', gap: 5 },
  stepDone: { backgroundColor: STUDENT_COLORS.black, borderRadius: 3, height: 5, width: 20 },
  stepActive: { backgroundColor: STUDENT_COLORS.black, borderRadius: 3, height: 5, width: 20 },
  stepPending: { backgroundColor: '#d0d0d0', borderRadius: 3, height: 5, width: 20 },
  intro: { marginBottom: 22 },
  eyebrow: { color: STUDENT_COLORS.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.3 },
  title: { color: STUDENT_COLORS.ink, fontSize: 30, fontWeight: '800', marginTop: 7 },
  subtitle: { color: STUDENT_COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 8, maxWidth: 560 },
  subjectSummary: { alignItems: 'center', backgroundColor: STUDENT_COLORS.black, borderRadius: 16, flexDirection: 'row', marginBottom: 30, padding: 15 },
  summaryIcon: { alignItems: 'center', backgroundColor: STUDENT_COLORS.accent, borderRadius: 12, height: 38, justifyContent: 'center', width: 38 },
  summaryCopy: { flex: 1, marginLeft: 12 },
  summaryLabel: { color: '#aaa', fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  summaryText: { color: '#fff', fontSize: 13, fontWeight: '700', marginTop: 4 },
  sectionHeader: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { color: STUDENT_COLORS.ink, fontSize: 20, fontWeight: '800' },
  sectionSubtitle: { color: STUDENT_COLORS.muted, fontSize: 13, marginTop: 4 },
  tutorCount: { color: STUDENT_COLORS.black, fontSize: 12, fontWeight: '800' },
  tutorList: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tutorCard: { backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 16, borderWidth: 1, flexBasis: '45%', flexGrow: 1, minHeight: 220, minWidth: 0, padding: 16, position: 'relative' },
  tutorCardSelected: { borderColor: STUDENT_COLORS.black, borderWidth: 1.5 },
  cardTopRow: { alignItems: 'flex-start' },
  avatarFrame: { backgroundColor: '#e5e5e5', borderRadius: 29, height: 58, overflow: 'hidden', width: 58 },
  avatar: { height: '100%', width: '100%' },
  tutorIdentity: { marginTop: 12 },
  nameRow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  tutorName: { color: STUDENT_COLORS.ink, fontSize: 16, fontWeight: '800' },
  verifiedMark: { alignItems: 'center', backgroundColor: STUDENT_COLORS.black, borderRadius: 8, height: 16, justifyContent: 'center', width: 16 },
  ratingRow: { alignItems: 'center', flexDirection: 'row', gap: 5, marginTop: 6 },
  rating: { color: STUDENT_COLORS.ink, fontSize: 12, fontWeight: '800' },
  reviewCount: { color: STUDENT_COLORS.muted, fontSize: 11 },
  radio: { alignItems: 'center', borderColor: STUDENT_COLORS.border, borderRadius: 10, borderWidth: 1.5, height: 20, justifyContent: 'center', position: 'absolute', right: 14, top: 14, width: 20 },
  radioSelected: { backgroundColor: STUDENT_COLORS.accent, borderColor: STUDENT_COLORS.accent },
  availabilityRow: { alignItems: 'center', borderTopColor: '#ededed', borderTopWidth: 1, flexDirection: 'row', gap: 6, marginTop: 16, paddingTop: 12 },
  availability: { color: STUDENT_COLORS.muted, fontSize: 12, fontWeight: '700' },
  subjectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 },
  subjectPill: { backgroundColor: '#eeeeee', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 5 },
  subjectPillText: { color: STUDENT_COLORS.ink, fontSize: 11, fontWeight: '700' },
  viewButton: { alignItems: 'center', borderTopColor: '#ededed', borderTopWidth: 1, flexDirection: 'row', gap: 5, justifyContent: 'center', marginTop: 14, paddingTop: 11 },
  viewButtonText: { color: STUDENT_COLORS.black, fontSize: 12, fontWeight: '800' },
  footer: { backgroundColor: '#f5f5f5', borderTopColor: STUDENT_COLORS.border, borderTopWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
  continueButton: { alignItems: 'center', alignSelf: 'center', backgroundColor: STUDENT_COLORS.black, borderRadius: 14, flexDirection: 'row', gap: 10, justifyContent: 'center', maxWidth: 728, minHeight: 56, paddingHorizontal: 24, width: '100%' },
  continueButtonDisabled: { backgroundColor: '#b8b8b8' },
  continueText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.82 },
});
