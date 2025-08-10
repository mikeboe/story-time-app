import { StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Profile
        </ThemedText>
        
        {user && (
          <ThemedView style={styles.userInfo}>
            <ThemedText style={styles.label}>Name:</ThemedText>
            <ThemedText style={styles.value}>
              {user.firstName} {user.lastName}
            </ThemedText>
            
            <ThemedText style={styles.label}>Email:</ThemedText>
            <ThemedText style={styles.value}>{user.email}</ThemedText>
            
            <ThemedText style={styles.label}>Role:</ThemedText>
            <ThemedText style={styles.value}>{user.role}</ThemedText>
            
            <ThemedText style={styles.label}>Email Verified:</ThemedText>
            <ThemedText style={styles.value}>
              {user.emailVerified ? 'Yes' : 'No'}
            </ThemedText>
          </ThemedView>
        )}

        <Button
          title="Logout"
          variant="outline"
          onPress={handleLogout}
          loading={isLoading}
          style={styles.logoutButton}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
  },
  userInfo: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    opacity: 0.7,
  },
  logoutButton: {
    marginTop: 'auto',
  },
});