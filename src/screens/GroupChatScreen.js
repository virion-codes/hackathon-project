import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import GroupSidebar from '../components/GroupSidebar';
import { useGroups } from '../context/GroupsContext';
import { MOCK_POSTS, MOCK_MESSAGES } from '../data/mockData';
import colors from '../theme/colors';

const CURRENT_USER = 'You';

export default function GroupChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { groupId, postId } = route.params || {};
  const { groups } = useGroups();
  const gid = groupId || '1';
  const group = groups.find((g) => g.id === gid);

  const [messages, setMessages] = useState(
    MOCK_MESSAGES.map((m) => ({ ...m, author: m.author }))
  );
  const [posts, setPosts] = useState(
    MOCK_POSTS.filter((p) => p.groupId === gid)
  );
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const [inputMode, setInputMode] = useState('chat');
  const [messageText, setMessageText] = useState('');
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postExpectations, setPostExpectations] = useState('');
  const [joinedPostId, setJoinedPostId] = useState(null);
  const [editMessageModalVisible, setEditMessageModalVisible] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState('');

  const featuredPostId = postId || (posts[0]?.id);
  const featuredPost = posts.find((p) => p.id === featuredPostId) || posts[0];

  const handleSendMessage = () => {
    const trimmed = messageText.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), author: CURRENT_USER, text: trimmed, time: 'Now' },
    ]);
    setMessageText('');
  };

  const openPostModal = (post = null) => {
    if (post) {
      setEditingPostId(post.id);
      setPostTitle(post.title || '');
      setPostDescription(post.description || post.location || '');
      setPostExpectations(post.expectations || '');
    } else {
      setEditingPostId(null);
      setPostTitle('');
      setPostDescription('');
      setPostExpectations('');
    }
    setPostModalVisible(true);
  };

  const handleSavePost = () => {
    const title = postTitle.trim();
    const description = postDescription.trim();
    const expectations = postExpectations.trim();
    if (!title) {
      Alert.alert('Missing title', 'Please enter a title for your study spot.');
      return;
    }
    if (editingPostId) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editingPostId
            ? {
                ...p,
                title,
                location: description || p.location,
                description,
                expectations: expectations || p.expectations,
              }
            : p
        )
      );
      setPostModalVisible(false);
      setEditingPostId(null);
      Alert.alert('Post updated', 'Your study spot post was updated.');
    } else {
      const newPost = {
        id: String(Date.now()),
        groupId: gid,
        author: CURRENT_USER,
        title,
        location: description || 'Location TBD',
        description,
        expectations: expectations || 'No specific expectations.',
        timeframe: 'Time TBD',
        createdAt: 'Just now',
      };
      setPosts((prev) => [newPost, ...prev]);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          author: CURRENT_USER,
          text: `Created a study spot: "${title}"`,
          time: 'Now',
          isSystem: true,
        },
      ]);
      setPostModalVisible(false);
      setInputMode('chat');
      Alert.alert('Study spot created', 'Your study spot post is now visible in the group.');
    }
  };

  const handleDeletePost = () => {
    if (!featuredPost) return;
    Alert.alert(
      'Delete study spot?',
      `Remove "${featuredPost.title || featuredPost.location}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPosts((prev) => prev.filter((p) => p.id !== featuredPost.id));
            Alert.alert('Deleted', 'Study spot post was removed.');
          },
        },
      ]
    );
  };

  const onMessageLongPress = (m) => {
    if (m.author !== CURRENT_USER) return;
    Alert.alert('Message', 'Edit or delete this message?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Edit', onPress: () => {
        setEditingMessageId(m.id);
        setEditMessageText(m.text);
        setEditMessageModalVisible(true);
      }},
      { text: 'Delete', style: 'destructive', onPress: () => {
        setMessages((prev) => prev.filter((msg) => msg.id !== m.id));
        Alert.alert('Deleted', 'Message removed.');
      }},
    ]);
  };

  const handleSaveMessageEdit = () => {
    const trimmed = editMessageText.trim();
    if (!trimmed || !editingMessageId) return;
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === editingMessageId ? { ...msg, text: trimmed } : msg
      )
    );
    setEditMessageModalVisible(false);
    setEditingMessageId(null);
    setEditMessageText('');
  };

  const handleJoin = () => {
    if (featuredPostId) setJoinedPostId(featuredPostId);
    Alert.alert('Joined', "You're in! The host will see you've joined.");
  };

  const handleDetails = () => {
    if (!featuredPost) return;
    Alert.alert(
      featuredPost.title || featuredPost.location,
      [
        featuredPost.description && `Description: ${featuredPost.description}`,
        `Expectations: ${featuredPost.expectations}`,
        `When: ${featuredPost.timeframe}`,
        featuredPost.location && `Where: ${featuredPost.location}`,
      ]
        .filter(Boolean)
        .join('\n\n')
    );
  };

  const handleShare = () => {
    Alert.alert('Share', 'Study spot link copied to clipboard! (Demo)');
  };

  const goToAccount = () => {
    const parent = navigation.getParent();
    if (parent) parent.navigate('Tabs', { screen: 'AccountTab' });
    else navigation.navigate('AccountTab');
  };

  return (
    <View style={styles.container}>
      {sidebarVisible && (
        <GroupSidebar
          currentGroupId={gid}
          onSelectGroup={(g) => navigation.setParams({ groupId: g.id })}
          onProfile={goToAccount}
          onGroupDeleted={() => navigation.goBack()}
        />
      )}
      <View style={styles.main}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={[styles.groupIcon, { backgroundColor: group?.color || colors.sidebar }]}>
            <Text style={styles.groupIconText}>{group?.icon || 'Y'}</Text>
          </View>
          <TouchableOpacity style={styles.groupBadge}>
            <Text style={styles.groupBadgeText}>{group?.name || 'BYU'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.feed} contentContainerStyle={styles.feedContent}>
          {messages.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={styles.messageRow}
              onLongPress={() => onMessageLongPress(m)}
              activeOpacity={1}
              delayLongPress={400}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{m.author.charAt(0)}</Text>
              </View>
              <View style={[styles.bubble, m.isSystem && styles.bubbleSystem]}>
                <Text style={styles.bubbleText}>{m.text}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {featuredPost && (
            <View style={styles.postCard}>
              <View style={styles.postMedia}>
                <Text style={styles.postTitle}>{featuredPost.title || featuredPost.location}</Text>
                <View style={styles.mapPlaceholder} />
                <View style={styles.postMeta}>
                  <Text style={styles.postLabel}>Location</Text>
                  <Text style={styles.postValue}>{featuredPost.location}</Text>
                </View>
                <View style={styles.postMeta}>
                  <Text style={styles.postLabel}>Expectations</Text>
                  <Text style={styles.postValue}>{featuredPost.expectations}</Text>
                </View>
                <View style={[styles.postMeta, styles.timeframeBox]}>
                  <Text style={styles.postLabel}>Timeframe</Text>
                  <Text style={styles.postValue}>{featuredPost.timeframe}</Text>
                </View>
              </View>
              <View style={styles.tags}>
                <TouchableOpacity
                  style={[styles.tag, joinedPostId === featuredPost.id && styles.tagJoined]}
                  onPress={handleJoin}
                >
                  <Text style={styles.tagText}>{joinedPostId === featuredPost.id ? 'Joined' : 'Join'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tag} onPress={handleDetails}>
                  <Text style={styles.tagText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tag} onPress={handleShare}>
                  <Text style={styles.tagText}>Share</Text>
                </TouchableOpacity>
                {featuredPost.author === CURRENT_USER && (
                  <>
                    <TouchableOpacity style={styles.tagEdit} onPress={() => openPostModal(featuredPost)}>
                      <Text style={styles.tagText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tagDelete} onPress={handleDeletePost}>
                      <Text style={styles.tagText}>Delete</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputSection}>
          <View style={styles.inputModeRow}>
            <TouchableOpacity
              style={[styles.modeBtn, inputMode === 'chat' && styles.modeBtnActive]}
              onPress={() => setInputMode('chat')}
            >
              <Text style={[styles.modeBtnText, inputMode === 'chat' && styles.modeBtnTextActive]}>
                Chat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, inputMode === 'post' && styles.modeBtnActive]}
              onPress={() => setInputMode('post')}
            >
              <Text style={[styles.modeBtnText, inputMode === 'post' && styles.modeBtnTextActive]}>
                Study Spot Post
              </Text>
            </TouchableOpacity>
          </View>
          {inputMode === 'chat' ? (
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Message..."
                placeholderTextColor={colors.placeholder}
                value={messageText}
                onChangeText={setMessageText}
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
                <Text style={styles.sendBtnText}>Send</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.createPostBtn} onPress={() => openPostModal()}>
              <Text style={styles.createPostBtnText}>Create Study Spot Post</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Modal
        visible={postModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPostModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingPostId ? 'Edit Study Spot Post' : 'New Study Spot Post'}
            </Text>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Library 3rd floor study session"
              placeholderTextColor={colors.placeholder}
              value={postTitle}
              onChangeText={setPostTitle}
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.modalInput, styles.modalInputMultiline]}
              placeholder="Where and what (location, room, etc.)"
              placeholderTextColor={colors.placeholder}
              value={postDescription}
              onChangeText={setPostDescription}
              multiline
            />
            <Text style={styles.label}>Expectations for the meeting</Text>
            <TextInput
              style={[styles.modalInput, styles.modalInputMultiline]}
              placeholder="e.g. Quiet study, bring laptop, we're covering Ch. 5"
              placeholderTextColor={colors.placeholder}
              value={postExpectations}
              onChangeText={setPostExpectations}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setPostModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalPostBtn} onPress={handleSavePost}>
                <Text style={styles.modalPostText}>{editingPostId ? 'Save' : 'Post'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={editMessageModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditMessageModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit message</Text>
            <TextInput
              style={[styles.modalInput, styles.modalInputMultiline]}
              placeholder="Message..."
              placeholderTextColor={colors.placeholder}
              value={editMessageText}
              onChangeText={setEditMessageText}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => {
                  setEditMessageModalVisible(false);
                  setEditingMessageId(null);
                  setEditMessageText('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalPostBtn} onPress={handleSaveMessageEdit}>
                <Text style={styles.modalPostText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 8, marginRight: 4 },
  backArrow: { fontSize: 24, color: colors.text },
  groupIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  groupIconText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  groupBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  groupBadgeText: { color: colors.white, fontWeight: '600', fontSize: 14 },
  feed: { flex: 1 },
  feedContent: { padding: 12, paddingBottom: 24 },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  bubble: {
    maxWidth: '75%',
    backgroundColor: colors.grayLight,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleSystem: { backgroundColor: colors.primary + '20' },
  bubbleText: { fontSize: 14, color: colors.text },
  postCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginVertical: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  postMedia: { padding: 14 },
  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  mapPlaceholder: {
    height: 120,
    backgroundColor: colors.grayLight,
    borderRadius: 10,
    marginBottom: 12,
  },
  postMeta: { marginBottom: 10 },
  postLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  postValue: { fontSize: 14, color: colors.text },
  timeframeBox: {
    backgroundColor: colors.grayLight,
    padding: 10,
    borderRadius: 8,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  tag: {
    backgroundColor: colors.purple,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    opacity: 0.9,
  },
  tagJoined: { backgroundColor: colors.success, opacity: 1 },
  tagEdit: { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  tagDelete: { backgroundColor: '#c53030', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, opacity: 0.9 },
  tagText: { color: colors.white, fontSize: 13, fontWeight: '600' },
  inputSection: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputModeRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
  },
  modeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.grayLight,
  },
  modeBtnActive: { backgroundColor: colors.primary },
  modeBtnText: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  modeBtnTextActive: { color: colors.white },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.grayLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendBtnText: { color: colors.white, fontWeight: '600', fontSize: 14 },
  createPostBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  createPostBtnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
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
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    marginBottom: 14,
  },
  modalInputMultiline: { minHeight: 72, textAlignVertical: 'top' },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalCancelText: { color: colors.textSecondary, fontWeight: '600' },
  modalPostBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  modalPostText: { color: colors.white, fontWeight: '600' },
});
