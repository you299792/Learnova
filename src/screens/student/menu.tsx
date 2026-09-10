import { useEffect } from 'react';
import type { AndroidSymbol } from 'expo-symbols';
import { Image } from 'expo-image';
import * as NavigationBar from 'expo-navigation-bar';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { SFSymbol } from 'sf-symbols-typescript';

const BLACK = '#111111';
const BLACK_DARK = '#000000';
const INK = '#111111';
const MUTED = '#666666';
const BORDER = '#d6d6d6';

type Tab = 'home' | 'schedule' | 'files' | 'menu';

const tabs: { key: Tab; label: string; ios: SFSymbol; android: AndroidSymbol }[] = [
  { key: 'home', label: 'Home', ios: 'house.fill', android: 'home' },
  { key: 'schedule', label: 'Schedule', ios: 'calendar', android: 'event' },
  { key: 'files', label: 'Files', ios: 'folder.fill', android: 'folder' },
  { key: 'menu', label: 'Menu', ios: 'line.3.horizontal', android: 'menu' },
];

type MenuItem = {
  title: string;
  subtitle: string;
  ios: SFSymbol;
  android: AndroidSymbol;
};

const menuItems: MenuItem[] = [
  { title: 'My profile', subtitle: 'Your account and learning preferences', ios: 'person.crop.circle', android: 'person' },
  { title: 'Notifications', subtitle: 'Choose when Learnova checks in', ios: 'bell', android: 'notifications' },
  { title: 'Settings', subtitle: 'Manage your learning space settings', ios: 'gearshape.fill', android: 'settings' },
  { title: 'Help center', subtitle: 'Get answers about your learning space', ios: 'questionmark.circle', android: 'help_outline' },
];

function Icon({
  ios,
  android,
  size = 20,
  color = BLACK,
}: {
  ios: SFSymbol;
  android: AndroidSymbol;
  size?: number;
  color?: string;
}) {
  return <SymbolView name={{ ios, android, web: android }} size={size} tintColor={color} />;
}

