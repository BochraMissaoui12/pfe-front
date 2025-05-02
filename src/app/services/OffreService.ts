import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OffreService {
  private apiUrl = 'http://localhost:8080/api/offres';

  constructor(private http: HttpClient) {}

  creerOffre(offre: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, offre);
  }
  getOffresByEntrepriseId(entrepriseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  getOffreById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateOffre(id: string, offre: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, offre);
  }

  deleteOffre(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
