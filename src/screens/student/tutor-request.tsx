import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { STUDENT_COLORS, StudentBottomNav, StudentIcon } from '@/components/student/student-ui';

const subjects = ['Mathematics', 'Science', 'English', 'Coding', 'History', 'Languages'];
const minuteMarks = Array.from({ length: 12 }, (_, index) => index * 5);
type ClockMode = 'hour' | 'minute';

function formatDateId(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateLabel(dateId: string | null) {
  if (!dateId) return 'Select a date';
  return new Date(`${dateId}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatClockTime(hour: number, minute: number, period: 'AM' | 'PM') {
  return `${hour}:${String(minute).padStart(2, '0')} ${period}`;
}

function getClockAngle(value: number, mode: ClockMode) {
  const steps = mode === 'hour' ? 12 : 60;
  return (value / steps) * 360;
}

export default function TutorRequest() {
  const [subject, setSubject] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);
  const [clockMode, setClockMode] = useState<ClockMode>('hour');
  const [clockHour, setClockHour] = useState(4);
  const [clockMinute, setClockMinute] = useState(0);
  const [clockPeriod, setClockPeriod] = useState<'AM' | 'PM'>('PM');
  const [submitted, setSubmitted] = useState(false);
  const calendarDays = useMemo(() => {
    const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const lastDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
    const leadingBlankDays = firstDay.getDay();
    return Array.from({ length: leadingBlankDays + lastDay.getDate() }, (_, index) => {
      if (index < leadingBlankDays) return null;
      const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), index - leadingBlankDays + 1);
      return { id: formatDateId(date), date };
    });
  }, [calendarMonth]);
  const selectedDateLabel = formatDateLabel(selectedDate);
  const canContinue = Boolean(subject && selectedDate && time);

  if (submitted) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <Pressable accessibilityLabel="Go back" onPress={() => router.replace('/student')} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
              <StudentIcon ios="chevron.left" android="arrow_back" size={20} />
            </Pressable>
            <Text style={styles.topBarTitle}>Tutor request</Text>
            <View style={styles.topBarSpacer} />
          </View>

          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <StudentIcon ios="checkmark" android="check" color={STUDENT_COLORS.black} size={28} />
            </View>
            <Text style={styles.successEyebrow}>REQUEST READY</Text>
            <Text style={styles.successTitle}>Your profile can now be seen from the tutor page.</Text>
            <Text style={styles.successText}>Tutors who teach {subject} can see that you are looking for a session on {selectedDateLabel} at {time}.</Text>
            <Pressable accessibilityRole="button" onPress={() => router.replace('/student')} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <Text style={styles.primaryButtonText}>Back to home</Text>
              <StudentIcon ios="arrow.right" android="arrow_forward" color="#fff" size={17} />
            </Pressable>
          </View>
        </ScrollView>
        <StudentBottomNav activeTab="request" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable accessibilityLabel="Go back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/student'))} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <StudentIcon ios="chevron.left" android="arrow_back" size={20} />
          </Pressable>
          <Text style={styles.topBarTitle}>Tutor request</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>LET THEM FIND YOU</Text>
            <Text style={styles.heroTitle}>Can&apos;t find a tutor?</Text>
            <Text style={styles.heroText}>Let the tutor find you. Share what you need and when you are ready to learn.</Text>
          </View>
          <View style={styles.heroIcon}>
            <StudentIcon ios="person.2.fill" android="group" color={STUDENT_COLORS.black} size={25} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>What do you need help with?</Text>
        <View style={styles.subjectGrid}>
          {subjects.map((item) => {
            const selected = subject === item;
            return (
              <Pressable
                key={item}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => setSubject(item)}
                style={({ pressed }) => [styles.subjectOption, selected && styles.optionSelected, pressed && styles.pressed]}>
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{item}</Text>
                {selected && <StudentIcon ios="checkmark" android="check" color={STUDENT_COLORS.black} size={15} />}
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>When would you like to learn?</Text>
        <Pressable accessibilityRole="button" onPress={() => setCalendarVisible(true)} style={({ pressed }) => [styles.pickerButton, pressed && styles.pressed]}>
          <View style={styles.pickerIcon}>
            <StudentIcon ios="calendar" android="event" color={STUDENT_COLORS.black} size={20} />
          </View>
          <View style={styles.pickerCopy}>
            <Text style={styles.pickerLabel}>DATE</Text>
            <Text style={[styles.pickerValue, !selectedDate && styles.pickerPlaceholder]}>{selectedDateLabel}</Text>
          </View>
          <StudentIcon ios="chevron.down" android="expand_more" color={STUDENT_COLORS.muted} size={19} />
        </Pressable>

        <Pressable accessibilityRole="button" onPress={() => { setClockMode('hour'); setTimeVisible(true); }} style={({ pressed }) => [styles.pickerButton, pressed && styles.pressed]}>
          <View style={styles.pickerIcon}>
            <StudentIcon ios="clock" android="schedule" color={STUDENT_COLORS.black} size={20} />
          </View>
          <View style={styles.pickerCopy}>
            <Text style={styles.pickerLabel}>TIME</Text>
            <Text style={[styles.pickerValue, !time && styles.pickerPlaceholder]}>{time ?? 'Select a time'}</Text>
          </View>
          <StudentIcon ios="chevron.down" android="expand_more" color={STUDENT_COLORS.muted} size={19} />
        </Pressable>
      </ScrollView>

      <Modal animationType="slide" transparent visible={calendarVisible} onRequestClose={() => setCalendarVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setCalendarVisible(false)}>
          <View onStartShouldSetResponder={() => true} style={styles.pickerModal}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>CHOOSE A DATE</Text>
                <Text style={styles.modalTitle}>{calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
              </View>
              <View style={styles.monthControls}>
                <Pressable accessibilityLabel="Previous month" disabled={calendarMonth.getMonth() === new Date().getMonth() && calendarMonth.getFullYear() === new Date().getFullYear()} onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} style={styles.monthButton}>
                  <StudentIcon ios="chevron.left" android="chevron_left" color={STUDENT_COLORS.black} size={18} />
                </Pressable>
                <Pressable accessibilityLabel="Next month" onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} style={styles.monthButton}>
                  <StudentIcon ios="chevron.right" android="chevron_right" color={STUDENT_COLORS.black} size={18} />
                </Pressable>
              </View>
            </View>
            <View style={styles.weekdayRow}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <Text key={`${day}-${index}`} style={styles.weekdayText}>{day}</Text>)}
            </View>
            <View style={styles.calendarGrid}>
              {calendarDays.map((item, index) => {
                if (!item) return <View key={`blank-${index}`} style={styles.calendarDay} />;
                const isPast = item.date < new Date(new Date().setHours(0, 0, 0, 0));
                const selected = selectedDate === item.id;
                return (
                  <Pressable key={item.id} accessibilityRole="radio" accessibilityState={{ checked: selected, disabled: isPast }} disabled={isPast} onPress={() => { setSelectedDate(item.id); setCalendarVisible(false); }} style={[styles.calendarDay, selected && styles.calendarDaySelected, isPast && styles.calendarDayDisabled]}>
                    <Text style={[styles.calendarDayText, selected && styles.calendarDayTextSelected]}>{item.date.getDate()}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal animationType="slide" transparent visible={timeVisible} onRequestClose={() => setTimeVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setTimeVisible(false)}>
          <View onStartShouldSetResponder={() => true} style={styles.pickerModal}>
            <View style={styles.modalHandle} />
            <View style={styles.clockHeader}>
              <View>
                <Text style={styles.modalEyebrow}>CHOOSE A TIME</Text>
                <Text style={styles.modalTitle}>{clockMode === 'hour' ? 'Set the hour' : 'Set the minutes'}</Text>
              </View>
              <Text style={styles.clockReadout}>{formatClockTime(clockHour, clockMinute, clockPeriod)}</Text>
            </View>
            <View style={styles.periodRow}>
              {(['AM', 'PM'] as const).map((period) => (
                <Pressable key={period} accessibilityRole="radio" accessibilityState={{ selected: clockPeriod === period }} onPress={() => setClockPeriod(period)} style={[styles.periodButton, clockPeriod === period && styles.periodButtonSelected]}>
                  <Text style={[styles.periodText, clockPeriod === period && styles.periodTextSelected]}>{period}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.clockDial}>
              <View style={[styles.clockHand, { transform: [{ rotate: `${getClockAngle(clockMode === 'hour' ? clockHour % 12 : clockMinute, clockMode)}deg` }] }]} />
              <View style={styles.clockCenter} />
              {(clockMode === 'hour' ? Array.from({ length: 12 }, (_, index) => index + 1) : minuteMarks).map((value) => {
                const selected = clockMode === 'hour' ? clockHour % 12 === value % 12 : clockMinute === value;
                const angle = (getClockAngle(value, clockMode) - 90) * (Math.PI / 180);
                const left = 50 + Math.cos(angle) * 39;
                const top = 50 + Math.sin(angle) * 39;
                return (
                  <Pressable
                    key={value}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      if (clockMode === 'hour') {
                        setClockHour(value);
                        setClockMode('minute');
                      } else {
                        setClockMinute(value);
                        setTime(formatClockTime(clockHour, value, clockPeriod));
                        setTimeVisible(false);
                      }
                    }}
                    style={[styles.clockNumber, { left: `${left}%`, top: `${top}%` }, selected && styles.clockNumberSelected]}>
                    <Text style={[styles.clockNumberText, selected && styles.clockNumberTextSelected]}>{clockMode === 'hour' ? value : String(value).padStart(2, '0')}</Text>
                  </Pressable>
                );
              })}
            </View>
            {clockMode === 'minute' && (
              <Pressable accessibilityRole="button" onPress={() => setClockMode('hour')} style={styles.changeHourButton}>
                <StudentIcon ios="chevron.left" android="arrow_back" color={STUDENT_COLORS.black} size={15} />
                <Text style={styles.changeHourText}>Change hour</Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Modal>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canContinue }}
          disabled={!canContinue}
          onPress={() => setSubmitted(true)}
          style={({ pressed }) => [styles.primaryButton, !canContinue && styles.primaryButtonDisabled, pressed && styles.pressed]}>
          <Text style={styles.primaryButtonText}>Continue</Text>
          <StudentIcon ios="arrow.right" android="arrow_forward" color="#fff" size={17} />
        </Pressable>
      </View>
      <StudentBottomNav activeTab="request" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: STUDENT_COLORS.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: 920, paddingBottom: 28, paddingHorizontal: 16, paddingTop: 12, width: '100%' },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  backButton: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 20, borderWidth: 1, height: 40, justifyContent: 'center', width: 40 },
  topBarTitle: { color: STUDENT_COLORS.ink, fontSize: 20, fontWeight: '800' },
  topBarSpacer: { height: 40, width: 40 },
  hero: { alignItems: 'center', backgroundColor: STUDENT_COLORS.blackDark, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 27, padding: 21 },
  heroCopy: { flex: 1, maxWidth: 600 },
  eyebrow: { color: '#c8c8c8', fontSize: 10, fontWeight: '800', letterSpacing: 1.3 },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 7 },
  heroText: { color: '#d0d0d0', fontSize: 13, lineHeight: 19, marginTop: 7 },
  heroIcon: { alignItems: 'center', backgroundColor: STUDENT_COLORS.accent, borderRadius: 30, height: 60, justifyContent: 'center', marginLeft: 16, width: 60 },
  sectionTitle: { color: STUDENT_COLORS.ink, fontSize: 18, fontWeight: '800', marginBottom: 12, marginTop: 22 },
  subjectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  subjectOption: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 13, borderWidth: 1, flexBasis: '31%', flexGrow: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 48, paddingHorizontal: 13 },
  optionSelected: { backgroundColor: STUDENT_COLORS.accent, borderColor: STUDENT_COLORS.black },
  optionText: { color: STUDENT_COLORS.ink, fontSize: 13, fontWeight: '700' },
  optionTextSelected: { fontWeight: '800' },
  pickerButton: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 15, borderWidth: 1, flexDirection: 'row', minHeight: 72, paddingHorizontal: 12, marginBottom: 10 },
  pickerIcon: { alignItems: 'center', backgroundColor: STUDENT_COLORS.accent, borderRadius: 12, height: 46, justifyContent: 'center', width: 46 },
  pickerCopy: { flex: 1, marginHorizontal: 12 },
  pickerLabel: { color: STUDENT_COLORS.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  pickerValue: { color: STUDENT_COLORS.ink, fontSize: 15, fontWeight: '800', marginTop: 5 },
  pickerPlaceholder: { color: STUDENT_COLORS.muted, fontWeight: '600' },
  modalBackdrop: { backgroundColor: 'rgba(0, 0, 0, 0.48)', flex: 1, justifyContent: 'flex-end' },
  pickerModal: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, paddingBottom: 30 },
  modalHandle: { alignSelf: 'center', backgroundColor: '#d1d1d1', borderRadius: 3, height: 5, marginBottom: 22, width: 42 },
  modalHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  modalEyebrow: { color: STUDENT_COLORS.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  modalTitle: { color: STUDENT_COLORS.ink, fontSize: 21, fontWeight: '800', marginTop: 5 },
  monthControls: { flexDirection: 'row', gap: 7 },
  monthButton: { alignItems: 'center', backgroundColor: STUDENT_COLORS.accent, borderRadius: 18, height: 36, justifyContent: 'center', width: 36 },
  weekdayRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  weekdayText: { color: STUDENT_COLORS.muted, fontSize: 11, fontWeight: '800', textAlign: 'center', width: '14.28%' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  calendarDay: { alignItems: 'center', borderRadius: 20, height: 42, justifyContent: 'center', marginBottom: 5, width: '14.28%' },
  calendarDaySelected: { backgroundColor: STUDENT_COLORS.accent },
  calendarDayDisabled: { opacity: 0.28 },
  calendarDayText: { color: STUDENT_COLORS.ink, fontSize: 14, fontWeight: '700' },
  calendarDayTextSelected: { fontWeight: '800' },
  clockHeader: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between' },
  clockReadout: { color: STUDENT_COLORS.black, fontSize: 20, fontWeight: '800' },
  periodRow: { alignSelf: 'flex-end', backgroundColor: '#f1f1f1', borderRadius: 16, flexDirection: 'row', marginTop: 15, padding: 3 },
  periodButton: { alignItems: 'center', borderRadius: 13, minWidth: 52, paddingVertical: 7 },
  periodButtonSelected: { backgroundColor: STUDENT_COLORS.accent },
  periodText: { color: STUDENT_COLORS.muted, fontSize: 11, fontWeight: '800' },
  periodTextSelected: { color: STUDENT_COLORS.black },
  clockDial: { alignSelf: 'center', backgroundColor: '#f0f0f0', borderColor: STUDENT_COLORS.border, borderRadius: 140, borderWidth: 1, height: 270, marginTop: 20, position: 'relative', width: 270 },
  clockHand: { backgroundColor: STUDENT_COLORS.black, borderRadius: 2, height: 88, left: '50%', marginLeft: -2, marginTop: -88, position: 'absolute', top: '50%', transformOrigin: 'bottom', width: 4 },
  clockCenter: { backgroundColor: STUDENT_COLORS.accent, borderColor: STUDENT_COLORS.black, borderRadius: 8, borderWidth: 2, height: 16, left: '50%', marginLeft: -8, marginTop: -8, position: 'absolute', top: '50%', width: 16, zIndex: 2 },
  clockNumber: { alignItems: 'center', borderRadius: 19, height: 38, justifyContent: 'center', marginLeft: -19, marginTop: -19, position: 'absolute', width: 38 },
  clockNumberSelected: { backgroundColor: STUDENT_COLORS.accent },
  clockNumberText: { color: STUDENT_COLORS.ink, fontSize: 12, fontWeight: '800' },
  clockNumberTextSelected: { fontSize: 13 },
  changeHourButton: { alignItems: 'center', alignSelf: 'center', flexDirection: 'row', gap: 5, marginTop: 16, padding: 5 },
  changeHourText: { color: STUDENT_COLORS.black, fontSize: 12, fontWeight: '800' },
  footer: { backgroundColor: STUDENT_COLORS.background, borderTopColor: STUDENT_COLORS.border, borderTopWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
  primaryButton: { alignItems: 'center', backgroundColor: STUDENT_COLORS.black, borderRadius: 14, flexDirection: 'row', gap: 10, justifyContent: 'center', minHeight: 56, paddingHorizontal: 28 },
  primaryButtonDisabled: { backgroundColor: '#b8b8b8' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  successCard: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderRadius: 22, borderWidth: 1, marginTop: 36, padding: 25 },
  successIcon: { alignItems: 'center', backgroundColor: STUDENT_COLORS.accent, borderRadius: 34, height: 68, justifyContent: 'center', width: 68 },
  successEyebrow: { color: STUDENT_COLORS.black, fontSize: 10, fontWeight: '800', letterSpacing: 1.3, marginTop: 22 },
  successTitle: { color: STUDENT_COLORS.ink, fontSize: 24, fontWeight: '800', lineHeight: 31, marginTop: 7, textAlign: 'center' },
  successText: { color: STUDENT_COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 12, textAlign: 'center' },
  pressed: { opacity: 0.82 },
});
