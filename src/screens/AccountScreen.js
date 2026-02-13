import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GroupSidebar from '../components/GroupSidebar';
import colors from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { MOCK_ACCOUNT_ROWS } from '../data/mockData';

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
            const tabNav = navigation.getParent();
            tabNav?.navigate('HomeTab', { screen: 'GroupChat', params: { groupId: g.id } });
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
          {MOCK_ACCOUNT_ROWS.map(({ section, items }) => (
            <React.Fragment key={section}>
              <Text style={styles.sectionTitle}>{section}</Text>
              {items.map((label) => (
                <Row
                  key={label}
                  label={label}
                  onPress={() => Alert.alert(label, '(Coming soon)')}
                />
              ))}
              <View style={styles.separator} />
            </React.Fragment>
          ))}
          <Row
            label="Community Rules"
            onPress={() => Alert.alert('Community Rules', 'Be respectful. No spam. Study spots are for in-person meetups only.')}
          />
          <Row
            label="About"
            onPress={() => Alert.alert('CommonRoom', 'Version 1.0.0\nBalance social and school life by studying together in groups.')}
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
    borderBottomColor: colors.borderStrong,
  },
  menuBtn: { padding: 8 },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: colors.text,
    marginVertical: 2,
    borderRadius: 1,
  },
  menuLineShort: { width: 14 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 8,
    marginTop: 24,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  rowLabel: { fontSize: 16, fontWeight: '500', color: colors.text },
  rowArrow: { fontSize: 20, color: colors.textMuted },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  signOutBtn: {
    marginTop: 24,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
