import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  MessageDto,
  MessageListDto,
  MessageThreadDto,
  SendMessageRequest,
  ReplyToMessageRequest,
  MessageSummaryDto,
  PaginatedMessageResult
} from '../models/messaging.models';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private readonly apiUrl = 'http://localhost:5000/api/messaging';

  constructor(private http: HttpClient) {}

  /**
   * Send a new message
   */
  sendMessage(request: SendMessageRequest): Observable<MessageDto> {
    return this.http.post<MessageDto>(this.apiUrl, request);
  }

  /**
   * Reply to an existing message
   */
  replyToMessage(request: ReplyToMessageRequest): Observable<MessageDto> {
    return this.http.post<MessageDto>(`${this.apiUrl}/reply`, request);
  }

  /**
   * Get inbox messages with pagination and optional status filter
   */
  getInbox(pageNumber: number = 1, pageSize: number = 20, status?: string): Observable<PaginatedMessageResult> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PaginatedMessageResult>(`${this.apiUrl}/inbox`, { params });
  }

  /**
   * Get sent messages with pagination
   */
  getSent(pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedMessageResult> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedMessageResult>(`${this.apiUrl}/sent`, { params });
  }

  /**
   * Get message by ID
   */
  getMessageById(id: string): Observable<MessageDto> {
    return this.http.get<MessageDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get message thread (full conversation)
   */
  getThread(threadId: string): Observable<MessageThreadDto> {
    return this.http.get<MessageThreadDto>(`${this.apiUrl}/thread/${threadId}`);
  }

  /**
   * Mark message as read
   */
  markAsRead(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/read`, {});
  }

  /**
   * Get unread message count
   */
  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count`);
  }

  /**
   * Get message summary (unread, inbox, sent counts)
   */
  getSummary(): Observable<MessageSummaryDto> {
    return this.http.get<MessageSummaryDto>(`${this.apiUrl}/summary`);
  }
}
