import { useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StudentBottomNav, StudentIcon as Icon } from '@/components/student/student-ui';

const BLACK = '#111111';
const BLACK_DARK = '#000000';
const INK = '#111111';
const MUTED = '#707070';
const BORDER = '#d7d7d7';
const ACCENT = '#FED701';

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
  pending?: boolean;
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
  { id: 'goals-mon', day: 'mon', time: '4:00', period: 'PM', subject: 'Learning goals', tutor: 'Sam Rivera', initials: 'SR', duration: '30 min', color: '#ededed' },
  { id: 'math-tue', day: 'tue', time: '4:00', period: 'PM', subject: 'Mathematics', tutor: 'Maya Chen', initials: 'MC', duration: '60 min', color: '#e3e3e3' },
  { id: 'english-wed', day: 'wed', time: '5:30', period: 'PM', subject: 'English writing', tutor: 'Theo Brooks', initials: 'TB', duration: '45 min', color: '#f0f0f0' },
  { id: 'coding-thu', day: 'thu', time: '4:30', period: 'PM', subject: 'Intro to coding', tutor: 'Sam Rivera', initials: 'SR', duration: '60 min', color: '#e7e7e7' },
  { id: 'science-fri', day: 'fri', time: '3:00', period: 'PM', subject: 'Science lab prep', tutor: 'Maya Chen', initials: 'MC', duration: '45 min', color: '#ededed' },
  { id: 'review-sat', day: 'sat', time: '10:00', period: 'AM', subject: 'Weekly review', tutor: 'Theo Brooks', initials: 'TB', duration: '45 min', color: '#e4e4e4' },
  { id: 'planning-sun', day: 'sun', time: '2:00', period: 'PM', subject: 'Study planning', tutor: 'Sam Rivera', initials: 'SR', duration: '30 min', color: '#f1f1f1' },
];

