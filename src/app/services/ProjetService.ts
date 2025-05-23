import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjetService {
  private apiUrl = 'http://localhost:8080/api/projets';

  constructor(private http: HttpClient) {}

  // Créer un projet
  createProjet(projet: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, projet);
  }

  // Tous les projets
  getAllProjets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Projet par ID
  getProjetById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Projets par chercheur
  getProjetsByChercheurId(chercheurId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/chercheur/${chercheurId}`);
  }
  // Projets par statut
  getProjetsByStatut(statut: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/statut/${statut}`);
  }

  // Modifier un projet
  updateProjet(id: string, projet: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, projet);
  }

  // Supprimer un projet
  deleteProjet(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
