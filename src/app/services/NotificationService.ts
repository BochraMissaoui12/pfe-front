import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) {}

  getNonConsultees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/non-consultees`);
  }

  marquerCommeConsulte(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/consulte`, {});
  }
}
