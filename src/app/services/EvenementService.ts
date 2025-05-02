import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EvenementService {
  private apiUrl = 'http://localhost:8080/api/evenements';

  constructor(private http: HttpClient) {}

  getAllEvenements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  createEvenement(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, formData);
  }

  updateEvenement(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteEvenement(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  validerEvenement(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/valider/${id}`, {});
  }
}