export default function StudentMenu() {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    void NavigationBar.setVisibilityAsync('hidden');
    return () => {
      void NavigationBar.setVisibilityAsync('visible');
    };
  }, []);

  function signOut() {
    router.replace('/');
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>YOUR LEARNING SPACE</Text>
            <Text style={styles.title}>Menu</Text>
          </View>
          <Pressable accessibilityLabel="Profile" onPress={() => router.push('/profile')} style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}>
            <Image source={{ uri: 'https://i.scdn.co/image/ab67616d00001e028f33770d5cb6b7bbbd59686a' }} style={styles.avatarImage} />
          </Pressable>
        </View>

        <Pressable onPress={() => router.push('/profile')} style={({ pressed }) => [styles.profileCard, pressed && styles.pressed]}>
          <View style={styles.largeAvatar}>
            <Image source={{ uri: 'https://i.scdn.co/image/ab67616d00001e028f33770d5cb6b7bbbd59686a' }} style={styles.largeAvatarImage} />
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>Alex Morgan</Text>
            <Text style={styles.profileSubtitle}>Student account</Text>
            <Text style={styles.profileEmail}>alex.morgan@example.com</Text>
          </View>
          <Icon ios="chevron.right" android="chevron_right" size={18} color="#fff" />
        </Pressable>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressEyebrow}>THIS WEEK</Text>
              <Text style={styles.progressTitle}>You&apos;re building momentum</Text>
            </View>
            <Text style={styles.progressValue}>3/5</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressHint}>Two more tutor sessions to reach your goal.</Text>
        </View>

        <Text style={styles.sectionTitle}>Account & support</Text>
        <View style={styles.menuList}>
          {menuItems.map((item) => (
            <Pressable key={item.title} onPress={item.title === 'My profile' ? () => router.push('/profile') : undefined} style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
              <View style={styles.menuIcon}>
                <Icon ios={item.ios} android={item.android} size={20} />
              </View>
              <View style={styles.menuCopy}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Icon ios="chevron.right" android="chevron_right" size={17} color={MUTED} />
            </Pressable>
          ))}
          <Pressable
            accessibilityRole="button"
            onPress={signOut}
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
            <View style={styles.logoutIcon}>
              <Icon ios="rectangle.portrait.and.arrow.right" android="logout" size={19} color="#fff" />
            </View>
            <View style={styles.menuCopy}>
              <Text style={styles.menuTitle}>Log out</Text>
              <Text style={styles.menuSubtitle}>Return to the sign in screen</Text>
            </View>
            <Icon ios="chevron.right" android="chevron_right" size={17} color={MUTED} />
          </Pressable>
        </View>
        <Text style={styles.version}>LEARNOVA · VERSION 1.0</Text>
      </ScrollView>

      <View style={styles.bottomNav}>
        {tabs.map((tab) => {
          const active = tab.key === 'menu';
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
              }}
              style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
              <Icon ios={tab.ios} android={tab.android} size={25} color={active ? BLACK : MUTED} />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
              {active && <View style={styles.tabIndicator} />}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f5f5f5', flex: 1 },
  content: { alignSelf: 'center', maxWidth: 920, paddingBottom: 32, paddingHorizontal: 16, paddingTop: 12, width: '100%' },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  eyebrow: { color: BLACK, fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: INK, fontSize: 28, fontWeight: '800', marginTop: 5 },
  avatar: { alignItems: 'center', backgroundColor: BLACK, borderRadius: 21, height: 42, justifyContent: 'center', width: 42 },
  avatarImage: { borderRadius: 21, height: '100%', width: '100%' },
  profileCard: { alignItems: 'center', backgroundColor: BLACK_DARK, borderRadius: 18, flexDirection: 'row', padding: 18 },
  largeAvatar: { alignItems: 'center', backgroundColor: '#333', borderRadius: 28, height: 56, justifyContent: 'center', width: 56 },
  largeAvatarImage: { borderRadius: 28, height: '100%', width: '100%' },
  profileCopy: { flex: 1, marginLeft: 14 },
  profileName: { color: '#fff', fontSize: 17, fontWeight: '800' },
  profileSubtitle: { color: '#c7c7c7', fontSize: 12, marginTop: 3 },
  profileEmail: { color: '#999', fontSize: 11, marginTop: 5 },
  progressCard: { backgroundColor: '#fff', borderRadius: 16, marginTop: 14, padding: 18 },
  progressHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  progressEyebrow: { color: BLACK, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  progressTitle: { color: INK, fontSize: 16, fontWeight: '800', marginTop: 5 },
  progressValue: { color: BLACK, fontSize: 18, fontWeight: '800' },
  progressTrack: { backgroundColor: '#e5e5e5', borderRadius: 4, height: 8, marginTop: 17, overflow: 'hidden' },
  progressFill: { backgroundColor: BLACK, borderRadius: 4, height: '100%', width: '60%' },
  progressHint: { color: MUTED, fontSize: 12, marginTop: 9 },
  sectionTitle: { color: INK, fontSize: 20, fontWeight: '800', marginBottom: 13, marginTop: 30 },
  menuList: { gap: 10 },
  menuItem: { alignItems: 'center', backgroundColor: '#fff', borderColor: BORDER, borderRadius: 16, borderWidth: 1, flexDirection: 'row', minHeight: 76, padding: 13 },
  menuIcon: { alignItems: 'center', backgroundColor: '#eeeeee', borderRadius: 12, height: 42, justifyContent: 'center', width: 42 },
  menuCopy: { flex: 1, marginHorizontal: 12 },
  menuTitle: { color: INK, fontSize: 15, fontWeight: '800' },
  menuSubtitle: { color: MUTED, fontSize: 11, marginTop: 4 },
  logoutIcon: { alignItems: 'center', backgroundColor: BLACK, borderRadius: 12, height: 42, justifyContent: 'center', width: 42 },
  version: { alignSelf: 'center', color: '#999', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginTop: 18 },
  bottomNav: { alignItems: 'center', backgroundColor: '#fff', borderColor: BORDER, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, paddingHorizontal: 8, paddingTop: 8 },
  tabButton: { alignItems: 'center', flex: 1, paddingHorizontal: 4, paddingTop: 2, position: 'relative' },
  tabLabel: { color: MUTED, fontSize: 12, fontWeight: '700', marginTop: 5 },
  tabLabelActive: { color: BLACK },
  tabIndicator: { backgroundColor: BLACK, borderRadius: 2, bottom: -10, height: 3, position: 'absolute', width: 20 },
  pressed: { opacity: 0.82 },
});