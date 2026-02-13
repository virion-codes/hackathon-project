import React, { useState, useEffect } from 'react';
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
import { MOCK_POSTS, getMessagesForGroup, getMembersForGroup, getPendingForGroup } from '../data/mockData';
import colors from '../theme/colors';

const CURRENT_USER = 'You';

export default function GroupChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { groupId, postId } = route.params || {};
  const { groups } = useGroups();
  const gid = groupId || '1';
  const group = groups.find((g) => g.id === gid);

  const [messages, setMessages] = useState(() =>
    getMessagesForGroup(gid).map((m) => ({ ...m, author: m.author }))
  );
  const [posts, setPosts] = useState(
    MOCK_POSTS.filter((p) => p.groupId === gid)
  );

  useEffect(() => {
    setMessages(getMessagesForGroup(gid).map((m) => ({ ...m, author: m.author })));
    setPosts(MOCK_POSTS.filter((p) => p.groupId === gid));
  }, [gid]);
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
  const [membersPopupVisible, setMembersPopupVisible] = useState(false);
  const [membersTab, setMembersTab] = useState('members'); // 'members' | 'pending'

  const groupMembers = getMembersForGroup(gid);
  const pendingRequests = getPendingForGroup(gid);

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
    const tabNav = navigation.getParent()?.getParent();
    if (tabNav) tabNav.navigate('AccountTab');
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
          <TouchableOpacity
            onPress={() => setSidebarVisible(!sidebarVisible)}
            style={styles.menuBtn}
          >
            <View style={[styles.menuLine, styles.menuLineShort]} />
            <View style={styles.menuLine} />
            <View style={[styles.menuLine, styles.menuLineShort]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerCenter}>
            <View style={[styles.groupAvatar, { backgroundColor: group?.color || colors.sidebar }]}>
              <Text style={styles.groupAvatarText}>{group?.icon || 'Y'}</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.groupName} numberOfLines={1}>{group?.name || 'Group'}</Text>
              <Text style={styles.groupMeta}>Tap to view channel</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.peopleBtn}
            onPress={() => setMembersPopupVisible(true)}
          >
            <Text style={styles.peopleIcon}>👥</Text>
            {(groupMembers.length > 0 || pendingRequests.length > 0) && (
              <View style={styles.peopleBadge}>
                <Text style={styles.peopleBadgeText}>{groupMembers.length + pendingRequests.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.feed}
          contentContainerStyle={styles.feedContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.messageRow,
                m.author === CURRENT_USER && styles.messageRowSelf,
              ]}
              onLongPress={() => onMessageLongPress(m)}
              activeOpacity={1}
              delayLongPress={400}
            >
              {m.author !== CURRENT_USER && (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{m.author.charAt(0)}</Text>
                </View>
              )}
              {m.author === CURRENT_USER && <View style={styles.avatarSpacer} />}
              <View style={[styles.messageBody, m.author === CURRENT_USER && styles.messageBodySelf]}>
                {m.author !== CURRENT_USER && (
                  <View style={styles.messageMeta}>
                    <Text style={styles.messageAuthor}>{m.author}</Text>
                    <Text style={styles.messageTime}>{m.time}</Text>
                  </View>
                )}
                <View style={[
                  styles.bubble,
                  m.author === CURRENT_USER && styles.bubbleSelf,
                  m.isSystem && styles.bubbleSystem,
                ]}>
                  <Text style={[
                    styles.bubbleText,
                    m.author === CURRENT_USER && styles.bubbleTextSelf,
                  ]}>{m.text}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          {posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postCardLeft} />
              <View style={styles.postCardBody}>
                <View style={styles.postHeader}>
                  <View style={[styles.postIcon, { backgroundColor: colors.primary }]}>
                    <Text style={styles.postIconText}>📍</Text>
                  </View>
                  <View style={styles.postHeaderText}>
                    <Text style={styles.postTitle}>{post.title || post.location}</Text>
                    <Text style={styles.postAuthor}>{post.author} · {post.createdAt || post.timeframe}</Text>
                  </View>
                </View>
                <Text style={styles.postLocation} numberOfLines={1}>{post.location}</Text>
                <Text style={styles.postExpectations} numberOfLines={2}>{post.expectations}</Text>
                <View style={styles.postActions}>
                  <TouchableOpacity
                    style={[styles.postActionBtn, joinedPostId === post.id && styles.postActionJoined]}
                    onPress={() => { if (post.id) setJoinedPostId(post.id); Alert.alert('Joined', "You're in! The host will see you've joined."); }}
                  >
                    <Text style={styles.postActionText}>{joinedPostId === post.id ? '✓ Joined' : 'Join'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.postActionBtnSecondary}
                    onPress={() => Alert.alert(post.title || post.location, [post.description && `Description: ${post.description}`, `Expectations: ${post.expectations}`, `When: ${post.timeframe}`, post.location && `Where: ${post.location}`].filter(Boolean).join('\n\n'))}
                  >
                    <Text style={styles.postActionTextSecondary}>Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postActionBtnSecondary} onPress={() => Alert.alert('Share', 'Link copied to clipboard! (Demo)')}>
                    <Text style={styles.postActionTextSecondary}>Share</Text>
                  </TouchableOpacity>
                  {post.author === CURRENT_USER && (
                    <>
                      <TouchableOpacity style={styles.postActionBtnSecondary} onPress={() => openPostModal(post)}>
                        <Text style={styles.postActionTextSecondary}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.postActionBtnDanger}
                        onPress={() => Alert.alert('Delete?', `Remove "${post.title || post.location}"?`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => setPosts((p) => p.filter((x) => x.id !== post.id)) }])}
                      >
                        <Text style={styles.postActionTextDanger}>Delete</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          style={styles.inputWrapper}
        >
          <View style={styles.inputSection}>
            {inputMode === 'chat' ? (
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder={`Message #${group?.name || 'general'}...`}
                  placeholderTextColor={colors.placeholder}
                  value={messageText}
                  onChangeText={setMessageText}
                  onSubmitEditing={handleSendMessage}
                  multiline
                  maxLength={2000}
                />
                <TouchableOpacity
                  style={[styles.sendBtn, !messageText.trim() && styles.sendBtnDisabled]}
                  onPress={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Text style={styles.sendBtnText}>Send</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.createPostBtn} onPress={() => openPostModal()}>
                <Text style={styles.createPostBtnText}>+ New Meetup Post</Text>
              </TouchableOpacity>
            )}
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
                  Post
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
              {editingPostId ? 'Edit CommonRoom Post' : 'New CommonRoom Post'}
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

      <Modal
        visible={membersPopupVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMembersPopupVisible(false)}
      >
        <View style={styles.membersModalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setMembersPopupVisible(false)}
          />
          <View style={styles.membersPopup}>
            <Text style={styles.membersPopupTitle}>Group Members</Text>
            <View style={styles.membersTabRow}>
              <TouchableOpacity
                style={[styles.membersTab, membersTab === 'members' && styles.membersTabActive]}
                onPress={() => setMembersTab('members')}
              >
                <Text style={[styles.membersTabText, membersTab === 'members' && styles.membersTabTextActive]}>
                  Members ({groupMembers.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.membersTab, membersTab === 'pending' && styles.membersTabActive]}
                onPress={() => setMembersTab('pending')}
              >
                <Text style={[styles.membersTabText, membersTab === 'pending' && styles.membersTabTextActive]}>
                  Pending ({pendingRequests.length})
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.membersList} showsVerticalScrollIndicator={false}>
              {membersTab === 'members' ? (
                groupMembers.map((m) => (
                  <View key={m.id} style={styles.memberRow}>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.memberAvatarText}>{m.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{m.name}</Text>
                      <Text style={styles.memberMeta}>{m.role} · Joined {m.joinedAt}</Text>
                    </View>
                  </View>
                ))
              ) : (
                pendingRequests.length === 0 ? (
                  <Text style={styles.membersEmpty}>No pending requests</Text>
                ) : (
                  pendingRequests.map((p) => (
                    <View key={p.id} style={styles.memberRow}>
                      <View style={styles.memberAvatar}>
                        <Text style={styles.memberAvatarText}>{p.name.charAt(0)}</Text>
                      </View>
                      <View style={styles.memberInfo}>
                        <Text style={styles.memberName}>{p.name}</Text>
                        <Text style={styles.memberMeta}>Requested {p.requestedAt}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.approveBtn}
                        onPress={() => Alert.alert('Approved', `${p.name} has been added to the group.`)}
                      >
                        <Text style={styles.approveBtnText}>Approve</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )
              )}
            </ScrollView>
          </View>
        </View>
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
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderStrong,
  },
  menuBtn: { padding: 10, marginRight: 4 },
  menuLine: {
    width: 18,
    height: 2,
    backgroundColor: colors.text,
    marginVertical: 2,
    borderRadius: 1,
  },
  menuLineShort: { width: 12 },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  peopleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  peopleIcon: { fontSize: 22 },
  peopleBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  peopleBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  groupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  groupAvatarText: { color: colors.white, fontSize: 18, fontWeight: '700' },
  headerText: { flex: 1 },
  groupName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  groupMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  feed: { flex: 1, backgroundColor: colors.background },
  feedContent: { padding: 16, paddingBottom: 20 },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  messageRowSelf: { flexDirection: 'row-reverse' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.sidebarLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarSpacer: { width: 36, marginLeft: 10 },
  avatarText: { fontSize: 14, fontWeight: '700', color: colors.white },
  messageBody: { flex: 1, maxWidth: '80%', minWidth: 0 },
  messageBodySelf: { alignItems: 'flex-end' },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
    gap: 8,
  },
  messageAuthor: { fontSize: 14, fontWeight: '700', color: colors.primary },
  messageTime: { fontSize: 11, color: colors.textSecondary },
  bubble: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  bubbleSelf: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 4,
  },
  bubbleSystem: {
    backgroundColor: colors.primary + '18',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  bubbleText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  bubbleTextSelf: { color: colors.white },
  postCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginVertical: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  postCardLeft: {
    width: 4,
    backgroundColor: colors.primary,
  },
  postCardBody: { flex: 1, padding: 14 },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  postIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  postIconText: { fontSize: 14 },
  postHeaderText: { flex: 1, minWidth: 0 },
  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  postAuthor: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  postLocation: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 6,
  },
  postExpectations: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  postActionBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  postActionJoined: { backgroundColor: colors.success },
  postActionBtnSecondary: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  postActionBtnDanger: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  postActionText: { color: colors.white, fontSize: 13, fontWeight: '600' },
  postActionTextSecondary: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  postActionTextDanger: { color: colors.error, fontSize: 13, fontWeight: '600' },
  inputWrapper: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderStrong,
  },
  inputSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
  },
  inputModeRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  modeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  modeBtnText: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
  modeBtnTextActive: { color: colors.white },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 12,
    fontSize: 15,
    color: colors.text,
    marginRight: 10,
    maxHeight: 100,
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
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
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  modalInput: {
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
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
  membersModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  membersPopup: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '70%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  membersPopupTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  membersTabRow: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 10,
    padding: 4,
  },
  membersTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  membersTabActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  membersTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  membersTabTextActive: {
    color: colors.text,
  },
  membersList: {
    maxHeight: 280,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.sidebarLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  memberInfo: { flex: 1 },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  memberMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  membersEmpty: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 24,
  },
  approveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  approveBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
});
