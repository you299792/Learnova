import { useEffect, useMemo, useState } from 'react';
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
type Filter = 'All' | 'Math' | 'Science' | 'English' | 'Coding';
type FileType = 'PDF' | 'DOC' | 'IMAGE' | 'LINK';

const tabs: { key: Tab; label: string; ios: SFSymbol; android: AndroidSymbol }[] = [
  { key: 'home', label: 'Home', ios: 'house.fill', android: 'home' },
  { key: 'schedule', label: 'Schedule', ios: 'calendar', android: 'event' },
  { key: 'files', label: 'Files', ios: 'folder.fill', android: 'folder' },
  { key: 'menu', label: 'Menu', ios: 'line.3.horizontal', android: 'menu' },
];

const filters: Filter[] = ['All', 'Math', 'Science', 'English', 'Coding'];

type TutorFile = {
  id: string;
  name: string;
  subject: Exclude<Filter, 'All'>;
  tutor: string;
  uploaded: string;
  size: string;
  type: FileType;
  ios: SFSymbol;
  android: AndroidSymbol;
  color: string;
};

const tutorFiles: TutorFile[] = [
  { id: 'quadratics', name: 'Quadratic equations guide', subject: 'Math', tutor: 'Maya Chen', uploaded: 'Today', size: '2.4 MB', type: 'PDF', ios: 'doc.text.fill', android: 'picture_as_pdf', color: '#e7e7e7' },
  { id: 'cells', name: 'Cell structure diagrams', subject: 'Science', tutor: 'Maya Chen', uploaded: 'Yesterday', size: '4.8 MB', type: 'IMAGE', ios: 'photo.fill', android: 'image', color: '#ededed' },
  { id: 'essay', name: 'Essay planning template', subject: 'English', tutor: 'Theo Brooks', uploaded: 'Sep 8', size: '860 KB', type: 'DOC', ios: 'doc.richtext.fill', android: 'article', color: '#e4e4e4' },
  { id: 'loops', name: 'Loops and conditions recap', subject: 'Coding', tutor: 'Sam Rivera', uploaded: 'Sep 6', size: '1.1 MB', type: 'PDF', ios: 'doc.text.fill', android: 'picture_as_pdf', color: '#f1f1f1' },
  { id: 'practice', name: 'Extra practice problems', subject: 'Math', tutor: 'Maya Chen', uploaded: 'Sep 4', size: '720 KB', type: 'LINK', ios: 'link', android: 'link', color: '#eeeeee' },
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

export default function StudentFiles() {
  const [selectedFilter, setSelectedFilter] = useState<Filter>('All');
  const visibleFiles = useMemo(
    () => selectedFilter === 'All' ? tutorFiles : tutorFiles.filter((file) => file.subject === selectedFilter),
    [selectedFilter],
  );

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    void NavigationBar.setVisibilityAsync('hidden');
    return () => {
      void NavigationBar.setVisibilityAsync('visible');
    };
  }, []);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>YOUR LEARNING SPACE</Text>
            <Text style={styles.title}>Files</Text>
          </View>
          <Pressable accessibilityLabel="Profile" onPress={() => router.push('/profile')} style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}>
            <Image source={{ uri: 'https://i.scdn.co/image/ab67616d00001e028f33770d5cb6b7bbbd59686a' }} style={styles.avatarImage} />
          </Pressable>
        </View>

        <View style={styles.introRow}>
          <View>
            <Text style={styles.sectionTitle}>Tutor resources</Text>
            <Text style={styles.sectionSubtitle}>Everything your tutors have shared</Text>
          </View>
          <View style={styles.folderIcon}>
            <Icon ios="folder.fill" android="folder" size={20} color="#fff" />
          </View>
        </View>

        <View style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <View>
              <Text style={styles.storageEyebrow}>YOUR LIBRARY</Text>
              <Text style={styles.storageTitle}>12 files saved</Text>
            </View>
            <Text style={styles.storageValue}>18.6 MB</Text>
          </View>
          <View style={styles.storageTrack}>
            <View style={styles.storageFill} />
          </View>
          <Text style={styles.storageHint}>Shared by Maya, Theo, and Sam</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((filter) => {
            const selected = selectedFilter === filter;
            return (
              <Pressable
                key={filter}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => setSelectedFilter(filter)}
                style={({ pressed }) => [styles.filterButton, selected && styles.filterButtonSelected, pressed && styles.pressed]}>
                <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{filter}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Recent uploads</Text>
            <Text style={styles.sectionSubtitle}>Open a file whenever you need it</Text>
          </View>
          <Text style={styles.fileCount}>{visibleFiles.length} files</Text>
        </View>

        <View style={styles.fileList}>
          {visibleFiles.map((file) => (
            <Pressable key={file.id} accessibilityRole="button" style={({ pressed }) => [styles.fileCard, pressed && styles.pressed]}>
              <View style={[styles.fileIcon, { backgroundColor: file.color }]}>
                <Icon ios={file.ios} android={file.android} size={21} />
              </View>
              <View style={styles.fileCopy}>
                <Text numberOfLines={1} style={styles.fileName}>{file.name}</Text>
                <Text style={styles.fileMeta}>{file.subject} · {file.type} · {file.size}</Text>
                <Text style={styles.fileUploader}>Uploaded by {file.tutor} · {file.uploaded}</Text>
              </View>
              <Icon ios="ellipsis" android="more_vert" size={19} color={MUTED} />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {tabs.map((tab) => {
          const active = tab.key === 'files';
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={tab.label}
              onPress={() => {
                if (tab.key === 'home') router.replace('/student');
                if (tab.key === 'schedule') router.push('/schedule');
                if (tab.key === 'menu') router.push('/menu');
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
  avatar: { alignItems: 'center', backgroundColor: BLACK, borderRadius: 21, elevation: 3, height: 42, justifyContent: 'center', shadowColor: BLACK_DARK, shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.18, shadowRadius: 5, width: 42 },
  avatarImage: { borderRadius: 21, height: '100%', width: '100%' },
  introRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  sectionTitle: { color: INK, fontSize: 20, fontWeight: '800' },
  sectionSubtitle: { color: MUTED, fontSize: 13, marginTop: 4 },
  folderIcon: { alignItems: 'center', backgroundColor: BLACK, borderRadius: 20, height: 40, justifyContent: 'center', width: 40 },
  storageCard: { backgroundColor: BLACK_DARK, borderRadius: 18, marginTop: 20, padding: 19 },
  storageHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  storageEyebrow: { color: '#aaa', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  storageTitle: { color: '#fff', fontSize: 17, fontWeight: '800', marginTop: 5 },
  storageValue: { color: '#fff', fontSize: 16, fontWeight: '800' },
  storageTrack: { backgroundColor: '#3b3b3b', borderRadius: 4, height: 7, marginTop: 17, overflow: 'hidden' },
  storageFill: { backgroundColor: '#fff', borderRadius: 4, height: '100%', width: '36%' },
  storageHint: { color: '#aaa', fontSize: 12, marginTop: 9 },
  filterRow: { gap: 8, paddingBottom: 2, paddingTop: 22 },
  filterButton: { backgroundColor: '#fff', borderColor: BORDER, borderRadius: 18, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 9 },
  filterButtonSelected: { backgroundColor: BLACK, borderColor: BLACK },
  filterText: { color: MUTED, fontSize: 12, fontWeight: '800' },
  filterTextSelected: { color: '#fff' },
  sectionHeading: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13, marginTop: 28 },
  fileCount: { color: BLACK, fontSize: 12, fontWeight: '800' },
  fileList: { gap: 10 },
  fileCard: { alignItems: 'center', backgroundColor: '#fff', borderColor: BORDER, borderRadius: 16, borderWidth: 1, flexDirection: 'row', minHeight: 84, padding: 13 },
  fileIcon: { alignItems: 'center', borderRadius: 12, height: 45, justifyContent: 'center', width: 45 },
  fileCopy: { flex: 1, marginHorizontal: 12 },
  fileName: { color: INK, fontSize: 15, fontWeight: '800' },
  fileMeta: { color: MUTED, fontSize: 11, fontWeight: '700', marginTop: 5 },
  fileUploader: { color: '#8a9a9b', fontSize: 11, marginTop: 5 },
  bottomNav: { alignItems: 'center', backgroundColor: '#fff', borderColor: BORDER, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, paddingHorizontal: 8, paddingTop: 8 },
  tabButton: { alignItems: 'center', flex: 1, paddingHorizontal: 4, paddingTop: 2, position: 'relative' },
  tabLabel: { color: MUTED, fontSize: 12, fontWeight: '700', marginTop: 5 },
  tabLabelActive: { color: BLACK },
  tabIndicator: { backgroundColor: BLACK, borderRadius: 2, bottom: -10, height: 3, position: 'absolute', width: 20 },
  pressed: { opacity: 0.82 },
});