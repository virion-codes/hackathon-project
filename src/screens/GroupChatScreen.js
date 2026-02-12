import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import GroupSidebar from '../components/GroupSidebar';
import { MOCK_GROUPS, MOCK_POSTS, MOCK_MESSAGES } from '../data/mockData';
import colors from '../theme/colors';

export default function GroupChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { groupId, postId } = route.params || {};
  const group = MOCK_GROUPS.find((g) => g.id === (groupId || '1'));
  const posts = MOCK_POSTS.filter((p) => p.groupId === (groupId || '1'));
  const featuredPost = postId
    ? posts.find((p) => p.id === postId) || posts[0]
    : posts[0];
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <View style={styles.container}>
      {sidebarVisible && (
        <GroupSidebar
          currentGroupId={groupId || '1'}
          onSelectGroup={(g) => navigation.setParams({ groupId: g.id })}
          onProfile={() => navigation.navigate('Account')}
        />
      )}
      <View style={styles.main}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
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
          {MOCK_MESSAGES.map((m) => (
            <View key={m.id} style={styles.messageRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{m.author.charAt(0)}</Text>
              </View>
              <View style={styles.bubble}>
                <Text style={styles.bubbleText}>{m.text}</Text>
              </View>
            </View>
          ))}
          {featuredPost && (
            <View style={styles.postCard}>
              <View style={styles.postMedia}>
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
            </View>
          )}
          {MOCK_MESSAGES.slice(0, 1).map((m) => (
            <View key={`bottom-${m.id}`} style={styles.messageRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{m.author.charAt(0)}</Text>
              </View>
              <View style={styles.bubble}>
                <Text style={styles.bubbleText}>Sounds good, see you there!</Text>
              </View>
            </View>
          ))}
          <View style={styles.tags}>
            <TouchableOpacity style={styles.tag}><Text style={styles.tagText}>Join</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tag}><Text style={styles.tagText}>Details</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tag}><Text style={styles.tagText}>Share</Text></TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor={colors.placeholder}
          />
          <TouchableOpacity style={styles.sendBtn}>
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        </View>
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
  },
  tag: {
    backgroundColor: colors.purple,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    opacity: 0.9,
  },
  tagText: { color: colors.white, fontSize: 13, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
});
