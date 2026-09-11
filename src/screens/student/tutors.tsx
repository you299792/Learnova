import { useLocalSearchParams } from 'expo-router';

import { TutorSelectionView } from '@/components/student/tutor-selection';

export default function StudentTutors() {
  const { subjects } = useLocalSearchParams<{ subjects?: string | string[] }>();
  const subjectParam = Array.isArray(subjects) ? subjects[0] : subjects;
  const selectedSubjectIds = subjectParam?.split(',').filter(Boolean) ?? [];

  return <TutorSelectionView selectedSubjectIds={selectedSubjectIds} />;
}
