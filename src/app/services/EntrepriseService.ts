import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class EntrepriseService {
  private apiUrl = 'http://localhost:8080/api/entreprise';
  private adminUrl = 'http://localhost:8080/admin';
  constructor(private http: HttpClient) {}
getEntrepriseById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  getAllEntreprises(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  
  updateEntreprisePartial(id: string, updatedData: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, updatedData);
  }
  deleteEntreprise(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  activateEntreprise(id: string): Observable<string> {
    return this.http.post<string>(
      `${this.adminUrl}/activateEntreprise/${id}`,
      null
    );
  }
}
