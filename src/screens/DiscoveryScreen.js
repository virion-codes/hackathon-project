import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GroupSidebar from '../components/GroupSidebar';
import { MOCK_DISCOVERY_GROUPS } from '../data/mockData';
import colors from '../theme/colors';

export default function DiscoveryScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <View style={styles.container}>
      {sidebarVisible && (
        <GroupSidebar
          onSelectGroup={(g) => {
          const parent = navigation.getParent();
          (parent || navigation).navigate('GroupChat', { groupId: g.id });
        }}
          onProfile={() => navigation.navigate('AccountTab')}
        />
      )}
      <View style={styles.main}>
        <View style={styles.searchRow}>
          <TouchableOpacity onPress={() => setSidebarVisible(!sidebarVisible)} style={styles.menuBtn}>
            <View style={[styles.menuLine, styles.menuLineShort]} />
            <View style={styles.menuLine} />
            <View style={[styles.menuLine, styles.menuLineShort]} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups by interest, school, level..."
            placeholderTextColor={colors.placeholder}
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.searchIcon}>
            <Text style={styles.searchIconText}>⌕</Text>
          </View>
        </View>
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {MOCK_DISCOVERY_GROUPS.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => {
              const parent = navigation.getParent();
              (parent || navigation).navigate('GroupChat', { groupId: group.id });
            }}
            >
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>{group.name.charAt(0)}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{group.name}</Text>
                <Text style={styles.cardMeta}>{group.level} · {group.members} members</Text>
                <Text style={styles.cardInterests}>{group.interests.join(', ')}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuBtn: { padding: 8, marginRight: 8 },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: colors.textSecondary,
    marginVertical: 2,
    borderRadius: 1,
  },
  menuLineShort: { width: 14 },
  searchInput: {
    flex: 1,
    backgroundColor: colors.grayLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
  },
  searchIcon: {
    marginLeft: 8,
    padding: 6,
  },
  searchIconText: { fontSize: 20, color: colors.textSecondary },
  list: { flex: 1 },
  listContent: { padding: 12, paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardIconText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  cardBody: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  cardMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  cardInterests: {
    fontSize: 12,
    color: colors.placeholder,
    marginTop: 2,
  },
});
