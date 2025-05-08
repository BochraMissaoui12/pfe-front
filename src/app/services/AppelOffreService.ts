import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppelOffreService {
  private apiUrl = 'http://localhost:8080/api/appeloffres';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(appel: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, appel);
  }

  update(id: string, appel: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, appel);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
