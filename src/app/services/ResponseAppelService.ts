import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReponseAppelService {
  private apiUrl = 'http://localhost:8080/api/reponses-appels';

  constructor(private http: HttpClient) {}

  envoyerReponse(reponse: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reponse);
  }
  getByAppel(appelId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appel/${appelId}`);
  }

  // Supprimer une réponse
  deleteReponse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
