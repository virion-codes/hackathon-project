import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GroupSidebar from '../components/GroupSidebar';
import { MOCK_POSTS } from '../data/mockData';
import colors from '../theme/colors';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const goToGroupChat = (groupId, postId) => {
    const parent = navigation.getParent();
    (parent || navigation).navigate('GroupChat', { groupId, postId });
  };
  const renderPostPreview = ({ item }) => (
    <TouchableOpacity
      style={styles.postPreview}
      onPress={() => goToGroupChat(item.groupId, item.id)}
      activeOpacity={0.7}
    >
      <Text style={styles.postPreviewTitle} numberOfLines={1}>
        {item.location}
      </Text>
      <Text style={styles.postPreviewMeta} numberOfLines={1}>
        {item.timeframe} · {item.author}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {sidebarVisible && (
        <GroupSidebar
          currentGroupId={null}
          onSelectGroup={(g) => {
        const parent = navigation.getParent();
        (parent || navigation).navigate('GroupChat', { groupId: g.id });
      }}
          onProfile={() => navigation.getParent()?.getParent()?.navigate('AccountTab')}
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
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Recent Messages</Text>
          </View>
        </View>
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {MOCK_POSTS.map((item) => (
            <View key={item.id}>
              {renderPostPreview({ item })}
            </View>
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
  main: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderStrong,
  },
  menuBtn: {
    padding: 8,
    marginRight: 8,
  },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: colors.text,
    marginVertical: 2,
    borderRadius: 1,
  },
  menuLineShort: {
    width: 14,
  },
  headerTitleWrap: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  postPreview: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  postPreviewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  postPreviewMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
  },
});
