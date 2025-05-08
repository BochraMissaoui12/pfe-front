// probleme-technique.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { CloudinaryService } from './CloudinaryService';

@Injectable({ providedIn: 'root' })
export class ProblemeTechniqueService {
  private apiUrl = 'http://localhost:8080/api/problemes-techniques';

  constructor(
    private http: HttpClient,
    private cloudinary: CloudinaryService
  ) {}

  createProblemeWithFile(probleme: any, file?: File): Observable<any> {
    if (file) {
      return this.cloudinary.uploadFile(file).pipe(
        switchMap((url) => {
          probleme.fichiersUrls = probleme.fichiersUrls || [];
          probleme.fichiersUrls.push(url);
          return this.http.post<any>(this.apiUrl, probleme);
        })
      );
    } else {
      return this.http.post<any>(this.apiUrl, probleme);
    }
  }

  // Récupérer tous les problèmes
  getAllProblemes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  // Récupérer les problèmes d'une entreprise
  getByEntreprise(entrepriseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }

  // Récupérer les problèmes publiés
  getProblemesPublies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/publies`);
  }

  // Mettre à jour un problème
  updateProbleme(id: string, probleme: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, probleme);
  }

  // Supprimer un problème
  deleteProbleme(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
