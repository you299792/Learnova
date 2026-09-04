import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { supabase } from './src/utils/supabase';

type Subject = {
  subject_id: string;
  subject_code: string;
  subject_name: string;
};

export default function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTodos() {
      const { data, error: queryError } = await supabase
        .from('subjects')
        .select('subject_id, subject_code, subject_name');

      if (queryError) {
        setError(queryError.message);
      } else if (data) {
        setSubjects(data);
      }

      setLoading(false);
    }

    getTodos().catch((requestError: Error) => {
      setError(requestError.message);
      setLoading(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator />}
      {error && <Text style={styles.error}>{error}</Text>}
      {!loading && !error && (
        <FlatList
          data={subjects}
          keyExtractor={(subject) => subject.subject_id}
          renderItem={({ item }) => (
            <Text>
              {item.subject_code}: {item.subject_name}
            </Text>
          )}
          ListEmptyComponent={<Text>No subjects found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  error: {
    color: '#b42318',
  },
});