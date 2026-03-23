---
name: expo-react-native
description: Expert guide for building beautiful, production-grade Expo/React Native apps. Use when creating mobile screens, components, navigation, API integration, animations, or any React Native code. Triggers on: "create screen", "mobile app", "React Native", "Expo", "iOS app", "component", "navigation", "animation", "FlatList", "StyleSheet", or any mobile UI task.
---

# Expo + React Native — Production Stack 2026

## Stack (SDK 54, що є в проекті)

```
Styling:     NativeWind v4 (Tailwind) або StyleSheet
Components:  Gluestack UI v3 (копіюй компоненти) або власні
Navigation:  React Navigation v7 + Bottom Tabs
State:       Zustand (UI state) + TanStack Query (server state)
Storage:     expo-secure-store (токени) + MMKV (кеш)
Lists:       FlashList замість FlatList (5-10x швидше)
Animation:   Reanimated 3 (worklets на UI thread)
API:         Axios з interceptors для JWT refresh
Images:      expo-image (кешування + BlurHash)
```

## Структура проекту

```
/src
  /screens          ← екрани (щільна логіка)
  /components       ← переиспользуємі компоненти
    /ui             ← базові (Button, Card, Badge)
    /schedule       ← специфічні для розкладу
    /dialogs        ← специфічні для чатів
  /navigation       ← навігація
  /api              ← axios instance + endpoints
  /stores           ← zustand stores
  /hooks            ← useSchedule, useDialogs etc
  /utils            ← форматування, константи
  /types            ← TypeScript типи
```

## Правила коду

### StyleSheet — завжди внизу файлу
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Ніколи не inline styles для performance
});
```

### Colors — завжди з константи
```typescript
// src/utils/colors.ts
export const COLORS = {
  // JOL Beauty Brand
  coral: '#E05A3A',
  coralLight: '#F5EAE6',
  purple: '#7B52AB',
  purpleLight: '#EEE8F5',
  // Neutrals
  background: '#FAFAF8',
  surface: '#FFFFFF',
  border: '#E8E5E0',
  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  // Status
  success: '#48BB78',
  warning: '#EAB308',
  danger: '#E24B4A',
  // Channels
  whatsapp: '#25D366',
  instagram: '#E1306C',
  messenger: '#0084FF',
};
```

### Typography — фіксована шкала
```typescript
export const TYPOGRAPHY = {
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  label: { fontSize: 11, fontWeight: '500' as const, lineHeight: 14 },
};
```

### Spacing — 4px grid
```typescript
export const SPACING = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
};
```

## Компоненти

### Card — базовий
```typescript
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING } from '../utils/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export const Card = ({ children, style, padding = SPACING.lg }: CardProps) => (
  <View style={[styles.card, { padding }, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
});
```

### TouchableCard — з ripple ефектом
```typescript
import { TouchableOpacity } from 'react-native';

export const TouchableCard = ({ onPress, children, style }: TouchableCardProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[styles.card, style]}
  >
    {children}
  </TouchableOpacity>
);
```

### Badge — статус
```typescript
export const Badge = ({ label, type = 'default' }: BadgeProps) => {
  const colors = {
    default: { bg: COLORS.border, text: COLORS.textSecondary },
    new: { bg: '#E8F5E9', text: '#2E7D32' },
    vip: { bg: COLORS.purpleLight, text: COLORS.purple },
    admin: { bg: COLORS.coralLight, text: COLORS.coral },
    mila: { bg: COLORS.purpleLight, text: COLORS.purple },
    whatsapp: { bg: '#E8F5E9', text: '#1B5E20' },
    instagram: { bg: '#FCE4EC', text: '#AD1457' },
  };
  const { bg, text } = colors[type] || colors.default;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
};
```

### Avatar — з ініціалами
```typescript
export const Avatar = ({ name, source, channel, size = 44 }: AvatarProps) => {
  const channelColors = {
    whatsapp: COLORS.whatsapp,
    instagram: COLORS.instagram,
    messenger: COLORS.messenger,
  };
  const bgColor = channel 
    ? channelColors[channel] 
    : name ? COLORS.purple : COLORS.coral;
  
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : null;

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size/2, backgroundColor: bgColor }]}>
      {initials ? (
        <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
      ) : (
        <ChannelIcon channel={channel} size={size * 0.5} />
      )}
    </View>
  );
};
```

## FlashList замість FlatList

```typescript
import { FlashList } from '@shopify/flash-list';

// ЗАВЖДИ використовуй FlashList для списків > 10 елементів
<FlashList
  data={visits}
  renderItem={({ item }) => <VisitCard visit={item} />}
  estimatedItemSize={80}  // ОБОВ'ЯЗКОВО вказувати!
  keyExtractor={(item) => String(item.id)}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ padding: SPACING.lg }}
/>
```

## Анімації з Reanimated 3

```typescript
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSpring, interpolate,
  FadeIn, FadeOut, SlideInRight,
} from 'react-native-reanimated';

// Fade in при mount
<Animated.View entering={FadeIn.duration(300)}>
  <VisitCard />
</Animated.View>

// Press animation
const scale = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));
const handlePressIn = () => { scale.value = withSpring(0.96); };
const handlePressOut = () => { scale.value = withSpring(1); };
```

## API Client

```typescript
// src/api/client.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const api = axios.create({
  baseURL: 'https://prod2.maxintelli.net:8443/jol/api',
  timeout: 10000,
});

// Auto-attach token
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
api.interceptors.response.use(
  res => res,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('auth_token');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);
```

## TanStack Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch schedule
export const useSchedule = (date: string) =>
  useQuery({
    queryKey: ['schedule', date],
    queryFn: () => api.get(`/schedule?date=${date}&lang=ua`).then(r => r.data),
    staleTime: 5 * 60 * 1000, // 5 хвилин
  });

// Sync CRM
export const useSyncCRM = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post('/sync/crm'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      queryClient.invalidateQueries({ queryKey: ['dialogs'] });
    },
  });
};
```

## Safe Area (ОБОВ'ЯЗКОВО)

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

// Завжди огортай екрани
export const ScheduleScreen = () => (
  <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    {/* content */}
  </SafeAreaView>
);
```

## Loading States

```typescript
// Skeleton loader
const SkeletonCard = () => {
  const opacity = useSharedValue(0.4);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View style={[styles.skeleton, style]} />
  );
};

// Loading screen
if (isLoading) return (
  <View style={styles.container}>
    {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
  </View>
);
```

## Pull-to-Refresh

```typescript
import { RefreshControl, ScrollView } from 'react-native';

const [refreshing, setRefreshing] = useState(false);
const onRefresh = async () => {
  setRefreshing(true);
  await refetch();
  setRefreshing(false);
};

<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={COLORS.coral}
    />
  }
/>
```

## Empty State

```typescript
export const EmptyState = ({ icon, title, subtitle, action }: EmptyStateProps) => (
  <View style={styles.empty}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
    {action && (
      <TouchableOpacity style={styles.button} onPress={action.onPress}>
        <Text style={styles.buttonText}>{action.label}</Text>
      </TouchableOpacity>
    )}
  </View>
);
```

## Правила якості

- Touch targets мінімум 44×44pt (Apple HIG)
- Не використовуй inline styles (performance)
- Завжди keyExtractor повертає string
- estimatedItemSize в FlashList — обов'язково
- SafeAreaView на кожному екрані
- Loading + Error + Empty states для кожного fetch
- Haptic feedback на важливих діях: `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)`
- Не блокуй JS thread: важкі обчислення в worklets
