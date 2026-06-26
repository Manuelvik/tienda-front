import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Categoria {
  private apiUrl = 'http://localhost:8080/categorias';

  constructor(private http: HttpClient) {}

  private headers() {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });
  }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.headers(),
    });
  }

  guardar(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, {
      headers: this.headers(),
    });
  }

  actualizar(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, {
      headers: this.headers(),
    });
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.headers(),
      responseType: 'text',
    });
  }
}
