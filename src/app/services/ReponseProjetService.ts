import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReponseProjetService {
  private apiUrl = 'http://localhost:8080/api/reponses-projet';

  constructor(private http: HttpClient) {}

  // Créer une réponse à un projet
  createReponse(reponse: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reponse);
  }

  // Récupérer toutes les réponses pour un projet donné
  getReponsesByProjetId(projetId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projet/${projetId}`);
  }

  // Supprimer une réponse
  deleteReponse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
