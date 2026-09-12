import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Tutor } from '@/components/student/tutor-data';
import { STUDENT_COLORS, StudentIcon } from '@/components/student/student-ui';

export function TutorProfileView({ tutor }: { tutor: Tutor }) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable accessibilityLabel="Go back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/tutors'))} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <StudentIcon ios="chevron.left" android="arrow_back" size={20} />
          </Pressable>
          <Text style={styles.topBarTitle}>Tutor profile</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.profileHero}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarFrame}>
              <Image accessibilityLabel={`${tutor.name} profile`} contentFit="cover" source={{ uri: tutor.avatar }} style={styles.avatar} />
            </View>
            <View style={styles.verifiedMark}>
              <StudentIcon ios="checkmark" android="check" size={12} color={STUDENT_COLORS.black} />
            </View>
          </View>
          <Text style={styles.name}>{tutor.name}</Text>
          <Text style={styles.role}>Learnova tutor</Text>
          <View style={styles.subjectRow}>
            {tutor.subjects.map((subject) => (
              <View key={subject} style={styles.subjectPill}>
                <Text style={styles.subjectPillText}>{subject}</Text>
              </View>
            ))}
          </View>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <StudentIcon ios="star.fill" android="star" size={15} color="#fff" />
              <Text style={styles.heroStatValue}>{tutor.rating}</Text>
              <Text style={styles.heroStatLabel}>rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.heroStat}>
              <StudentIcon ios="person.2.fill" android="groups" size={15} color="#fff" />
              <Text style={styles.heroStatValue}>{tutor.studentsTutored}</Text>
              <Text style={styles.heroStatLabel}>students tutored</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.heroStat}>
              <StudentIcon ios="text.bubble.fill" android="reviews" size={15} color="#fff" />
              <Text style={styles.heroStatValue}>{tutor.reviews}</Text>
              <Text style={styles.heroStatLabel}>reviews</Text>
            </View>
          </View>
        </View>

        <View style={styles.contactCard}>
          <View style={styles.contactIcon}>
            <StudentIcon ios="phone.fill" android="phone" size={18} />
          </View>
          <View style={styles.contactCopy}>
            <Text style={styles.cardEyebrow}>CONTACT</Text>
            <Text style={styles.phone}>{tutor.phone}</Text>
          </View>
          <Text style={styles.contactAvailability}>{tutor.availability}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => Alert.alert('Message tutor', `Messaging ${tutor.name} will be available soon.`)}
          style={({ pressed }) => [styles.messageButton, pressed && styles.pressed]}>
          <StudentIcon ios="bubble.left.fill" android="chat_bubble" size={17} color={STUDENT_COLORS.black} />
          <Text style={styles.messageButtonText}>Message tutor</Text>
        </Pressable>

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>About {tutor.name.split(' ')[0]}</Text>
          <StudentIcon ios="person.text.rectangle" android="badge" size={20} />
        </View>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>{tutor.bio}</Text>
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Weekly availability</Text>
            <Text style={styles.sectionSubtitle}>Times this tutor usually teaches</Text>
          </View>
          <StudentIcon ios="calendar" android="event" size={20} />
        </View>
        <View style={styles.availabilityCard}>
          {tutor.weeklyAvailability.map((slot, index) => (
            <View key={slot.day} style={[styles.availabilityRow, index < tutor.weeklyAvailability.length - 1 && styles.availabilityRowBorder]}>
              <Text style={styles.day}>{slot.day}</Text>
              <Text style={styles.time}>{slot.time}</Text>
              <View style={styles.openBadge}>
                <Text style={styles.openBadgeText}>Open</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>What students say</Text>
            <Text style={styles.sectionSubtitle}>{tutor.reviews} reviews from learners</Text>
          </View>
          <View style={styles.ratingBadge}>
            <StudentIcon ios="star.fill" android="star" size={13} />
            <Text style={styles.ratingBadgeText}>{tutor.rating}</Text>
          </View>
        </View>
        <View style={styles.reviewList}>
          {tutor.reviewComments.map((review) => (
            <View key={review.name} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerAvatar}>
                  <Text style={styles.reviewerInitials}>{review.name.slice(0, 1)}</Text>
                </View>
                <View style={styles.reviewerCopy}>
                  <Text style={styles.reviewerName}>{review.name}</Text>
                  <View style={styles.reviewRating}>
                    <StudentIcon ios="star.fill" android="star" size={12} />
                    <Text style={styles.reviewRatingText}>{review.rating}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/tutors'))} style={({ pressed }) => [styles.backToTutorsButton, pressed && styles.pressed]}>
          <Text style={styles.backToTutorsText}>Back to tutors</Text>
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
  topBarTitle: { color: STUDENT_COLORS.ink, fontSize: 20, fontWeight: '800' },
  topBarSpacer: { height: 40, width: 40 },
  profileHero: { alignItems: 'center', backgroundColor: STUDENT_COLORS.black, borderRadius: 22, padding: 24 },
  avatarContainer: { height: 100, position: 'relative', width: 100 },
  avatarFrame: { backgroundColor: '#333', borderRadius: 46, height: 92, overflow: 'hidden', width: 92 },
  avatar: { height: '100%', width: '100%' },
  verifiedMark: { alignItems: 'center', backgroundColor: STUDENT_COLORS.accent, borderColor: STUDENT_COLORS.black, borderRadius: 13, borderWidth: 3, bottom: 3, height: 27, justifyContent: 'center', position: 'absolute', right: 4, width: 27 },
  name: { color: '#fff', fontSize: 23, fontWeight: '800', marginTop: 12 },
  role: { color: '#aaa', fontSize: 13, marginTop: 4 },
  subjectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, justifyContent: 'center', marginTop: 13 },
  subjectPill: { backgroundColor: '#333', borderRadius: 11, paddingHorizontal: 10, paddingVertical: 6 },
  subjectPillText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  heroStats: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 23, width: '100%' },
  heroStat: { alignItems: 'center', flex: 1, gap: 3 },
  heroStatValue: { color: '#fff', fontSize: 17, fontWeight: '800' },
  heroStatLabel: { color: '#aaa', fontSize: 10, textAlign: 'center' },
  statDivider: { backgroundColor: '#3c3c3c', height: 34, width: 1 },
  contactCard: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 16, borderWidth: 1, flexDirection: 'row', marginTop: 14, padding: 14 },
  contactIcon: { alignItems: 'center', backgroundColor: '#eeeeee', borderRadius: 12, height: 42, justifyContent: 'center', width: 42 },
  contactCopy: { flex: 1, marginLeft: 12 },
  cardEyebrow: { color: STUDENT_COLORS.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  phone: { color: STUDENT_COLORS.ink, fontSize: 13, fontWeight: '800', marginTop: 4 },
  contactAvailability: { color: STUDENT_COLORS.black, fontSize: 11, fontWeight: '800', maxWidth: 100, textAlign: 'right' },
  sectionHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13, marginTop: 28 },
  sectionTitle: { color: STUDENT_COLORS.ink, fontSize: 20, fontWeight: '800' },
  sectionSubtitle: { color: STUDENT_COLORS.muted, fontSize: 13, marginTop: 4 },
  aboutCard: { backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 16, borderWidth: 1, padding: 17 },
  aboutText: { color: STUDENT_COLORS.muted, fontSize: 13, lineHeight: 21 },
  availabilityCard: { backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16 },
  availabilityRow: { alignItems: 'center', minHeight: 52, flexDirection: 'row' },
  availabilityRowBorder: { borderBottomColor: '#ededed', borderBottomWidth: 1 },
  day: { color: STUDENT_COLORS.ink, fontSize: 13, fontWeight: '800', width: 58 },
  time: { color: STUDENT_COLORS.muted, flex: 1, fontSize: 12 },
  openBadge: { backgroundColor: STUDENT_COLORS.accent, borderRadius: 9, paddingHorizontal: 8, paddingVertical: 5 },
  openBadgeText: { color: STUDENT_COLORS.ink, fontSize: 10, fontWeight: '800' },
  ratingBadge: { alignItems: 'center', backgroundColor: STUDENT_COLORS.accent, borderRadius: 11, flexDirection: 'row', gap: 4, paddingHorizontal: 9, paddingVertical: 6 },
  ratingBadgeText: { color: STUDENT_COLORS.ink, fontSize: 11, fontWeight: '800' },
  reviewList: { gap: 10 },
  reviewCard: { backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 16, borderWidth: 1, padding: 16 },
  reviewHeader: { alignItems: 'center', flexDirection: 'row' },
  reviewerAvatar: { alignItems: 'center', backgroundColor: STUDENT_COLORS.black, borderRadius: 17, height: 34, justifyContent: 'center', width: 34 },
  reviewerInitials: { color: '#fff', fontSize: 12, fontWeight: '800' },
  reviewerCopy: { marginLeft: 10 },
  reviewerName: { color: STUDENT_COLORS.ink, fontSize: 13, fontWeight: '800' },
  reviewRating: { alignItems: 'center', flexDirection: 'row', gap: 4, marginTop: 3 },
  reviewRatingText: { color: STUDENT_COLORS.muted, fontSize: 11, fontWeight: '700' },
  reviewComment: { color: STUDENT_COLORS.muted, fontSize: 12, lineHeight: 18, marginTop: 12 },
  footer: { backgroundColor: '#f5f5f5', borderTopColor: STUDENT_COLORS.border, borderTopWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
  messageButton: { alignItems: 'center', alignSelf: 'center', backgroundColor: STUDENT_COLORS.accent, borderRadius: 14, flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 14, maxWidth: 728, minHeight: 54, width: '100%' },
  messageButtonText: { color: STUDENT_COLORS.black, fontSize: 15, fontWeight: '800' },
  backToTutorsButton: { alignItems: 'center', alignSelf: 'center', backgroundColor: STUDENT_COLORS.black, borderRadius: 14, justifyContent: 'center', marginTop: 8, maxWidth: 728, minHeight: 46, width: '100%' },
  backToTutorsText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.82 },
});
