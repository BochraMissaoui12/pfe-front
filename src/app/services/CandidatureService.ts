import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CandidatureService {
  private apiUrl = 'http://localhost:8080/api/candidatures';

  constructor(private http: HttpClient) {}

  postuler(candidature: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/postuler`, candidature);
  }

  supprimerCandidature(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCandidaturesParUtilisateur(utilisateurId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }
  getCandidaturesParOffre(offreId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/offre/${offreId}`);
  }
  getCandidaturesParEntreprise(entrepriseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  changerStatut(
    id: string,
    statut: string,
    messageEntreprise?: string
  ): Observable<any> {
    let params = new HttpParams().set('statut', statut);
    if (messageEntreprise) {
      params = params.set('messageEntreprise', messageEntreprise);
    }
    return this.http.put<any>(`${this.apiUrl}/${id}/statut`, null, {
      params,
    });
  }
}
