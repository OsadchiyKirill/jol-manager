export interface Visit {
  id: number;
  client_name: string;
  client_phone: string;
  client_status: string;
  client_vizits: number;
  master_name_ua: string;
  master_name_original: string;
  service_name: string;
  time: string;
  status: string;
  total: number;
  duration: number;
}

export interface Conversation {
  user_id: string;
  client_name: string | null;
  client_phone: string | null;
  channel: string;
  message_count: number;
  last_message_at: string;
  first_message_at: string;
  last_message_text: string | null;
  last_sender_type: string | null;
  unread_count: number;
  status: 'bot' | 'operator';
  takeover: TakeoverData | null;
}

export interface TakeoverData {
  active: boolean;
  staff_id: string;
  staff_name: string;
  channel: string;
  timestamp: string;
  source: string;
  last_manager_activity: string;
}

export interface Message {
  id: number;
  user_id: string;
  direction: 'inbound' | 'outbound';
  sender_type: 'client' | 'bot' | 'operator';
  channel: string;
  message_text: string;
  message_type: string;
  media_url: string | null;
  operator_id: number | null;
  created_at: string;
}

export type RootStackParamList = {
  Main: undefined;
  Chat: { userId: string; clientName: string | null; channel: string };
  VisitDetail: { visit: Visit };
};
