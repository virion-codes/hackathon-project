import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GroupSidebar from '../components/GroupSidebar';
import colors from '../theme/colors';
import { useAuth } from '../context/AuthContext';

const Row = ({ label, onPress }) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowArrow}>›</Text>
  </TouchableOpacity>
);

export default function AccountScreen() {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const [sidebarVisible, setSidebarVisible] = React.useState(true);

  return (
    <View style={styles.container}>
      {sidebarVisible && (
        <GroupSidebar
          onSelectGroup={(g) => {
          const parent = navigation.getParent();
          parent?.navigate('GroupChat', { groupId: g.id });
        }}
          onProfile={() => {}}
        />
      )}
      <View style={styles.main}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => setSidebarVisible(!sidebarVisible)}
            style={styles.menuBtn}
          >
            <View style={[styles.menuLine, styles.menuLineShort]} />
            <View style={styles.menuLine} />
            <View style={[styles.menuLine, styles.menuLineShort]} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>My Account</Text>
          <Row
            label="Account & Security"
            onPress={() => Alert.alert('Account & Security', 'Change password, email, and security options. (Coming soon)')}
          />
          <View style={styles.separator} />
          <Text style={styles.sectionTitle}>Settings</Text>
          <Row
            label="Notifications Settings"
            onPress={() => Alert.alert('Notifications', 'Configure push and in-app notifications. (Coming soon)')}
          />
          <Row
            label="Privacy Settings"
            onPress={() => Alert.alert('Privacy', 'Control who can see your profile and groups. (Coming soon)')}
          />
          <View style={styles.separator} />
          <Text style={styles.sectionTitle}>Support</Text>
          <Row
            label="Help Centre"
            onPress={() => Alert.alert('Help Centre', 'FAQs and contact support. (Coming soon)')}
          />
          <Row
            label="Community Rules"
            onPress={() => Alert.alert('Community Rules', 'Be respectful. No spam. Study spots are for in-person meetups only.')}
          />
          <Row
            label="About"
            onPress={() => Alert.alert('Study Spot', 'Version 1.0.0\nBalance social and school life by studying together in groups.')}
          />
          <View style={styles.separator} />
          <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  main: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuBtn: { padding: 8 },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: colors.textSecondary,
    marginVertical: 2,
    borderRadius: 1,
  },
  menuLineShort: { width: 14 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  rowLabel: { fontSize: 16, color: colors.text },
  rowArrow: { fontSize: 22, color: colors.textSecondary },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  signOutBtn: {
    marginTop: 24,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: 10,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
