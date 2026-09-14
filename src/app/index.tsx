import { useEffect, useState } from 'react';
import type { AndroidSymbol } from 'expo-symbols';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { SFSymbol } from 'sf-symbols-typescript';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { supabase } from '@/utils/supabase';

type Role = 'student' | 'tutor';
type Mode = 'signIn' | 'signUp';
type Field = 'firstName' | 'lastName' | 'email' | 'password' | null;

const BLACK = '#111111';
const BLACK_DARK = '#000000';
const BLACK_SOFT = '#eeeeee';
const BORDER = '#d6d6d6';
const BORDER_FOCUS = '#111111';
const INK = '#111111';
const MUTED = '#666666';

const recentAccounts: { firstName: string; lastName: string; email: string; role: Role; initials: string }[] = [
  { firstName: 'Batu', lastName: 'Khan', email: 'batu.khan@example.com', role: 'student', initials: 'BK' },
  { firstName: 'Maya', lastName: 'Chen', email: 'maya.chen@example.com', role: 'tutor', initials: 'MC' },
  { firstName: 'Sofia', lastName: 'Rivera', email: 'sofia.rivera@example.com', role: 'student', initials: 'SR' },
];

function Icon({
  ios,
  android,
  size = 18,
  color = MUTED,
}: {
  ios: SFSymbol;
  android: AndroidSymbol;
  size?: number;
  color?: string;
}) {
  return <SymbolView name={{ ios, android, web: android }} size={size} tintColor={color} />;
}

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const compactLayout = width < 380;
  const [mode, setMode] = useState<Mode>('signIn');
  const [role, setRole] = useState<Role>('student');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<Field>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSignedInEmail(data.session?.user.email ?? null);
    });
  }, []);

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError(null);
    setNotice(null);
  }

  async function submit() {
    if (mode === 'signIn' && role === 'student') {
      router.replace('/student');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError('Email and password are required.');
      setNotice(null);
      return;
    }
    if (mode === 'signUp' && (!firstName.trim() || !lastName.trim())) {
      setError('First name and last name are required.');
      setNotice(null);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setNotice(null);
      return;
    }

    setBusy(true);
    setError(null);
    setNotice(null);

    if (mode === 'signIn') {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (authError) setError(authError.message);
      else setSignedInEmail(data.user?.email ?? cleanEmail);
    } else {
      const { data, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            role,
          },
        },
      });

      if (authError) {
        setError(authError.message);
      } else if (data.user) {
        if (data.session) {
          setSignedInEmail(data.user.email ?? cleanEmail);
        } else {
          setNotice('Account created. Check your email to confirm it, then sign in.');
          setMode('signIn');
        }
      }
    }
    setBusy(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSignedInEmail(null);
    setNotice('You have been signed out.');
  }

  if (signedInEmail) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={[styles.signedIn, { paddingBottom: insets.bottom + 28 }]}>
          <View style={styles.brandMark}>
            <Icon ios="graduationcap.fill" android="school" color="#fff" size={26} />
          </View>
          <Text style={styles.brand}>LEARNOVA</Text>
          <Text style={styles.welcome}>You&apos;re all set.</Text>
          <Text style={styles.signedEmail}>{signedInEmail}</Text>
          <Pressable onPress={signOut} style={({ pressed }) => [styles.button, styles.signOutButton, pressed && styles.pressed]}>
            <Icon ios="rectangle.portrait.and.arrow.right" android="logout" color={BLACK} size={16} />
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View pointerEvents="none" style={styles.blobTop} />
      <View pointerEvents="none" style={styles.blobBottom} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Icon ios="graduationcap.fill" android="school" color="#fff" size={20} />
            </View>
            <Text style={styles.brand}>LEARNOVA</Text>
          </View>

          <View style={[styles.card, compactLayout && styles.cardCompact]}>
            <Text style={[styles.title, compactLayout && styles.titleCompact]}>{mode === 'signIn' ? 'Welcome back.' : 'Start learning together.'}</Text>
            <Text style={[styles.subtitle, compactLayout && styles.subtitleCompact]}>
              {mode === 'signIn' ? 'Sign in to continue your tutoring journey.' : 'Create your peer tutoring account in a minute.'}
            </Text>

            <View style={styles.switcher}>
              <Pressable onPress={() => switchMode('signIn')} style={[styles.switchItem, mode === 'signIn' && styles.switchActive]}>
                <Text style={[styles.switchText, mode === 'signIn' && styles.switchTextActive]}>Sign in</Text>
              </Pressable>
              <Pressable onPress={() => switchMode('signUp')} style={[styles.switchItem, mode === 'signUp' && styles.switchActive]}>
                <Text style={[styles.switchText, mode === 'signUp' && styles.switchTextActive]}>Sign up</Text>
              </Pressable>
            </View>

            <Text style={styles.label}>I am joining as</Text>
            <View style={[styles.roleRow, compactLayout && styles.roleRowCompact]}>
              {(
                [
                  { key: 'student', title: 'Student', desc: 'Get help', ios: 'book.fill', android: 'auto_stories' },
                  { key: 'tutor', title: 'Tutor', desc: 'Give help', ios: 'person.2.fill', android: 'groups' },
                ] as const
              ).map((option) => {
                const selected = role === option.key;
                return (
                  <Pressable
                    key={option.key}
                    onPress={() => setRole(option.key)}
                    style={[styles.roleCard, compactLayout && styles.roleCardCompact, selected && styles.roleCardSelected]}>
                    <View style={[styles.roleIconWrap, selected && styles.roleIconWrapSelected]}>
                      <Icon ios={option.ios} android={option.android} color={selected ? '#fff' : BLACK} size={18} />
                    </View>
                    <View style={styles.roleTextWrap}>
                      <Text style={[styles.roleTitle, selected && styles.roleTitleSelected]}>{option.title}</Text>
                      <Text style={styles.roleDesc}>{option.desc}</Text>
                    </View>
                    {selected && (
                      <View style={styles.roleCheck}>
                        <Icon ios="checkmark.circle.fill" android="check_circle" color={BLACK} size={18} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>

            {mode === 'signUp' && (
              <View style={[styles.nameRow, compactLayout && styles.nameRowCompact]}>
                <View style={styles.nameField}>
                  <Text style={styles.label}>First name</Text>
                  <View style={[styles.inputWrap, focusedField === 'firstName' && styles.inputWrapFocused]}>
                    <Icon ios="person.fill" android="person" size={16} color={focusedField === 'firstName' ? BLACK : '#888888'} />
                    <TextInput
                      value={firstName}
                      onChangeText={setFirstName}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="First name"
                      placeholderTextColor="#8b9899"
                      style={styles.input}
                    />
                  </View>
                </View>
                <View style={styles.nameField}>
                  <Text style={styles.label}>Last name</Text>
                  <View style={[styles.inputWrap, focusedField === 'lastName' && styles.inputWrapFocused]}>
                    <Icon ios="person.fill" android="person" size={16} color={focusedField === 'lastName' ? BLACK : '#888888'} />
                    <TextInput
                      value={lastName}
                      onChangeText={setLastName}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Last name"
                      placeholderTextColor="#8b9899"
                      style={styles.input}
                    />
                  </View>
                </View>
              </View>
            )}

            <Text style={styles.label}>Email address</Text>
            <View style={[styles.inputWrap, focusedField === 'email' && styles.inputWrapFocused]}>
              <Icon ios="envelope.fill" android="mail" size={16} color={focusedField === 'email' ? BLACK : '#888888'} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="you@example.com"
                placeholderTextColor="#8b9899"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrap, focusedField === 'password' && styles.inputWrapFocused]}>
              <Icon ios="lock.fill" android="lock" size={16} color={focusedField === 'password' ? BLACK : '#888888'} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="At least 6 characters"
                placeholderTextColor="#8b9899"
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <Pressable hitSlop={8} onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  ios={showPassword ? 'eye.slash.fill' : 'eye.fill'}
                  android={showPassword ? 'visibility_off' : 'visibility'}
                  size={17}
                  color="#666666"
                />
              </Pressable>
            </View>

            <Pressable
              disabled={busy}
              onPress={submit}
              style={({ pressed }) => [styles.button, busy && styles.disabled, pressed && !busy && styles.pressed]}>
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>{mode === 'signIn' ? 'Sign in' : 'Create account'}</Text>
                  <Icon ios="arrow.right" android="arrow_forward" color="#fff" size={16} />
                </>
              )}
            </Pressable>

            {mode === 'signIn' && (
              <Pressable style={({ pressed }) => [styles.guestButton, pressed && styles.pressed]}>
                <Text style={styles.guestButtonText}>Continue as guest</Text>
              </Pressable>
            )}

            {notice && (
              <View style={styles.noticeBox}>
                <Icon ios="checkmark.circle.fill" android="check_circle" color="#111111" size={15} />
                <Text style={styles.notice}>{notice}</Text>
              </View>
            )}
            {error && (
              <View style={styles.errorBox}>
                <Icon ios="exclamationmark.circle.fill" android="error" color="#111111" size={15} />
                <Text style={styles.error}>{error}</Text>
              </View>
            )}
          </View>

          <View style={styles.recentAccounts}>
            <View style={styles.recentAccountsHeader}>
              <Text style={styles.recentAccountsTitle}>Recently logged in accounts</Text>
              
            </View>
            {recentAccounts.map((account) => (
              <Pressable
                key={account.email}
                onPress={() => {
                  setMode('signUp');
                  setFirstName(account.firstName);
                  setLastName(account.lastName);
                  setEmail(account.email);
                  setRole(account.role);
                }}
                style={({ pressed }) => [styles.recentAccount, pressed && styles.pressed]}>
                <View style={styles.recentAccountInitials}>
                  <Text style={styles.recentAccountInitialsText}>{account.initials}</Text>
                </View>
                <View style={styles.recentAccountCopy}>
                  <Text style={styles.recentAccountName}>{account.firstName} {account.lastName}</Text>
                  <Text style={styles.recentAccountEmail}>{account.email}</Text>
                </View>
                <View style={[styles.accountRole, account.role === 'tutor' && styles.tutorRole]}>
                  <Text style={styles.accountRoleText}>{account.role === 'tutor' ? 'Tutor' : 'Student'}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Text style={styles.footer}>By continuing, you agree to Learnova&apos;s terms and privacy policy.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  flex: { flex: 1 },
  blobTop: {
    position: 'absolute',
    top: -120,
    right: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#e8e8e8',
    opacity: 0.6,
  },
  blobBottom: {
    position: 'absolute',
    bottom: -140,
    left: -110,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#eeeeee',
    opacity: 0.5,
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 48,
  },
  brandRow: { alignItems: 'center', flexDirection: 'row', gap: 10, marginBottom: 24 },
  brandMark: {
    alignItems: 'center',
    backgroundColor: BLACK,
    borderRadius: 12,
    height: 38,
    justifyContent: 'center',
    width: 38,
    shadowColor: BLACK_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  brand: { color: BLACK, fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#0b2320',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 3,
  },
  cardCompact: { padding: 16 },
  title: { color: INK, fontSize: 30, fontWeight: '800', lineHeight: 38 },
  titleCompact: { fontSize: 26, lineHeight: 32 },
  subtitle: { color: MUTED, fontSize: 15, lineHeight: 22, marginTop: 8 },
  subtitleCompact: { fontSize: 14, lineHeight: 20 },
  switcher: { backgroundColor: '#eeeeee', borderRadius: 11, flexDirection: 'row', marginTop: 24, padding: 4 },
  switchItem: { alignItems: 'center', borderRadius: 8, flex: 1, paddingVertical: 11 },
  switchActive: {
    backgroundColor: '#fff',
    shadowColor: '#0b2320',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  switchText: { color: '#718080', fontSize: 14, fontWeight: '700' },
  switchTextActive: { color: BLACK },
  recentAccounts: { backgroundColor: '#f7f7f7', borderColor: BORDER, borderRadius: 14, borderWidth: 1, marginTop: 18, padding: 12 },
  recentAccountsHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  recentAccountsTitle: { color: INK, fontSize: 12, fontWeight: '800' },
  recentAccountsHint: { color: MUTED, fontSize: 10, fontWeight: '700' },
  recentAccount: { alignItems: 'center', backgroundColor: '#fff', borderColor: '#e4e4e4', borderRadius: 10, borderWidth: 1, flexDirection: 'row', marginTop: 7, minHeight: 52, paddingHorizontal: 9 },
  recentAccountInitials: { alignItems: 'center', backgroundColor: BLACK, borderRadius: 17, height: 34, justifyContent: 'center', width: 34 },
  recentAccountInitialsText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  recentAccountCopy: { flex: 1, marginHorizontal: 9 },
  recentAccountName: { color: INK, fontSize: 12, fontWeight: '800' },
  recentAccountEmail: { color: MUTED, fontSize: 10, marginTop: 2 },
  accountRole: { backgroundColor: '#eeeeee', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5 },
  tutorRole: { backgroundColor: '#ffe86b' },
  accountRoleText: { color: BLACK, fontSize: 9, fontWeight: '800' },
  label: { color: '#344b4d', fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 18 },
  roleRow: { flexDirection: 'row', gap: 10 },
  roleRowCompact: { flexDirection: 'column' },
  roleCard: {
    alignItems: 'center',
    backgroundColor: '#fbfdfc',
    borderColor: BORDER,
    borderRadius: 13,
    borderWidth: 1.5,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  roleCardCompact: { flex: 0, width: '100%' },
  roleCardSelected: {
    backgroundColor: BLACK_SOFT,
    borderColor: BLACK,
  },
  roleIconWrap: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: BORDER,
    borderRadius: 9,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  roleIconWrapSelected: {
    backgroundColor: BLACK,
    borderColor: BLACK,
  },
  roleTextWrap: { flex: 1 },
  roleTitle: { color: INK, fontSize: 14, fontWeight: '800' },
  roleTitleSelected: { color: BLACK_DARK },
  roleDesc: { color: MUTED, fontSize: 11, marginTop: 1 },
  roleCheck: { marginLeft: 2 },
  nameRow: { flexDirection: 'row', gap: 10 },
  nameRowCompact: { flexDirection: 'column', gap: 0 },
  nameField: { flex: 1 },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: BORDER,
    borderRadius: 11,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 10,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  inputWrapFocused: {
    borderColor: BORDER_FOCUS,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 1,
  },
  input: { color: INK, flex: 1, fontSize: 16, height: '100%' },
  button: {
    alignItems: 'center',
    backgroundColor: BLACK,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 28,
    minHeight: 52,
    shadowColor: BLACK_DARK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  guestButton: {
    alignItems: 'center',
    borderColor: BORDER,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 50,
  },
  guestButtonText: { color: INK, fontSize: 14, fontWeight: '800' },
  disabled: { opacity: 0.65 },
  pressed: { opacity: 0.88 },
  noticeBox: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    padding: 12,
  },
  notice: { color: '#111111', flex: 1, fontSize: 13, lineHeight: 19 },
  errorBox: {
    alignItems: 'center',
    backgroundColor: '#eeeeee',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    padding: 12,
  },
  error: { color: '#111111', flex: 1, fontSize: 13, lineHeight: 19 },
  footer: { color: '#819091', fontSize: 12, lineHeight: 18, marginTop: 22, textAlign: 'center' },
  signedIn: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 28 },
  welcome: { color: INK, fontSize: 28, fontWeight: '800', marginTop: 20 },
  signedEmail: { color: MUTED, fontSize: 16, marginTop: 8 },
  signOutButton: {
    backgroundColor: BLACK_SOFT,
    marginTop: 32,
    paddingHorizontal: 22,
    shadowOpacity: 0,
    elevation: 0,
  },
  signOutText: { color: BLACK, fontSize: 15, fontWeight: '800' },
});
