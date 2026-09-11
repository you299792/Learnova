import { useLocalSearchParams } from 'expo-router';

import { tutors } from '@/components/student/tutor-data';
import { TutorProfileView } from '@/components/student/tutor-profile';

export default function StudentTutorProfile() {
  const { tutorId } = useLocalSearchParams<{ tutorId?: string | string[] }>();
  const requestedTutorId = Array.isArray(tutorId) ? tutorId[0] : tutorId;
  const tutor = tutors.find((item) => item.id === requestedTutorId) ?? tutors[0];

  return <TutorProfileView tutor={tutor} />;
}