export default function StudentSchedule() {
  const { pendingDay, pendingTime, pendingTutor, pendingInitials, requestSent } = useLocalSearchParams<{
    pendingDay?: string | string[];
    pendingTime?: string | string[];
    pendingTutor?: string | string[];
    pendingInitials?: string | string[];
    requestSent?: string | string[];
  }>();
  const days = useMemo(() => getCurrentWeek(), []);
  const todayId = getTodayId();
  const requestedDay = Array.isArray(pendingDay) ? pendingDay[0] : pendingDay;
  const requestedTime = Array.isArray(pendingTime) ? pendingTime[0] : pendingTime;
  const requestedTutor = Array.isArray(pendingTutor) ? pendingTutor[0] : pendingTutor;
  const requestedInitials = Array.isArray(pendingInitials) ? pendingInitials[0] : pendingInitials;
  const requestWasSent = Array.isArray(requestSent) ? requestSent[0] : requestSent;
  const [showRequestSent, setShowRequestSent] = useState(requestWasSent === '1');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [cancelledSessionIds, setCancelledSessionIds] = useState<string[]>([]);
  const [sessionUpdates, setSessionUpdates] = useState<Record<string, { day: string; time: string; period: string }>>({});
  const [showModify, setShowModify] = useState(false);
  const [modifyDay, setModifyDay] = useState('');
  const [modifyTime, setModifyTime] = useState('');
  const pendingSession: Session | null = requestedDay && requestedTime && requestedTutor
    ? {
        id: 'pending-tutor-request',
        day: requestedDay,
        time: requestedTime.split(' ')[0],
        period: requestedTime.split(' ')[1] ?? '',
        subject: 'Tutoring request',
        tutor: requestedTutor,
        initials: requestedInitials ?? requestedTutor.split(' ').map((name) => name[0]).join(''),
        duration: 'Pending confirmation',
        color: ACCENT,
        pending: true,
      }
    : null;
  const scheduledSessions = (pendingSession ? [...sessions, pendingSession] : sessions)
    .filter((session) => !cancelledSessionIds.includes(session.id))
    .map((session) => sessionUpdates[session.id] ? { ...session, ...sessionUpdates[session.id] } : session);
  const [selectedDay, setSelectedDay] = useState(days.some((day) => day.id === requestedDay) ? requestedDay! : (days.some((day) => day.id === todayId) ? todayId : 'mon'));
  const selectedSessions = useMemo(
    () => scheduledSessions.filter((session) => session.day === selectedDay),
    [scheduledSessions, selectedDay],
  );
  const nextSession = scheduledSessions.find((session) => {
    const sessionDay = weekdayIds.indexOf(session.day);
    const currentDay = weekdayIds.indexOf(todayId);
    return sessionDay >= currentDay;
  }) ?? scheduledSessions[0];
  const nextSessionDay = nextSession ? days.find((day) => day.id === nextSession.day) ?? days[0] : null;
  const nextSessionDate = nextSession && nextSessionDay
    ? nextSession.day === todayId ? 'Today' : `${nextSessionDay.label} ${nextSessionDay.date} ${nextSessionDay.month}`
    : '';

  const cancelSelectedSession = () => {
    if (!selectedSession) return;
    setCancelledSessionIds((current) => [...current, selectedSession.id]);
    setSelectedSession(null);
  };

  const modifySelectedSession = () => {
    if (!selectedSession) return;
    setEditingSession(selectedSession);
    setModifyDay(selectedSession.day);
    setModifyTime(`${selectedSession.time} ${selectedSession.period}`);
    setSelectedSession(null);
    setShowModify(true);
  };

  const saveModifiedSession = () => {
    if (!editingSession || !modifyDay || !modifyTime) return;
    const [time, period] = modifyTime.split(' ');
    setSessionUpdates((current) => ({ ...current, [editingSession.id]: { day: modifyDay, time, period } }));
    setSelectedDay(modifyDay);
    setShowModify(false);
    setEditingSession(null);
    setSelectedSession(null);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageEyebrow}>YOUR LEARNING SPACE</Text>
            <Text style={styles.pageTitle}>Schedule</Text>
            <Text style={styles.pageSubtitle}>{getWeekRangeLabel(days)}</Text>
          </View>
          <View style={styles.weekSummary}>
            <Text style={styles.weekSummaryValue}>{scheduledSessions.length}</Text>
            <Text style={styles.weekSummaryLabel}>PLANNED</Text>
          </View>
        </View>

        <View style={styles.dayStrip}>
          {days.map((day) => {
            const selected = selectedDay === day.id;
            const hasSession = scheduledSessions.some((session) => session.day === day.id);
            return (
              <Pressable
                key={day.id}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => setSelectedDay(day.id)}
                style={({ pressed }) => [styles.dayButton, selected && styles.dayButtonSelected, pressed && styles.pressed]}>
                <Text style={[styles.dayLabel, selected && styles.dayTextSelected]}>{day.label.slice(0, 1) + day.label.slice(1).toLowerCase()}</Text>
                <Text style={[styles.dayDate, selected && styles.dayTextSelected]}>{day.date}</Text>
                <Text style={[styles.dayMonth, selected && styles.dayTextSelected]}>{day.month}</Text>
                {hasSession && <View style={[styles.sessionDot, selected && styles.sessionDotSelected]} />}
              </Pressable>
            );
          })}
        </View>

        {nextSession && <View style={styles.nextCard}>
          <View style={styles.nextIcon}>
            <Icon ios="clock.fill" android="schedule" size={20} color={BLACK} />
          </View>
          <View style={styles.nextCopy}>
            <Text style={styles.nextEyebrow}>UP NEXT</Text>
            <Text style={styles.nextTitle}>{nextSession.subject}</Text>
            <Text style={styles.nextDetails}>{nextSessionDate} · {nextSession.time} {nextSession.period} · {nextSession.duration}</Text>
            <Text style={styles.nextTutor}>with {nextSession.tutor}</Text>
          </View>
          <View style={styles.nextArrow}>
            <Icon ios="chevron.right" android="chevron_right" size={16} color={BLACK} />
          </View>
        </View>}

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>{days.find((day) => day.id === selectedDay)?.label} sessions</Text>
            <Text style={styles.sectionSubtitle}>Your time with a tutor</Text>
          </View>
          <View style={styles.sessionCountBadge}>
            <Text style={styles.sessionCount}>{selectedSessions.length} {selectedSessions.length === 1 ? 'session' : 'sessions'}</Text>
          </View>
        </View>

        {selectedSessions.length > 0 ? (
          <View style={styles.sessionList}>
            {selectedSessions.map((session) => (
              <Pressable key={session.id} onPress={() => setSelectedSession(session)} style={({ pressed }) => [styles.sessionCard, pressed && styles.pressed]}>
                <View style={styles.timeColumn}>
                  <Text style={styles.sessionTime}>{session.time}</Text>
                  <Text style={styles.sessionPeriod}>{session.period}</Text>
                </View>
                <View style={styles.sessionDivider} />
                <View style={[styles.subjectMark, { backgroundColor: session.color }]}>
                  <Icon ios="book.fill" android="menu_book" size={19} />
                </View>
                <View style={styles.sessionCopy}>
                  <View style={styles.sessionTitleRow}>
                    <Text style={styles.subjectTitle}>{session.subject}</Text>
                    {session.pending && <View style={styles.pendingBadge}><Text style={styles.pendingBadgeText}>Pending</Text></View>}
                  </View>
                  <Text style={styles.tutorName}>with {session.tutor}</Text>
                  <View style={styles.durationRow}>
                    <Icon ios="clock" android="schedule" size={13} color={BLACK} />
                    <Text style={styles.duration}>{session.duration}</Text>
                  </View>
                </View>
                <View style={styles.sessionAction}>
                  <View style={styles.tutorAvatar}>
                    <Text style={styles.tutorInitials}>{session.initials}</Text>
                  </View>
                  <Icon ios="chevron.right" android="chevron_right" size={15} color={MUTED} />
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

      <Modal animationType="fade" transparent visible={showRequestSent} onRequestClose={() => setShowRequestSent(false)}>
        <View style={styles.confirmationOverlay}>
          <View style={styles.confirmationCard}>
            <View style={styles.confirmationIcon}>
              <Icon ios="checkmark" android="check" size={24} color={BLACK} />
            </View>
            <Text style={styles.confirmationTitle}>Request Sent</Text>
            <Text style={styles.confirmationText}>
              Your tutoring request{requestedTutor ? ` to ${requestedTutor}` : ''} is now pending.
            </Text>
            <Pressable accessibilityRole="button" onPress={() => setShowRequestSent(false)} style={({ pressed }) => [styles.confirmationButton, pressed && styles.pressed]}>
              <Text style={styles.confirmationButtonText}>View schedule</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent visible={selectedSession !== null} onRequestClose={() => setSelectedSession(null)}>
        {selectedSession && (
          <View style={styles.detailOverlay}>
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailEyebrow}>SESSION DETAILS</Text>
                <Pressable accessibilityLabel="Close session details" onPress={() => setSelectedSession(null)} style={styles.detailCloseButton}>
                  <Icon ios="xmark" android="close" size={18} />
                </Pressable>
              </View>
              <View style={styles.detailSubjectRow}>
                <View style={[styles.detailSubjectMark, { backgroundColor: selectedSession.color }]}>
                  <Icon ios="book.fill" android="menu_book" size={22} />
                </View>
                <View style={styles.detailSubjectCopy}>
                  <View style={styles.sessionTitleRow}>
                    <Text style={styles.detailTitle}>{selectedSession.subject}</Text>
                    {selectedSession.pending && <View style={styles.pendingBadge}><Text style={styles.pendingBadgeText}>Pending</Text></View>}
                  </View>
                  <Text style={styles.detailTutor}>with {selectedSession.tutor}</Text>
                </View>
              </View>
              <View style={styles.detailRows}>
                <View style={styles.detailRow}>
                  <Icon ios="calendar" android="event" size={18} color={MUTED} />
                  <Text style={styles.detailRowLabel}>Day</Text>
                  <Text style={styles.detailRowValue}>{days.find((day) => day.id === selectedSession.day)?.label ?? selectedSession.day}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon ios="clock" android="schedule" size={18} color={MUTED} />
                  <Text style={styles.detailRowLabel}>Time</Text>
                  <Text style={styles.detailRowValue}>{selectedSession.time} {selectedSession.period}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon ios="timer" android="timer" size={18} color={MUTED} />
                  <Text style={styles.detailRowLabel}>Duration</Text>
                  <Text style={styles.detailRowValue}>{selectedSession.duration}</Text>
                </View>
              </View>
              <Pressable accessibilityRole="button" onPress={modifySelectedSession} style={({ pressed }) => [styles.modifyButton, pressed && styles.pressed]}>
                <Icon ios="pencil" android="edit" size={17} color={BLACK} />
                <Text style={styles.modifyButtonText}>Modify request</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={cancelSelectedSession} style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}>
                <Icon ios="xmark.circle" android="cancel" size={17} color="#b42318" />
                <Text style={styles.cancelButtonText}>Cancel session</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>

      <Modal animationType="slide" transparent visible={showModify} onRequestClose={() => setShowModify(false)}>
        <View style={styles.detailOverlay}>
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <View>
                <Text style={styles.detailEyebrow}>MODIFY SESSION</Text>
                <Text style={styles.modifyTitle}>Update your schedule</Text>
              </View>
              <Pressable accessibilityLabel="Close modify session" onPress={() => setShowModify(false)} style={styles.detailCloseButton}>
                <Icon ios="xmark" android="close" size={18} />
              </Pressable>
            </View>
            <Text style={styles.modifySectionTitle}>Choose a day</Text>
            <View style={styles.modifyOptions}>
              {days.map((day) => {
                const selected = modifyDay === day.id;
                return <Pressable key={day.id} onPress={() => setModifyDay(day.id)} style={[styles.modifyOption, selected && styles.modifyOptionSelected]}><Text style={[styles.modifyOptionText, selected && styles.modifyOptionTextSelected]}>{day.label.slice(0, 1) + day.label.slice(1).toLowerCase()} {day.date}</Text></Pressable>;
              })}
            </View>
            <Text style={styles.modifySectionTitle}>Choose a time</Text>
            <View style={styles.modifyOptions}>
              {['3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'].map((time) => {
                const selected = modifyTime === time;
                return <Pressable key={time} onPress={() => setModifyTime(time)} style={[styles.modifyOption, selected && styles.modifyOptionSelected]}><Text style={[styles.modifyOptionText, selected && styles.modifyOptionTextSelected]}>{time}</Text></Pressable>;
              })}
            </View>
            <Pressable accessibilityRole="button" disabled={!modifyDay || !modifyTime} onPress={saveModifiedSession} style={({ pressed }) => [styles.saveModifyButton, (!modifyDay || !modifyTime) && styles.saveModifyButtonDisabled, pressed && styles.pressed]}>
              <Text style={styles.saveModifyButtonText}>Save changes</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <StudentBottomNav activeTab="schedule" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f3f3f3', flex: 1 },
  content: { alignSelf: 'center', maxWidth: 920, paddingBottom: 32, paddingHorizontal: 16, paddingTop: 12, width: '100%' },
  pageHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18, marginTop: 4 },
  pageEyebrow: { color: BLACK, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  pageTitle: { color: INK, fontSize: 28, fontWeight: '800', marginTop: 5 },
  pageSubtitle: { color: MUTED, fontSize: 13, marginTop: 5 },
  sectionTitle: { color: INK, fontSize: 21, fontWeight: '800' },
  sectionSubtitle: { color: MUTED, fontSize: 13, marginTop: 5 },
  weekSummary: { alignItems: 'center', backgroundColor: '#e4e4e4', borderRadius: 14, minWidth: 74, paddingHorizontal: 12, paddingVertical: 8 },
  weekSummaryValue: { color: BLACK, fontSize: 18, fontWeight: '800' },
  weekSummaryLabel: { color: MUTED, fontSize: 9, fontWeight: '800', letterSpacing: 0.7, marginTop: 1 },
  dayStrip: { backgroundColor: '#fff', borderColor: BORDER, borderRadius: 20, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 7, shadowColor: '#777', shadowOffset: { height: 5, width: 0 }, shadowOpacity: 0.08, shadowRadius: 12 },
  dayButton: { alignItems: 'center', borderRadius: 14, flex: 1, minHeight: 82, paddingTop: 10, position: 'relative' },
  dayButtonSelected: { backgroundColor: BLACK, shadowColor: BLACK_DARK, shadowOffset: { height: 4, width: 0 }, shadowOpacity: 0.22, shadowRadius: 7 },
  dayLabel: { color: MUTED, fontSize: 10, fontWeight: '800' },
  dayDate: { color: INK, fontSize: 23, fontWeight: '800', marginTop: 5 },
  dayMonth: { color: MUTED, fontSize: 10, fontWeight: '700', marginTop: 1 },
  dayTextSelected: { color: '#fff' },
  sessionDot: { backgroundColor: ACCENT, borderColor: '#fff', borderRadius: 4, borderWidth: 1, bottom: 5, height: 7, position: 'absolute', width: 7 },
  sessionDotSelected: { backgroundColor: '#fff', borderColor: BLACK, borderWidth: 2 },
  nextCard: { alignItems: 'center', backgroundColor: BLACK_DARK, borderRadius: 22, flexDirection: 'row', marginTop: 22, padding: 17, shadowColor: BLACK_DARK, shadowOffset: { height: 5, width: 0 }, shadowOpacity: 0.18, shadowRadius: 12 },
  nextIcon: { alignItems: 'center', backgroundColor: ACCENT, borderRadius: 25, height: 50, justifyContent: 'center', width: 50 },
  nextCopy: { flex: 1, marginLeft: 13 },
  nextEyebrow: { color: '#aaa', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  nextTitle: { color: '#fff', fontSize: 17, fontWeight: '800', marginTop: 4 },
  nextDetails: { color: '#c7c7c7', fontSize: 12, marginTop: 4 },
  nextTutor: { color: '#999', fontSize: 11, fontWeight: '700', marginTop: 5 },
  nextArrow: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, height: 32, justifyContent: 'center', width: 32 },
  sectionHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13, marginTop: 30 },
  sessionCountBadge: { backgroundColor: '#e3e3e3', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  sessionCount: { color: BLACK, fontSize: 11, fontWeight: '800' },
  sessionList: { gap: 11 },
  sessionCard: { alignItems: 'center', backgroundColor: '#fff', borderColor: BORDER, borderRadius: 18, borderWidth: 1, flexDirection: 'row', minHeight: 108, padding: 14, shadowColor: '#94aaa3', shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.06, shadowRadius: 8 },
  timeColumn: { alignItems: 'center', width: 49 },
  sessionTime: { color: BLACK, fontSize: 17, fontWeight: '800' },
  sessionPeriod: { color: MUTED, fontSize: 10, fontWeight: '800', marginTop: 2 },
  sessionDivider: { backgroundColor: BORDER, height: 58, marginHorizontal: 11, width: 1 },
  subjectMark: { alignItems: 'center', borderRadius: 13, height: 44, justifyContent: 'center', width: 44 },
  sessionCopy: { flex: 1, marginLeft: 12 },
  sessionTitleRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  subjectTitle: { color: INK, fontSize: 15, fontWeight: '800' },
  pendingBadge: { backgroundColor: ACCENT, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 4 },
  pendingBadgeText: { color: BLACK, fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  tutorName: { color: MUTED, fontSize: 12, marginTop: 4 },
  durationRow: { alignItems: 'center', flexDirection: 'row', gap: 4, marginTop: 7 },
  duration: { color: MUTED, fontSize: 11, fontWeight: '700' },
  sessionAction: { alignItems: 'center', gap: 9 },
  tutorAvatar: { alignItems: 'center', backgroundColor: BLACK, borderRadius: 17, height: 34, justifyContent: 'center', width: 34 },
  tutorInitials: { color: '#fff', fontSize: 10, fontWeight: '800' },
  emptyState: { alignItems: 'center', backgroundColor: '#fff', borderColor: BORDER, borderRadius: 18, borderWidth: 1, padding: 32 },
  emptyTitle: { color: INK, fontSize: 16, fontWeight: '800', marginTop: 12 },
  emptyDescription: { color: MUTED, fontSize: 12, marginTop: 5 },
  confirmationOverlay: { alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.48)', flex: 1, justifyContent: 'center', padding: 24 },
  confirmationCard: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 22, maxWidth: 360, padding: 26, width: '100%' },
  confirmationIcon: { alignItems: 'center', backgroundColor: ACCENT, borderRadius: 26, height: 52, justifyContent: 'center', width: 52 },
  confirmationTitle: { color: INK, fontSize: 23, fontWeight: '800', marginTop: 16 },
  confirmationText: { color: MUTED, fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: 'center' },
  confirmationButton: { alignItems: 'center', backgroundColor: BLACK, borderRadius: 13, justifyContent: 'center', marginTop: 22, minHeight: 48, paddingHorizontal: 22, width: '100%' },
  confirmationButtonText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  detailOverlay: { backgroundColor: 'rgba(0, 0, 0, 0.48)', flex: 1, justifyContent: 'flex-end' },
  detailCard: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, paddingBottom: 30 },
  detailHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  detailEyebrow: { color: MUTED, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  detailCloseButton: { alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 18, height: 36, justifyContent: 'center', width: 36 },
  detailSubjectRow: { alignItems: 'center', flexDirection: 'row', marginTop: 22 },
  detailSubjectMark: { alignItems: 'center', borderRadius: 16, height: 52, justifyContent: 'center', width: 52 },
  detailSubjectCopy: { flex: 1, marginLeft: 13 },
  detailTitle: { color: INK, fontSize: 20, fontWeight: '800' },
  detailTutor: { color: MUTED, fontSize: 13, marginTop: 5 },
  detailRows: { borderTopColor: BORDER, borderTopWidth: 1, marginTop: 22 },
  detailRow: { alignItems: 'center', borderBottomColor: '#ededed', borderBottomWidth: 1, flexDirection: 'row', minHeight: 52 },
  detailRowLabel: { color: MUTED, flex: 1, fontSize: 13, marginLeft: 10 },
  detailRowValue: { color: INK, fontSize: 13, fontWeight: '800' },
  cancelButton: { alignItems: 'center', borderColor: '#f0c4c0', borderRadius: 13, borderWidth: 1, flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 22, minHeight: 50 },
  cancelButtonText: { color: '#b42318', fontSize: 14, fontWeight: '800' },
  modifyButton: { alignItems: 'center', backgroundColor: ACCENT, borderRadius: 13, flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 22, minHeight: 50 },
  modifyButtonText: { color: BLACK, fontSize: 14, fontWeight: '800' },
  modifyTitle: { color: INK, fontSize: 21, fontWeight: '800', marginTop: 5 },
  modifySectionTitle: { color: INK, fontSize: 15, fontWeight: '800', marginBottom: 10, marginTop: 22 },
  modifyOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  modifyOption: { backgroundColor: '#f3f3f3', borderColor: BORDER, borderRadius: 10, borderWidth: 1, minHeight: 42, justifyContent: 'center', paddingHorizontal: 12 },
  modifyOptionSelected: { backgroundColor: ACCENT, borderColor: ACCENT },
  modifyOptionText: { color: INK, fontSize: 12, fontWeight: '700' },
  modifyOptionTextSelected: { fontWeight: '800' },
  saveModifyButton: { alignItems: 'center', backgroundColor: BLACK, borderRadius: 13, justifyContent: 'center', marginTop: 26, minHeight: 50 },
  saveModifyButtonDisabled: { backgroundColor: '#b8b8b8' },
  saveModifyButtonText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  pressed: { opacity: 0.82 },
});