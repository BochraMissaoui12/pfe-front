// src/app/services/utilisateur.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private apiUrl = 'http://localhost:8080/api/utilisateur'; // Change si ton backend est ailleurs

  constructor(private http: HttpClient) {}

  getUtilisateurByIdAndRole(id: string, role: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/${role}`, {
      withCredentials: true,
    });
  }
}
