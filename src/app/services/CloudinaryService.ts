import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpRequest,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
import { Observable, filter, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private apiUrl = 'http://localhost:8080/api/files/upload';

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', this.apiUrl, formData, {
      reportProgress: true,
      responseType: 'text', // important ici
    });

    return this.http.request(req).pipe(
      filter(
        (event): event is HttpResponse<string> =>
          event.type === HttpEventType.Response
      ),
      map((event) => event.body as string)
    );
  }
}
