// Messaging Models - TypeScript interfaces matching backend DTOs

export interface MessageDto {
  id: string;
  subject: string;
  content: string;
  priority: string; // 'Low' | 'Normal' | 'High' | 'Urgent'
  status: string; // 'Unread' | 'Read' | 'Replied' | 'Archived'
  sentAt: string;
  readAt?: string | null;
  senderUserId: string;
  senderName: string;
  recipientUserId: string;
  recipientName?: string | null;
  podmiotId?: string | null;
  podmiotName?: string | null;
  parentMessageId?: string | null;
  threadId: string;
  isFromUKNF: boolean;
  replyCount: number;
  createdAt: string;
}

export interface MessageListDto {
  id: string;
  subject: string;
  priority: string;
  status: string;
  sentAt: string;
  senderName: string;
  recipientName?: string | null;
  isFromUKNF: boolean;
  hasAttachments: boolean;
  replyCount: number;
}

export interface MessageThreadDto {
  threadId: string;
  subject: string;
  messages: MessageDto[];
  participantNames: string[];
}

export interface SendMessageRequest {
  subject: string;
  content: string;
  priority: string;
  recipientUserId: string;
  podmiotId?: string | null;
}

export interface ReplyToMessageRequest {
  parentMessageId: string;
  content: string;
  priority: string;
}

export interface MessageSummaryDto {
  unreadCount: number;
  inboxCount: number;
  sentCount: number;
}

export interface PaginatedMessageResult {
  messages: MessageListDto[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

export enum MessagePriority {
  Low = 'Low',
  Normal = 'Normal',
  High = 'High',
  Urgent = 'Urgent'
}

export enum MessageStatus {
  Unread = 'Unread',
  Read = 'Read',
  Replied = 'Replied',
  Archived = 'Archived'
}
