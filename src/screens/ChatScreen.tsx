import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import client from '../api/client';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/colors';
import type { Message, RootStackParamList } from '../types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

function FadeInView({ children }: { children: React.ReactNode }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 200, useNativeDriver: true,
    }).start();
  }, []);
  return <Animated.View style={{ opacity: fadeAnim }}>{children}</Animated.View>;
}

export default function ChatScreen({ route, navigation }: Props) {
  const { userId, clientName, channel } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [botActive, setBotActive] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const [msgRes, convRes] = await Promise.all([
        client.get(`/conversations/${userId}/messages`),
        client.get(`/conversations/${userId}`),
      ]);
      setMessages(Array.isArray(msgRes.data) ? msgRes.data : []);
      setBotActive(convRes.data.status === 'bot');
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View>
          <Text style={styles.headerName} numberOfLines={1}>
            {clientName || userId}
          </Text>
          <Text style={styles.headerChannel}>{channel}</Text>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={handleTakeover}
          style={[styles.takeoverBtn, { backgroundColor: botActive ? COLORS.coralLight : COLORS.purpleLight }]}
        >
          <Text style={[styles.takeoverText, { color: botActive ? COLORS.coral : COLORS.purple }]}>
            {botActive ? 'Зупинити бота' : 'Повернути Мілі'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [botActive, clientName]);

  const handleTakeover = async () => {
    const endpoint = botActive
      ? `/conversations/${userId}/takeover`
      : `/conversations/${userId}/release`;

    if (botActive) {
      Alert.alert(
        'Зупинити бота?',
        'Міла зараз відповідає цьому клієнту. Зупинити щоб написати самому?',
        [
          { text: 'Скасувати', style: 'cancel' },
          {
            text: 'Зупинити',
            style: 'destructive',
            onPress: async () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              try {
                await client.post(endpoint);
                setBotActive(false);
              } catch (e) {
                Alert.alert('Помилка', 'Не вдалося перехопити діалог');
              }
            },
          },
        ]
      );
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      try {
        await client.post(endpoint);
        setBotActive(true);
      } catch (e) {
        Alert.alert('Помилка', 'Не вдалося повернути бота');
      }
    }
  };

  const handleInputFocus = () => {
    if (botActive) {
      Alert.alert(
        'Зупинити бота?',
        'Міла зараз відповідає. Зупинити щоб написати самому?',
        [
          { text: 'Скасувати', style: 'cancel' },
          {
            text: 'Зупинити',
            style: 'destructive',
            onPress: async () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              try {
                await client.post(`/conversations/${userId}/takeover`);
                setBotActive(false);
              } catch (e) {
                Alert.alert('Помилка', 'Не вдалося перехопити діалог');
              }
            },
          },
        ]
      );
    }
  };

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      const res = await client.post(`/conversations/${userId}/messages`, {
        message: trimmed,
      });
      if (res.data.message) {
        setMessages(prev => [...prev, res.data.message]);
      }
      setText('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error: any) {
      if (error.response?.status === 403) {
        Alert.alert('Помилка', 'Спершу потрібно перехопити діалог');
      } else {
        Alert.alert('Помилка', 'Не вдалося відправити повідомлення');
      }
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isClient = item.direction === 'inbound';
    const isBot = item.sender_type === 'bot';
    const isOperator = item.sender_type === 'operator';

    let bubbleColor = '#E8E8E8';
    if (isBot) bubbleColor = COLORS.purpleLight;
    else if (isOperator) bubbleColor = COLORS.coralLight;

    const align = isClient ? 'flex-start' : 'flex-end';
    const textColor = COLORS.textPrimary;

    const time = new Date(item.created_at).toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <FadeInView>
        <View style={[styles.bubbleRow, { justifyContent: align }]}>
          <View style={[styles.bubble, { backgroundColor: bubbleColor }]}>
            {!isClient && (
              <Text style={styles.senderLabel}>
                {isBot ? 'Міла' : 'Admin'}
              </Text>
            )}
            <Text style={[styles.messageText, { color: textColor }]}>
              {item.message_text}
            </Text>
            <Text style={styles.messageTime}>{time}</Text>
          </View>
        </View>
      </FadeInView>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.coral} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Немає повідомлень</Text>
          </View>
        }
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder={botActive ? 'Зупиніть бота для відправки...' : 'Написати повідомлення...'}
          placeholderTextColor={COLORS.textTertiary}
          value={text}
          onChangeText={setText}
          onFocus={handleInputFocus}
          multiline
          maxLength={2000}
          editable={!botActive}
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={!text.trim() || sending || botActive}
          style={[styles.sendBtn, (!text.trim() || botActive) && styles.sendBtnDisabled]}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  messageList: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexGrow: 1,
  },
  bubbleRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  senderLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  messageText: {
    ...TYPOGRAPHY.body,
  },
  messageTime: {
    ...TYPOGRAPHY.label,
    color: COLORS.textTertiary,
    alignSelf: 'flex-end',
    marginTop: SPACING.xs,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.textDisabled,
  },
  emptyText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
  },
  headerName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  headerChannel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
  takeoverBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 16,
  },
  takeoverText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
});
