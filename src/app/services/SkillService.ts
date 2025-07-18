import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private apiUrl = 'https://ec.europa.eu/esco/api/search?type=skill';

  constructor(private http: HttpClient) {}

  searchSkills(keyword: string): Observable<string[]> {
    return this.http
      .get<any>(`${this.apiUrl}&text=${keyword}`, {
        withCredentials: false, // Désactive les credentials pour cette requête
      })
      .pipe(map((res) => res._embedded.results.map((r: any) => r.title)));
  }
}
