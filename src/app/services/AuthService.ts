import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  currentUserSubject: BehaviorSubject<{ token: string }>;

  constructor(private http: HttpClient, public router: Router) {
    const token = localStorage.getItem('token') ?? ''; // Si `null`, on utilise une chaîne vide
    this.currentUserSubject = new BehaviorSubject<{ token: string }>({
      token: token,
    });
  }
  getToken() {
    return localStorage.getItem('token');
  }
  registerEntreprise(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/entreprise`, formData);
  }

  registerCandidat(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/candidat`, formData);
  }

  registerChercheur(chercheurData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/register/chercheur`, chercheurData, {
      headers: headers,
    });
  }

  loginUser(email: string, motDePasse: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login-user`,
      { email, motDePasse },
      { responseType: 'text' }
    );
  }

  loginAdmin(email: string, motDePasse: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login-admin`,
      { email, motDePasse },
      { responseType: 'text' }
    );
  }

  confirmEmail(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm`, { email, code });
  }
}
