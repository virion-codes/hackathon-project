import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import colors from '../theme/colors';
import { useGroups } from '../context/GroupsContext';

export default function GroupSidebar({ currentGroupId, onSelectGroup, onProfile, onGroupDeleted }) {
  const { groups, addGroup, updateGroup, deleteGroup } = useGroups();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupInviteCode, setNewGroupInviteCode] = useState('');
  const [newGroupPrivacy, setNewGroupPrivacy] = useState('public');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editName, setEditName] = useState('');

  const handleCreateGroup = () => {
    const group = addGroup(newGroupName);
    setNewGroupName('');
    setNewGroupDesc('');
    setNewGroupInviteCode('');
    setNewGroupPrivacy('public');
    setCreateModalVisible(false);
    if (group) {
      Alert.alert('Group created', `"${group.name}" is ready. Tap it to open.`);
      onSelectGroup(group);
    }
  };

  const openEditGroup = (group) => {
    setEditingGroup(group);
    setEditName(group.name);
    setEditModalVisible(true);
  };

  const handleUpdateGroup = () => {
    if (!editingGroup) return;
    const name = editName.trim();
    if (!name) return;
    updateGroup(editingGroup.id, { name });
    setEditModalVisible(false);
    setEditingGroup(null);
    setEditName('');
    Alert.alert('Group updated', `Renamed to "${name}".`);
  };

  const handleLeaveGroup = (group) => {
    Alert.alert(
      'Leave group?',
      `Leave "${group.name}"? You can rejoin later from Discovery.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            const id = group.id;
            deleteGroup(id);
            if (id === currentGroupId && onGroupDeleted) onGroupDeleted(id);
            Alert.alert('Left group', `You left "${group.name}".`);
          },
        },
      ]
    );
  };

  const onGroupLongPress = (group) => {
    Alert.alert(group.name, 'What do you want to do?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Edit group name', onPress: () => openEditGroup(group) },
      { text: 'Leave group', style: 'destructive', onPress: () => handleLeaveGroup(group) },
    ]);
  };

  return (
    <View style={styles.sidebar}>
      <TouchableOpacity style={styles.profileCircle} onPress={onProfile}>
        <Text style={styles.profileLetter}>U</Text>
      </TouchableOpacity>
      <ScrollView
        style={styles.groupsScroll}
        contentContainerStyle={styles.groupsScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {groups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={[
              styles.groupRow,
              currentGroupId === group.id && styles.groupRowActive,
            ]}
            onPress={() => onSelectGroup(group)}
            onLongPress={() => onGroupLongPress(group)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.groupCircle,
                { backgroundColor: group.color },
                currentGroupId === group.id && styles.groupCircleActive,
              ]}
            >
              <Text style={styles.groupLetter}>{group.icon}</Text>
            </View>
            <Text style={styles.groupName} numberOfLines={1} ellipsizeMode="tail">
              {group.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.createGroupBtn}
        onPress={() => setCreateModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.createGroupIcon}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create your own group</Text>
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Group name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Chem 105 Study"
                placeholderTextColor={colors.placeholder}
                value={newGroupName}
                onChangeText={setNewGroupName}
                autoFocus
              />
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="What's this group about?"
                placeholderTextColor={colors.placeholder}
                value={newGroupDesc}
                onChangeText={setNewGroupDesc}
                multiline
              />
              <Text style={styles.label}>Invite code (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. CHEM105-2024"
                placeholderTextColor={colors.placeholder}
                value={newGroupInviteCode}
                onChangeText={setNewGroupInviteCode}
              />
              <Text style={styles.label}>Privacy</Text>
              <View style={styles.privacyRow}>
                <TouchableOpacity
                  style={[styles.privacyOption, newGroupPrivacy === 'public' && styles.privacyOptionActive]}
                  onPress={() => setNewGroupPrivacy('public')}
                >
                  <Text style={[styles.privacyText, newGroupPrivacy === 'public' && styles.privacyTextActive]}>Public</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.privacyOption, newGroupPrivacy === 'private' && styles.privacyOptionActive]}
                  onPress={() => setNewGroupPrivacy('private')}
                >
                  <Text style={[styles.privacyText, newGroupPrivacy === 'private' && styles.privacyTextActive]}>Private</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setNewGroupName('');
                  setCreateModalVisible(false);
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createBtn}
                onPress={handleCreateGroup}
              >
                <Text style={styles.createBtnText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit group name</Text>
            <Text style={styles.label}>Group name</Text>
            <TextInput
              style={styles.input}
              placeholder="Group name"
              placeholderTextColor={colors.placeholder}
              value={editName}
              onChangeText={setEditName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setEditModalVisible(false);
                  setEditingGroup(null);
                  setEditName('');
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createBtn} onPress={handleUpdateGroup}>
                <Text style={styles.createBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 200,
    backgroundColor: colors.sidebar,
    paddingTop: 48,
    paddingBottom: 24,
  },
  profileCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.sidebarLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginHorizontal: 12,
    borderWidth: 2,
    borderColor: colors.sidebar,
  },
  profileLetter: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  groupsScroll: {
    flex: 1,
    marginBottom: 8,
  },
  groupsScrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 4,
    borderRadius: 10,
  },
  groupRowActive: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  groupCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  groupLetter: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  groupCircleActive: {
    borderRadius: 10,
  },
  groupName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    opacity: 0.95,
  },
  createGroupBtn: {
    position: 'absolute',
    bottom: 24,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.sidebarLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createGroupIcon: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 26,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 320,
    maxHeight: '80%',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  modalScroll: {
    maxHeight: 320,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    marginBottom: 14,
  },
  inputMultiline: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  privacyRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  privacyOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
  },
  privacyOptionActive: {
    backgroundColor: colors.primary,
  },
  privacyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  privacyTextActive: {
    color: colors.white,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  createBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  createBtnText: {
    color: colors.white,
    fontWeight: '600',
  },
});
