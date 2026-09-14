import { useState } from 'react';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StudentIcon as Icon } from '@/components/student/student-ui';

const BLACK = '#111111';
const INK = '#111111';
const MUTED = '#666666';
const BORDER = '#d6d6d6';
const ACCENT = '#FED701';

export default function EditStudentProfile() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('Batu Khan');
  const [email, setEmail] = useState('batu_khan@gmail.com');
  const [mobileNumber, setMobileNumber] = useState('+1 (555) 014-7826');
  const [preferredStudyTime, setPreferredStudyTime] = useState('Afternoons');
  const [bio, setBio] = useState('Curious learner building better habits through peer tutoring.');

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.screen}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + 24, 32) }]}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable accessibilityLabel="Go back to profile" onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <Icon ios="chevron.left" android="arrow_back" size={20} />
          </Pressable>
          <Text style={styles.topBarTitle}>Edit profile</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.intro}>
          <Text style={styles.title}>Your details</Text>
          <Text style={styles.subtitle}>Keep your profile information up to date.</Text>
        </View>

        <View style={styles.formCard}>
          <Field label="Name" value={name} onChangeText={setName} autoCapitalize="words" />
          <Field label="Email address" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <Field label="Mobile number" value={mobileNumber} onChangeText={setMobileNumber} keyboardType="phone-pad" />
          <Field label="Preferred study time" value={preferredStudyTime} onChangeText={setPreferredStudyTime} autoCapitalize="words" />
          <Field label="Bio" value={bio} onChangeText={setBio} multiline textAlignVertical="top" style={styles.bioInput} />
        </View>

        <Pressable accessibilityRole="button" onPress={() => router.back()} style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
          <Text style={styles.saveButtonText}>Save changes</Text>
          <Icon ios="checkmark" android="check" size={17} color={BLACK} />
        </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  ...props
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
} & Omit<React.ComponentProps<typeof TextInput>, 'value' | 'onChangeText'>) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...props} onChangeText={onChangeText} style={[styles.input, props.style]} value={value} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f5f5f5', flex: 1 },
  screen: { flex: 1 },
  content: { alignSelf: 'center', maxWidth: 720, paddingBottom: 32, paddingHorizontal: 16, paddingTop: 12, width: '100%' },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  backButton: { alignItems: 'center', backgroundColor: '#fff', borderColor: BORDER, borderRadius: 20, borderWidth: 1, height: 40, justifyContent: 'center', width: 40 },
  topBarTitle: { color: INK, fontSize: 20, fontWeight: '800' },
  topBarSpacer: { height: 40, width: 40 },
  intro: { marginBottom: 18 },
  title: { color: INK, fontSize: 26, fontWeight: '800' },
  subtitle: { color: MUTED, fontSize: 13, marginTop: 5 },
  formCard: { backgroundColor: '#fff', borderColor: BORDER, borderRadius: 16, borderWidth: 1, padding: 16 },
  field: { marginBottom: 18 },
  label: { color: INK, fontSize: 13, fontWeight: '700', marginBottom: 8 },
  input: { backgroundColor: '#fbfbfb', borderColor: BORDER, borderRadius: 11, borderWidth: 1, color: INK, fontSize: 15, minHeight: 50, paddingHorizontal: 14 },
  bioInput: { minHeight: 105, paddingTop: 13 },
  saveButton: { alignItems: 'center', backgroundColor: ACCENT, borderRadius: 13, flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 18, minHeight: 54 },
  saveButtonText: { color: BLACK, fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.82 },
});
