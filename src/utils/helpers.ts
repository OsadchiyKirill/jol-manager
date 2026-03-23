export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'щойно';
  if (diffMins < 60) return `${diffMins} хв`;
  if (diffHours < 24) return `${diffHours} год`;
  if (diffDays < 7) return `${diffDays} д`;

  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Доброго ранку';
  if (hour < 18) return 'Добрий день';
  return 'Добрий вечір';
}

export function getTodayDateMadrid(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' });
}

export function formatDateMadrid(date: Date): string {
  return date.toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' });
}
