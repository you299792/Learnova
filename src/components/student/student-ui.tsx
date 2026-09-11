import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AndroidSymbol } from 'expo-symbols';
import type { SFSymbol } from 'sf-symbols-typescript';

export const STUDENT_COLORS = {
  black: '#111111',
  blackDark: '#000000',
  ink: '#111111',
  muted: '#666666',
  border: '#d6d6d6',
  background: '#f5f5f5',
  accent: '#FED701',
} as const;

export const STUDENT_AVATAR_URI = 'https://i.scdn.co/image/ab67616d00001e028f33770d5cb6b7bbbd59686a';

export type StudentTab = 'home' | 'schedule' | 'files' | 'menu';

export const STUDENT_TABS: { key: StudentTab; label: string; ios: SFSymbol; android: AndroidSymbol }[] = [
  { key: 'home', label: 'Home', ios: 'house.fill', android: 'home' },
  { key: 'schedule', label: 'Schedule', ios: 'calendar', android: 'event' },
  { key: 'files', label: 'Files', ios: 'folder.fill', android: 'folder' },
  { key: 'menu', label: 'Menu', ios: 'line.3.horizontal', android: 'menu' },
];

export function StudentIcon({
  ios,
  android,
  size = 20,
  color = STUDENT_COLORS.black,
}: {
  ios: SFSymbol;
  android: AndroidSymbol;
  size?: number;
  color?: string;
}) {
  return <SymbolView name={{ ios, android, web: android }} size={size} tintColor={color} />;
}

export function StudentAvatar({ large = false }: { large?: boolean }) {
  return (
    <View style={large ? styles.largeAvatar : styles.avatar}>
      <Image source={{ uri: STUDENT_AVATAR_URI }} style={large ? styles.largeAvatarImage : styles.avatarImage} />
    </View>
  );
}

export function StudentHeader({ title, showActions = false, showProfile = true }: { title: string; showActions?: boolean; showProfile?: boolean }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.eyebrow}>YOUR LEARNING SPACE</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      {showActions ? (
        <View style={styles.headerActions}>
          <Pressable accessibilityLabel="Messages" onPress={() => router.push('/messages')} style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}>
            <StudentIcon ios="bubble.left.fill" android="chat_bubble" size={21} color="#fff" />
          </Pressable>
          <Pressable accessibilityLabel="Notifications" style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}>
            <StudentIcon ios="bell.fill" android="notifications" size={21} color="#fff" />
            <View style={styles.notificationDot} />
          </Pressable>
          {showProfile && <ProfileButton />}
        </View>
      ) : (
        showProfile && <ProfileButton />
      )}
    </View>
  );
}

export function ProfileButton() {
  return (
    <Pressable accessibilityLabel="Profile" onPress={() => router.push('/profile')} style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}>
      <StudentAvatar />
    </Pressable>
  );
}

export function StudentBottomNav({ activeTab }: { activeTab: StudentTab }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {STUDENT_TABS.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
            onPress={() => {
              if (tab.key === 'home') router.replace('/student');
              if (tab.key === 'schedule') router.push('/schedule');
              if (tab.key === 'files') router.push('/files');
              if (tab.key === 'menu') router.push('/menu');
            }}
            style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
            <StudentIcon ios={tab.ios} android={tab.android} size={25} color={active ? STUDENT_COLORS.black : STUDENT_COLORS.muted} />
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
            {active && <View style={styles.tabIndicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

export const studentScreenStyles = StyleSheet.create({
  safeArea: { backgroundColor: STUDENT_COLORS.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: 920, paddingBottom: 32, paddingHorizontal: 16, paddingTop: 12, width: '100%' },
  pressed: { opacity: 0.82 },
});

const styles = StyleSheet.create({
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  eyebrow: { color: STUDENT_COLORS.black, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: STUDENT_COLORS.ink, fontSize: 28, fontWeight: '800', marginTop: 5 },
  headerActions: { alignItems: 'center', flexDirection: 'row', gap: 7 },
  headerButton: { alignItems: 'center', backgroundColor: STUDENT_COLORS.black, borderColor: STUDENT_COLORS.black, borderRadius: 20, borderWidth: 1, elevation: 3, height: 40, justifyContent: 'center', position: 'relative', shadowColor: STUDENT_COLORS.blackDark, shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.18, shadowRadius: 5, width: 40 },
  notificationDot: { backgroundColor: STUDENT_COLORS.accent, borderColor: STUDENT_COLORS.black, borderRadius: 5, borderWidth: 2, height: 10, position: 'absolute', right: 1, top: 1, width: 10 },
  avatarButton: { alignItems: 'center', backgroundColor: STUDENT_COLORS.black, borderRadius: 21, elevation: 3, height: 42, justifyContent: 'center', shadowColor: STUDENT_COLORS.blackDark, shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.18, shadowRadius: 5, width: 42 },
  avatar: { borderRadius: 21, height: 42, overflow: 'hidden', width: 42 },
  avatarImage: { height: '100%', width: '100%' },
  largeAvatar: { borderRadius: 28, height: 56, overflow: 'hidden', width: 56 },
  largeAvatarImage: { height: '100%', width: '100%' },
  bottomNav: { alignItems: 'center', backgroundColor: '#fff', borderColor: STUDENT_COLORS.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, paddingHorizontal: 8, paddingTop: 8 },
  tabButton: { alignItems: 'center', flex: 1, paddingHorizontal: 4, paddingTop: 2, position: 'relative' },
  tabLabel: { color: STUDENT_COLORS.muted, fontSize: 12, fontWeight: '700', marginTop: 5 },
  tabLabelActive: { color: STUDENT_COLORS.black },
  tabIndicator: { backgroundColor: STUDENT_COLORS.accent, borderRadius: 2, bottom: -10, height: 3, position: 'absolute', width: 20 },
  pressed: { opacity: 0.82 },
});
