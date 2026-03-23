import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import client from '../api/client';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/colors';
import { formatRelativeTime } from '../utils/helpers';
import type { Conversation, RootStackParamList } from '../types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const FILTERS = [
  { id: 'all', label: 'Всі' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'messenger', label: 'Messenger' },
  { id: 'active', label: 'Активні' },
  { id: 'today', label: 'Сьогодні' },
  { id: 'takeover', label: 'Перехвати' },
];

interface DialogsScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export default function DialogsScreen({ navigation }: DialogsScreenProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchConversations = useCallback(async (search?: string, filter?: string) => {
    try {
      const params: Record<string, string> = {};
      const f = filter ?? activeFilter;
      if (['whatsapp', 'instagram', 'messenger'].includes(f)) {
        params.channel = f;
      } else if (f !== 'all') {
        params.filter = f;
      }
      if (search) params.search = search;

      const response = await client.get('/conversations', { params });
      setConversations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    setLoading(true);
    fetchConversations(searchText, activeFilter);
  }, [activeFilter]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchConversations(text);
    }, 300);
  };

  const handleFilterPress = (filterId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveFilter(filterId);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations(searchText);
  };

  const openChat = (conv: Conversation) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Chat', {
      userId: conv.user_id,
      clientName: conv.client_name,
      channel: conv.channel,
    });
  };

  const renderDialog = ({ item, index }: { item: Conversation; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
      <TouchableOpacity style={styles.row} onPress={() => openChat(item)} activeOpacity={0.7}>
        <Avatar name={item.client_name} channel={item.channel} size={44} />
        <View style={styles.rowContent}>
          <View style={styles.rowHeader}>
            <Text style={styles.rowName} numberOfLines={1}>
              {item.client_name || item.client_phone || item.user_id}
            </Text>
            <Badge
              label={item.status === 'operator' ? 'Admin' : 'Міла'}
              type={item.status === 'operator' ? 'admin' : 'mila'}
            />
            <Text style={styles.rowTime}>{formatRelativeTime(item.last_message_at)}</Text>
          </View>
          <Text style={styles.rowPreview} numberOfLines={1}>
            {item.last_message_text || 'Немає повідомлень'}
          </Text>
        </View>
        {item.unread_count > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread_count}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={COLORS.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Пошук..."
          placeholderTextColor={COLORS.textTertiary}
          value={searchText}
          onChangeText={handleSearch}
          autoCorrect={false}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.id}
            onPress={() => handleFilterPress(f.id)}
            style={[styles.chip, activeFilter === f.id && styles.chipActive]}
          >
            <Text style={[styles.chipText, activeFilter === f.id && styles.chipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.coral} />
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>Немає діалогів</Text>
          <Text style={styles.emptySubtitle}>
            {searchText ? 'Нічого не знайдено' : 'Поки що немає повідомлень'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item, index) => `${item.user_id}-${item.channel}-${index}`}
          renderItem={renderDialog}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.coral} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.md,
  },
  filtersScroll: {
    maxHeight: 44,
  },
  filtersContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipActive: {
    backgroundColor: COLORS.coral,
    borderColor: COLORS.coral,
  },
  chipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight,
  },
  rowContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  rowName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  rowTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  rowPreview: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  unreadBadge: {
    backgroundColor: COLORS.coral,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: SPACING.sm,
  },
  unreadText: {
    ...TYPOGRAPHY.label,
    color: '#fff',
    fontWeight: '700',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
  },
});
