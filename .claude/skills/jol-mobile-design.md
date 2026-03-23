---
name: jol-mobile-design
description: JOL Beauty mobile app design system and UX patterns. Use for ALL UI design decisions in jol-manager iOS app. Triggers on: screen design, component styling, color, layout, dashboard, schedule, calendar, chat, visit card, client card, or any visual design question for the JOL app.
---

# JOL Beauty Manager — Mobile Design System

## Brand Identity

```
Primary:   Coral #E05A3A  — кнопки, акценти, active states
Secondary: Purple #7B52AB — бейджі, іконки функцій
Background: Warm White #FAFAF8
Surface:   Pure White #FFFFFF
```

## Design Philosophy

**Принцип: "Warm Professional"**
- Теплі нейтральні тони, не холодний корпоративний стиль
- Coral як єдиний яскравий акцент — все інше приглушене
- Достатньо простору між елементами (generous whitespace)
- Заокруглені кути: 8px малі, 12px картки, 16px модалки
- Тіні легкі і теплі: shadowOpacity 0.06-0.08

## Color System

```typescript
export const COLORS = {
  // Brand
  coral: '#E05A3A',
  coralDark: '#C44A2E',
  coralLight: '#F5EAE6',
  coralSurface: '#FDF3F0',
  
  purple: '#7B52AB',
  purpleLight: '#EEE8F5',
  purpleSurface: '#F6F2FB',
  
  // Neutrals (warm, not cold gray)
  background: '#FAFAF8',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E8E5E0',
  borderLight: '#F0EDE8',
  
  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textDisabled: '#C4C4C4',
  
  // Status
  success: '#48BB78',
  successLight: '#F0FFF4',
  warning: '#EAB308',
  warningLight: '#FEFCE8',
  danger: '#E24B4A',
  dangerLight: '#FEF2F2',
  
  // Channels
  whatsapp: '#25D366',
  whatsappLight: '#E8F8EE',
  instagram: '#E1306C',
  instagramLight: '#FCE4EC',
  messenger: '#0084FF',
  messengerLight: '#E3F2FD',
  
  // Visit status
  visitConfirmed: '#7B52AB',
  visitCheckedIn: '#48BB78',
  visitCompleted: '#9CA3AF',
  visitCancelled: '#E24B4A',
  visitNoShow: '#EAB308',
};
```

## Dashboard Screen

**Layout: 2-колонний grid статистики + список**

```
┌─────────────────────────────────┐
│  🏠 Сьогодні         23 березня │ ← Header
├────────────────┬────────────────┤
│  📅 12          │  👤 3           │ ← Stats grid
│  Записів       │  Нових клієнтів │
├────────────────┴────────────────┤
│  💬 5           │  ⚡ 1           │
│  Діалогів      │  Перехватів    │
├─────────────────────────────────┤
│  Записи сьогодні                │ ← Section header
│  ┌─────────────────────────────┐│
│  │ 10:00  Кирилл          NEW  ││ ← Visit card
│  │ Мадеро терапія              ││
│  │ Олександр Окунь  380672...  ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

**Stat Card:**
```typescript
// Coral зліва border = clickable indicator
<TouchableOpacity style={styles.statCard} onPress={onPress}>
  <View style={styles.statIcon}>
    <Text style={styles.iconEmoji}>{icon}</Text>
  </View>
  <Text style={styles.statValue}>{value}</Text>
  <Text style={styles.statLabel}>{label}</Text>
  {trend && <Text style={styles.trend}>{trend}</Text>}
</TouchableOpacity>

// Стилі
statCard: {
  flex: 1, backgroundColor: COLORS.surface,
  borderRadius: 12, padding: 16,
  borderLeftWidth: 3, borderLeftColor: COLORS.coral,
  shadowColor: '#000', shadowOpacity: 0.05,
  shadowRadius: 6, elevation: 2,
}
```

## Schedule Screen

**Layout: горизонтальний scroll по майстрах**

```
┌──────────────────────────────────────┐
│ ← Сьогодні →    пт, 23 березня  📅  │ ← Date nav
├──────┬────────────┬──────────────────┤
│ Час  │ Анастасія  │  Олександр Окунь  │
├──────┼────────────┼──────────────────┤
│ 09:00│            │                   │
│ 09:30│            │ ┌───────────────┐ │
│ 10:00│            │ │ Кирилл    NEW │ │
│ 10:30│            │ │ Мадеро тер.   │ │
│ 11:00│            │ │ 380672207510  │ │
│      │            │ └───────────────┘ │
└──────┴────────────┴──────────────────┘
```

**Visit Card кольори за статусом:**
```typescript
const visitCardColors = {
  1: { bg: '#EEE8F5', border: COLORS.purple },    // confirmed
  2: { bg: '#F0FFF4', border: COLORS.success },    // checked-in
  3: { bg: '#F5F5F5', border: '#9CA3AF' },          // completed
  4: { bg: '#FEF2F2', border: COLORS.danger },     // cancelled
  5: { bg: '#FEFCE8', border: COLORS.warning },    // no-show
};

