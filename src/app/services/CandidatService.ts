import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CandidatService {
  private apiUrl = 'http://localhost:8080/api/candidat'; // adapte si ton backend est ailleurs

  constructor(private http: HttpClient) {}

  updateCandidatPartial(id: string, updatedData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, updatedData);
  }
  updateCv(id: string, formData: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/cv`, formData);
  }
  getAllCandidats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  getCandidatById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  deleteCandidat(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
