import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Reporte {
  private apiUrl = 'http://localhost:8080/reportes';

  constructor(private http: HttpClient) {}

  private headers() {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
  }

  resumen(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resumen`, {
      headers: this.headers(),
    });
  }
}
