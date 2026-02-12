import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import colors from '../theme/colors';
import { MOCK_GROUPS } from '../data/mockData';

export default function GroupSidebar({ currentGroupId, onSelectGroup, onProfile }) {
  return (
    <View style={styles.sidebar}>
      <TouchableOpacity style={styles.profileCircle} onPress={onProfile}>
        <Text style={styles.profileLetter}>U</Text>
      </TouchableOpacity>
      {MOCK_GROUPS.map((group) => (
        <TouchableOpacity
          key={group.id}
          style={[
            styles.groupCircle,
            { backgroundColor: group.color },
            currentGroupId === group.id && styles.groupCircleActive,
          ]}
          onPress={() => onSelectGroup(group)}
        >
          <Text style={styles.groupLetter}>{group.icon}</Text>
        </TouchableOpacity>
      ))}
      <View style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 56,
    backgroundColor: colors.sidebar,
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
  },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.sidebarLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.sidebar,
  },
  profileLetter: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  groupCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  groupLetter: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  groupCircleActive: {
    borderRadius: 12,
  },
  logo: {
    position: 'absolute',
    bottom: 24,
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.text,
  },
});
