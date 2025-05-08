// reponse-probleme.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { CloudinaryService } from './CloudinaryService';

@Injectable({ providedIn: 'root' })
export class ReponseProblemeService {
  private apiUrl = 'http://localhost:8080/api/reponses-problemes';

  constructor(
    private http: HttpClient,
    private cloudinary: CloudinaryService
  ) {}

  createReponseWithFile(reponse: any, file?: File): Observable<any> {
    if (file) {
      return this.cloudinary.uploadFile(file).pipe(
        switchMap((url) => {
          reponse.fichiersUrls = reponse.fichiersUrls || [];
          reponse.fichiersUrls.push(url);
          return this.http.post<any>(this.apiUrl, reponse);
        })
      );
    } else {
      return this.http.post<any>(this.apiUrl, reponse);
    }
  }

  // Récupérer les réponses d'un problème
  getByProbleme(problemeId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/probleme/${problemeId}`);
  }

  // Supprimer une réponse
  deleteReponse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
