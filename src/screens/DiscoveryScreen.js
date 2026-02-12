import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GroupSidebar from '../components/GroupSidebar';
import { MOCK_DISCOVERY_GROUPS } from '../data/mockData';
import colors from '../theme/colors';

export default function DiscoveryScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [pendingGroups, setPendingGroups] = useState(new Set());
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const filteredGroups = MOCK_DISCOVERY_GROUPS.filter((group) => {
    const raw = search.trim();
    if (!raw) return true;

    const terms = raw
      .toLowerCase()
      .split(/[,\s]+/)
      .filter(Boolean);

    if (!terms.length) return true;

    const haystack = (
      group.name +
      ' ' +
      group.level +
      ' ' +
      group.interests.join(' ')
    )
      .toLowerCase()
      .trim();

    // Require that all entered words appear somewhere in the group fields
    return terms.every((term) => haystack.includes(term));
  });

  const closeModal = () => setSelectedGroup(null);

  const handleRequestToJoin = (groupId) => {
    setPendingGroups(new Set([...pendingGroups, groupId]));
    closeModal();
  };

  const handleCancelRequest = (groupId) => {
    const newPending = new Set(pendingGroups);
    newPending.delete(groupId);
    setPendingGroups(newPending);
    setShowCancelConfirm(false);
    closeModal();
  };

  const isPending = (groupId) => pendingGroups.has(groupId);

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
          {filteredGroups.map((group) => (
            <View key={group.id} style={styles.card}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>{group.name.charAt(0)}</Text>
              </View>
              <View style={styles.cardBody}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSelectedGroup(group)}
                >
                  <Text style={styles.cardTitle}>{group.name}</Text>
                </TouchableOpacity>
                <Text style={styles.cardMeta}>{group.level} · {group.members} members</Text>
                <Text style={styles.cardInterests}>{group.interests.join(', ')}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <Modal
          visible={!!selectedGroup}
          transparent
          animationType="fade"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              {selectedGroup && (
                <>
                  <Text style={styles.modalTitle}>{selectedGroup.name}</Text>
                  <Text style={styles.modalMeta}>
                    {selectedGroup.level} · {selectedGroup.members} members
                  </Text>
                  <Text style={styles.modalDescription}>
                    {`A group focused on ${selectedGroup.interests.join(
                      ', ',
                    )}. Join to connect with other students, ask questions, and study together.`}
                  </Text>

                  <View style={styles.modalButtonsRow}>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={closeModal}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    {isPending(selectedGroup.id) ? (
                      <TouchableOpacity
                        style={[styles.modalButton, styles.modalButtonPending]}
                        onPress={() => setShowCancelConfirm(true)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.modalButtonText, styles.modalButtonPendingText]}>
                          Pending...
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.modalButton, styles.modalButtonPrimary]}
                        onPress={() => handleRequestToJoin(selectedGroup.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>
                          Request to Join
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>

        <Modal
          visible={showCancelConfirm}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCancelConfirm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Cancel Request?</Text>
              <Text style={styles.modalDescription}>
                Are you sure you want to cancel your request to join {selectedGroup?.name}?
              </Text>

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowCancelConfirm(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonText}>No, Keep Request</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonDanger]}
                  onPress={() => handleCancelRequest(selectedGroup?.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonDangerText]}>
                    Yes, Cancel Request
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  searchIcon: {
    marginLeft: 8,
    padding: 6,
  },
  searchIconText: { fontSize: 20, color: colors.textSecondary },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 32 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardIconText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
  },
  cardBody: { flex: 1 },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  cardMeta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  cardInterests: {
    fontSize: 13,
    color: colors.placeholder,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  modalMeta: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textSecondary,
  },
  modalDescription: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: 10,
    backgroundColor: colors.white,
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modalButtonPending: {
    backgroundColor: colors.grayLight,
    borderColor: colors.border,
  },
  modalButtonDanger: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  modalButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  modalButtonPrimaryText: {
    color: colors.white,
  },
  modalButtonPendingText: {
    color: colors.textSecondary,
  },
  modalButtonDangerText: {
    color: colors.white,
  },
});
