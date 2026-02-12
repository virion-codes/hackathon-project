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
} from 'react-native';
import colors from '../theme/colors';
import { useGroups } from '../context/GroupsContext';

export default function GroupSidebar({ currentGroupId, onSelectGroup, onProfile, onGroupDeleted }) {
  const { groups, addGroup, updateGroup, deleteGroup } = useGroups();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editName, setEditName] = useState('');

  const handleCreateGroup = () => {
    const group = addGroup(newGroupName);
    setNewGroupName('');
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
      {groups.map((group) => (
        <TouchableOpacity
          key={group.id}
          style={[
            styles.groupCircle,
            { backgroundColor: group.color },
            currentGroupId === group.id && styles.groupCircleActive,
          ]}
          onPress={() => onSelectGroup(group)}
          onLongPress={() => onGroupLongPress(group)}
        >
          <Text style={styles.groupLetter}>{group.icon}</Text>
        </TouchableOpacity>
      ))}
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
            <Text style={styles.label}>Group name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Chem 105 Study"
              placeholderTextColor={colors.placeholder}
              value={newGroupName}
              onChangeText={setNewGroupName}
              autoFocus
            />
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
  createGroupBtn: {
    position: 'absolute',
    bottom: 24,
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createGroupIcon: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
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
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
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
