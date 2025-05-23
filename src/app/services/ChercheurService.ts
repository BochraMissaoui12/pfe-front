import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChercheurService {
  private apiUrl = 'http://localhost:8080/api/chercheur';

  constructor(private http: HttpClient) {}

  getAllChercheurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
  updateChercheur(id: string, data: Partial<any>): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }
  getChercheurById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  deleteChercheur(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
