import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { STUDENT_COLORS, StudentBottomNav, StudentIcon } from '@/components/student/student-ui';

type StudyGoal = '3 sessions' | '5 sessions' | '7 sessions';
type StudyTime = 'Morning' | 'Afternoon' | 'Evening';

const studyGoals: StudyGoal[] = ['3 sessions', '5 sessions', '7 sessions'];
const studyTimes: StudyTime[] = ['Morning', 'Afternoon', 'Evening'];

export default function StudentSettings() {
  const [studyReminders, setStudyReminders] = useState(true);
  const [sessionAlerts, setSessionAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [studyGoal, setStudyGoal] = useState<StudyGoal>('5 sessions');
  const [studyTime, setStudyTime] = useState<StudyTime>('Afternoon');

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable accessibilityLabel="Go back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/menu'))} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <StudentIcon ios="chevron.left" android="arrow_back" size={20} />
          </Pressable>
          <Text style={styles.topBarTitle}>Settings</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <StudentIcon ios="gearshape.fill" android="settings" color={STUDENT_COLORS.black} size={23} />
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Make Learnova work for you.</Text>
            <Text style={styles.heroText}>Shape reminders and goals around the way you learn best.</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Learning preferences</Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>WEEKLY STUDY GOAL</Text>
          <Text style={styles.cardHint}>How many guided sessions would you like to complete?</Text>
          <View style={styles.optionRow}>
            {studyGoals.map((goal) => {
              const selected = studyGoal === goal;
              return (
                <Pressable
                  key={goal}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => setStudyGoal(goal)}
                  style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.pressed]}>
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{goal.replace(' sessions', '')}</Text>
                  <Text style={[styles.optionCaption, selected && styles.optionCaptionSelected]}>sessions</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>PREFERRED STUDY TIME</Text>
          <Text style={styles.cardHint}>We will use this when suggesting your next session.</Text>
          <View style={styles.timeRow}>
            {studyTimes.map((time) => {
              const selected = studyTime === time;
              return (
                <Pressable
                  key={time}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => setStudyTime(time)}
                  style={({ pressed }) => [styles.timeOption, selected && styles.timeOptionSelected, pressed && styles.pressed]}>
                  <StudentIcon
                    ios={time === 'Morning' ? 'sunrise.fill' : time === 'Afternoon' ? 'sun.max.fill' : 'moon.fill'}
                    android={time === 'Morning' ? 'wb_twilight' : time === 'Afternoon' ? 'light_mode' : 'dark_mode'}
                    color={selected ? STUDENT_COLORS.black : STUDENT_COLORS.muted}
                    size={16}
                  />
                  <Text style={[styles.timeText, selected && styles.timeTextSelected]}>{time}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <SettingRow
            icon="bell.fill"
            androidIcon="notifications"
            title="Study reminders"
            description="A gentle nudge when it is time to learn"
            value={studyReminders}
            onValueChange={setStudyReminders}
          />
          <SettingRow
            icon="calendar.badge.clock"
            androidIcon="event"
            title="Session alerts"
            description="Remind me before a tutor session begins"
            value={sessionAlerts}
            onValueChange={setSessionAlerts}
          />
          <SettingRow
            icon="chart.bar.fill"
            androidIcon="bar_chart"
            title="Weekly progress summary"
            description="Send a recap of your learning momentum"
            value={weeklySummary}
            onValueChange={setWeeklySummary}
            last
          />
        </View>

        <Text style={styles.sectionTitle}>App & support</Text>
        <View style={styles.card}>
          <ActionRow icon="questionmark.circle" androidIcon="help_outline" title="Help center" description="Find answers about your learning space" onPress={() => Alert.alert('Help center', 'Support resources will be available here soon.')} />
          <ActionRow icon="lock.shield.fill" androidIcon="security" title="Privacy and security" description="Review how your account information is used" onPress={() => Alert.alert('Privacy and security', 'Your learning data stays private to your account.')} />
          <ActionRow icon="info.circle" androidIcon="info" title="About Learnova" description="Version 1.0.0" onPress={() => Alert.alert('Learnova', 'Peer tutoring that helps you keep moving forward.')} last />
        </View>
      </ScrollView>
      <StudentBottomNav activeTab="menu" />
    </SafeAreaView>
  );
}

function SettingRow({
  icon,
  androidIcon,
  title,
  description,
  value,
  onValueChange,
  last = false,
}: {
  icon: 'bell.fill' | 'calendar.badge.clock' | 'chart.bar.fill';
  androidIcon: 'notifications' | 'event' | 'bar_chart';
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.settingRow, !last && styles.rowBorder]}>
      <View style={styles.rowIcon}>
        <StudentIcon ios={icon} android={androidIcon} color={STUDENT_COLORS.black} size={18} />
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch
        accessibilityLabel={title}
        onValueChange={onValueChange}
        thumbColor={value ? STUDENT_COLORS.accent : '#f5f5f5'}
        trackColor={{ false: '#d9d9d9', true: STUDENT_COLORS.accent }}
        value={value}
      />
    </View>
  );
}

function ActionRow({
  icon,
  androidIcon,
  title,
  description,
  onPress,
  last = false,
}: {
  icon: 'questionmark.circle' | 'lock.shield.fill' | 'info.circle';
  androidIcon: 'help_outline' | 'security' | 'info';
  title: string;
  description: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.settingRow, !last && styles.rowBorder, pressed && styles.pressed]}>
      <View style={styles.rowIcon}>
        <StudentIcon ios={icon} android={androidIcon} color={STUDENT_COLORS.black} size={18} />
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <StudentIcon ios="chevron.right" android="chevron_right" color={STUDENT_COLORS.muted} size={17} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: STUDENT_COLORS.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: 920, paddingBottom: 28, paddingHorizontal: 16, paddingTop: 12, width: '100%' },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  backButton: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 20, borderWidth: 1, height: 40, justifyContent: 'center', width: 40 },
  topBarTitle: { color: STUDENT_COLORS.ink, fontSize: 20, fontWeight: '800' },
  topBarSpacer: { height: 40, width: 40 },
  hero: { alignItems: 'center', backgroundColor: STUDENT_COLORS.blackDark, borderRadius: 20, flexDirection: 'row', padding: 20 },
  heroIcon: { alignItems: 'center', backgroundColor: STUDENT_COLORS.accent, borderRadius: 28, height: 56, justifyContent: 'center', width: 56 },
  heroCopy: { flex: 1, marginLeft: 15 },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '800', lineHeight: 26 },
  heroText: { color: '#c8c8c8', fontSize: 12, lineHeight: 18, marginTop: 5 },
  sectionTitle: { color: STUDENT_COLORS.ink, fontSize: 20, fontWeight: '800', marginBottom: 13, marginTop: 28 },
  card: { backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16 },
  cardLabel: { color: STUDENT_COLORS.black, fontSize: 10, fontWeight: '800', letterSpacing: 1.1, marginTop: 17 },
  cardHint: { color: STUDENT_COLORS.muted, fontSize: 12, lineHeight: 17, marginTop: 5 },
  optionRow: { flexDirection: 'row', gap: 8, marginBottom: 17, marginTop: 14 },
  option: { alignItems: 'center', backgroundColor: '#f3f3f3', borderColor: '#f3f3f3', borderRadius: 11, borderWidth: 1, flex: 1, paddingVertical: 9 },
  optionSelected: { backgroundColor: STUDENT_COLORS.accent, borderColor: STUDENT_COLORS.black },
  optionText: { color: STUDENT_COLORS.ink, fontSize: 15, fontWeight: '800' },
  optionTextSelected: { color: STUDENT_COLORS.black },
  optionCaption: { color: STUDENT_COLORS.muted, fontSize: 10, marginTop: 1 },
  optionCaptionSelected: { color: STUDENT_COLORS.black },
  timeRow: { flexDirection: 'row', gap: 8, marginBottom: 17, marginTop: 14 },
  timeOption: { alignItems: 'center', backgroundColor: '#f3f3f3', borderColor: '#f3f3f3', borderRadius: 11, borderWidth: 1, flex: 1, flexDirection: 'row', gap: 5, justifyContent: 'center', paddingVertical: 11 },
  timeOptionSelected: { backgroundColor: STUDENT_COLORS.accent, borderColor: STUDENT_COLORS.black },
  timeText: { color: STUDENT_COLORS.muted, fontSize: 11, fontWeight: '800' },
  timeTextSelected: { color: STUDENT_COLORS.black },
  settingRow: { alignItems: 'center', flexDirection: 'row', minHeight: 76, paddingVertical: 11 },
  rowBorder: { borderBottomColor: '#ededed', borderBottomWidth: 1 },
  rowIcon: { alignItems: 'center', backgroundColor: '#eeeeee', borderRadius: 11, height: 40, justifyContent: 'center', width: 40 },
  rowCopy: { flex: 1, marginHorizontal: 12 },
  rowTitle: { color: STUDENT_COLORS.ink, fontSize: 14, fontWeight: '800' },
  rowDescription: { color: STUDENT_COLORS.muted, fontSize: 11, lineHeight: 16, marginTop: 3 },
  pressed: { opacity: 0.82 },
});