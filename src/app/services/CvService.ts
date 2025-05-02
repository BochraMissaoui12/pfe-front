import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CvService {
  private apiUrl = 'http://localhost:8080/api/cv/generate'; // URL backend

  constructor(private http: HttpClient) {}

  generateCv(candidatId: string, template: number): Observable<Blob> {
    const params = new HttpParams()
      .set('candidatId', candidatId)
      .set('template', template.toString());
    return this.http.post(this.apiUrl, null, { params, responseType: 'blob' });
  }
}
