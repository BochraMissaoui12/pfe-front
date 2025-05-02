import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from 'mongodb';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/superadmin';

  constructor(private http: HttpClient) {}

  getAllAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrl}`);
  }

  addAdmin(admin: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add/admin`, admin);
  }

  updateAdmin(adminId: string, admin: any): Observable<Admin> {
    return this.http.put<Admin>(`${this.apiUrl}/${adminId}`, admin);
  }

  deleteAdmin(adminId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${adminId}`);
  }
}
