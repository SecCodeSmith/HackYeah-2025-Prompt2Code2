import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PodmiotDto,
  PodmiotListDto,
  CreatePodmiotRequest,
  UpdatePodmiotRequest,
  PaginatedResult
} from '../models/podmiot.model';

@Injectable({
  providedIn: 'root'
})
export class PodmiotyService {
  private readonly apiUrl = 'http://localhost:5000/api/podmioty';

  constructor(private http: HttpClient) {}

  /**
   * Get paginated list of entities with optional filtering
   */
  getPodmioty(
    pageNumber: number = 1,
    pageSize: number = 10,
    typPodmiotu?: number,
    status?: number,
    searchTerm?: string
  ): Observable<PaginatedResult<PodmiotListDto>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (typPodmiotu !== undefined && typPodmiotu !== null) {
      params = params.set('typPodmiotu', typPodmiotu.toString());
    }

    if (status !== undefined && status !== null) {
      params = params.set('status', status.toString());
    }

    if (searchTerm && searchTerm.trim()) {
      params = params.set('searchTerm', searchTerm.trim());
    }

    return this.http.get<PaginatedResult<PodmiotListDto>>(this.apiUrl, { params });
  }

  /**
   * Get single entity by ID
   */
  getPodmiotById(id: string): Observable<PodmiotDto> {
    return this.http.get<PodmiotDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new entity
   */
  createPodmiot(request: CreatePodmiotRequest): Observable<PodmiotDto> {
    return this.http.post<PodmiotDto>(this.apiUrl, request);
  }

  /**
   * Update existing entity
   */
  updatePodmiot(id: string, request: UpdatePodmiotRequest): Observable<PodmiotDto> {
    return this.http.put<PodmiotDto>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Delete entity
   */
  deletePodmiot(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