// Visit card design
visitCard: {
  borderRadius: 8,
  padding: 8,
  marginVertical: 1,
  borderLeftWidth: 3,
  minHeight: 50,
}
```

## Dialogs (Inbox) Screen

**Layout: list з фільтрами вгорі**

```
┌─────────────────────────────────────┐
│ 🔍 Пошук...                         │ ← Search
├─────────────────────────────────────┤
│ [Всі] [WA] [IG] [FB] [Активні]...   │ ← Filter chips
├─────────────────────────────────────┤
│ ┌────────────────────────────────┐  │
│ │ 🟢  Анна Петрова    Міла  17:03│  │ ← Dialog row
│ │      Чудово, запишусь...       │  │
│ └────────────────────────────────┘  │
│ ┌────────────────────────────────┐  │
│ │ 📸  QA_SST_BUSY   Міла   19.03│  │
│ │      Стрижка жіноча — 50€...   │  │
│ └────────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Dialog Row:**
```typescript
<TouchableOpacity style={styles.row} onPress={onPress}>
  <Avatar name={dialog.client_name} channel={dialog.source} size={44} />
  <View style={styles.content}>
    <View style={styles.header}>
      <Text style={styles.name} numberOfLines={1}>{dialog.client_name || dialog.phone}</Text>
      <Badge label={dialog.bot_active ? 'Міла' : 'Admin'} type={dialog.bot_active ? 'mila' : 'admin'} />
      <Text style={styles.time}>{formatRelativeTime(dialog.updated_at)}</Text>
    </View>
    <Text style={styles.preview} numberOfLines={1}>{dialog.last_message}</Text>
  </View>
</TouchableOpacity>

// Стилі
row: {
  flexDirection: 'row', alignItems: 'center',
  padding: SPACING.lg, backgroundColor: COLORS.surface,
  borderBottomWidth: 0.5, borderBottomColor: COLORS.borderLight,
}
```

## Filter Chips

```typescript
<ScrollView horizontal showsHorizontalScrollIndicator={false}
  style={styles.chips} contentContainerStyle={{ padding: SPACING.md, gap: 8 }}>
  {filters.map(f => (
    <TouchableOpacity
      key={f.id}
      onPress={() => setActive(f.id)}
      style={[styles.chip, active === f.id && styles.chipActive]}
    >
      <Text style={[styles.chipText, active === f.id && styles.chipTextActive]}>
        {f.label}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>

chip: {
  paddingHorizontal: 14, paddingVertical: 6,
  borderRadius: 20, borderWidth: 1,
  borderColor: COLORS.border, backgroundColor: COLORS.surface,
},
chipActive: { backgroundColor: COLORS.coral, borderColor: COLORS.coral },
chipText: { fontSize: 13, color: COLORS.textSecondary },
chipTextActive: { color: '#FFFFFF', fontWeight: '500' },
```

## Bottom Tab Bar

```typescript
// Coral для активного таба
<Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarActiveTintColor: COLORS.coral,
    tabBarInactiveTintColor: COLORS.textTertiary,
    tabBarStyle: {
      backgroundColor: COLORS.surface,
      borderTopColor: COLORS.border,
      borderTopWidth: 0.5,
      paddingBottom: 4,
      height: 56,
    },
    tabBarLabelStyle: { fontSize: 11, marginTop: 2 },
  })}
>
```

## Header

```typescript
// Простий header з coral синк кнопкою
<View style={styles.header}>
  <Text style={styles.logo}>JOL Beauty</Text>
  <TouchableOpacity onPress={onSync} style={styles.syncBtn} disabled={syncing}>
    <Animated.Text style={[styles.syncIcon, syncing && rotateStyle]}>⟳</Animated.Text>
    <Text style={styles.syncText}>{syncing ? 'Синк...' : 'Синк'}</Text>
  </TouchableOpacity>
</View>

header: {
  flexDirection: 'row', alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  backgroundColor: COLORS.surface,
  borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
},
syncBtn: {
  flexDirection: 'row', alignItems: 'center', gap: 4,
  backgroundColor: COLORS.purpleLight,
  paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
},
syncText: { color: COLORS.purple, fontSize: 13, fontWeight: '500' },
```

## Toast Notifications

```typescript
// Простий toast без зовнішніх бібліотек
export const useToast = () => {
  const [toast, setToast] = useState<{ msg: string; type: 'success'|'error' } | null>(null);
  const opacity = useSharedValue(0);

  const show = (msg: string, type: 'success'|'error' = 'success') => {
    setToast({ msg, type });
    opacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(2000, withTiming(0, { duration: 200 }))
    );
    setTimeout(() => setToast(null), 2400);
  };

  const ToastComponent = toast ? (
    <Animated.View style={[styles.toast,
      toast.type === 'error' ? styles.toastError : styles.toastSuccess,
      useAnimatedStyle(() => ({ opacity: opacity.value }))
    ]}>
      <Text style={styles.toastText}>
        {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
      </Text>
    </Animated.View>
  ) : null;

  return { show, ToastComponent };
};
```

## Loading Skeleton

```typescript
export const SkeletonLine = ({ width = '100%', height = 16, style }: SkeletonProps) => {
  const opacity = useSharedValue(0.4);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.9, { duration: 900 }), -1, true);
  }, []);
  return (
    <Animated.View style={[{
      width, height, borderRadius: 4,
      backgroundColor: COLORS.border,
    }, style, useAnimatedStyle(() => ({ opacity: opacity.value }))]} />
  );
};
```

## Правила дизайну JOL

1. **Coral тільки для дій** — кнопки, active state, accent border
2. **Purple для інформації** — Міла badge, функціональні елементи
3. **Зелений для успіху** — WhatsApp, confirmed, success
4. **Warm white фон** — не чистий білий, #FAFAF8
5. **Картки завжди з тінню** — elevation 2-3, shadowOpacity 0.05-0.08
6. **Текст: тільки 3 розміри** — primary (16), secondary (14), caption (12)
7. **Іконки: емодзі або SVG** — не зовнішні іконочні шрифти
8. **Анімації: швидкі і тонкі** — duration 200-300ms, не довше
9. **Відступи: кратні 4** — 8, 12, 16, 20, 24px
10. **BorderRadius: 8 для малих, 12 для карток, 20 для пілюль**
