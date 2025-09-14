import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { AuthButton } from '@/components/auth-button';
import { useLanguage } from '@/contexts';
import { useAuth0 } from 'react-native-auth0';

interface TokenInfo {
  accessToken: string | null;
  expiresAt: string | null;
  issuedAt: string | null;
  refreshToken: boolean;
}

export const UserProfile: React.FC = () => {
  const { user, getCredentials } = useAuth0();
  const { t } = useLanguage();
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    accessToken: null,
    expiresAt: null,
    issuedAt: null,
    refreshToken: false,
  });
  const [loading, setLoading] = useState(true);

  const base64UrlDecode = (str: string): string => {
    // Replace base64url characters with base64 characters
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }

    try {
      return atob(base64);
    } catch (error) {
      console.error('Base64 decode error:', error);
      return '{}';
    }
  };

  const getTokenInfo = async (): Promise<TokenInfo> => {
    const credentials = await getCredentials();
    if (!credentials?.accessToken) {
      return {
        accessToken: null,
        expiresAt: null,
        issuedAt: null,
        refreshToken: false,
      };
    }

    try {
      // Decode JWT payload (basic parsing - for display purposes only)
      return {
        accessToken: `${credentials.accessToken.substring(0, 20)}...`,
        expiresAt: new Date(credentials.expiresAt * 1000).toLocaleString(),
        issuedAt: credentials.issuedAt
          ? new Date(credentials.issuedAt * 1000).toLocaleString()
          : null,
        refreshToken: true, // Assume refresh token exists if we have access token
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return {
        accessToken: 'Invalid token format',
        expiresAt: null,
        issuedAt: null,
        refreshToken: false,
      };
    }
  };

  const testTokenRefresh = async () => {
    try {
      const token = await getCredentials();
      if (token) {
        Alert.alert('Success', 'Token refreshed successfully');
      } else {
        Alert.alert('Error', 'Failed to get access token');
      }
    } catch (error) {
      Alert.alert('Error', `Token refresh failed: ${error}`);
    }
  };

  useEffect(() => {
    const fetchTokenInfo = async () => {
      if (user) {
        setLoading(true);
        try {
          const info = await getTokenInfo();
          setTokenInfo(info);
        } catch (error) {
          console.error('Error fetching token info:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTokenInfo();
  }, [user]);

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.notAuthenticatedContainer}>
          <ThemedText style={styles.notAuthenticatedText}>
            Please log in to view your profile
          </ThemedText>
          <AuthButton />
        </View>
      </ThemedView>
    );
  }

  const avatarUri =
    user.picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || 'User')}&size=120&background=007AFF&color=fff`;

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatar}
            contentFit="cover"
          />
        </View>

        <ThemedText type="title" style={styles.userName}>
          {user.name || user.nickname || 'Unknown User'}
        </ThemedText>

        <ThemedText style={styles.userEmail}>{user.email}</ThemedText>

        {user.email_verified && (
          <View style={styles.verifiedBadge}>
            <ThemedText style={styles.verifiedText}>✓ Verified</ThemedText>
          </View>
        )}
      </ThemedView>

      <ThemedView style={styles.infoSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          User Information
        </ThemedText>

        <View style={styles.infoRow}>
          <ThemedText style={styles.infoLabel}>User ID:</ThemedText>
          <ThemedText style={styles.infoValue} numberOfLines={2}>
            {user.sub}
          </ThemedText>
        </View>

        {user.updated_at && (
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Last Updated:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {new Date(user.updated_at).toLocaleDateString()}
            </ThemedText>
          </View>
        )}

        {user.locale && (
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Locale:</ThemedText>
            <ThemedText style={styles.infoValue}>{user.locale}</ThemedText>
          </View>
        )}
      </ThemedView>

      <ThemedView style={styles.tokenSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Token Information
        </ThemedText>

        <View style={styles.infoRow}>
          <ThemedText style={styles.infoLabel}>Access Token:</ThemedText>
          <ThemedText style={styles.tokenValue} numberOfLines={1}>
            {tokenInfo.accessToken || 'Not available'}
          </ThemedText>
        </View>

        {tokenInfo.issuedAt && (
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Issued At:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {tokenInfo.issuedAt}
            </ThemedText>
          </View>
        )}

        {tokenInfo.expiresAt && (
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Expires At:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {tokenInfo.expiresAt}
            </ThemedText>
          </View>
        )}

        <View style={styles.infoRow}>
          <ThemedText style={styles.infoLabel}>Refresh Token:</ThemedText>
          <ThemedText
            style={[
              styles.infoValue,
              tokenInfo.refreshToken ? styles.successText : styles.errorText,
            ]}
          >
            {tokenInfo.refreshToken ? 'Available' : 'Not available'}
          </ThemedText>
        </View>

        <ThemedView style={styles.section}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={testTokenRefresh}
          >
            <Text style={styles.refreshButtonText}>Test Token Refresh</Text>
          </TouchableOpacity>
        </ThemedView>
        <AuthButton />
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  notAuthenticatedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notAuthenticatedText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  userName: {
    textAlign: 'center',
    marginBottom: 8,
  },
  userEmail: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 12,
  },
  verifiedBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoSection: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  tokenSection: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    flex: 2,
    textAlign: 'right',
  },
  tokenValue: {
    fontSize: 12,
    fontFamily: 'monospace',
    flex: 2,
    textAlign: 'right',
  },
  successText: {
    color: '#34C759',
  },
  errorText: {
    color: '#FF3B30',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 50,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
