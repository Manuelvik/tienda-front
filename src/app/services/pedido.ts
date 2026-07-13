import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Pedido {
  private apiUrl = 'https://tienda-production-856f.up.railway.app/pedidos';

  constructor(private http: HttpClient) {}

  private headers() {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    });
  }

  crear(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, {
      headers: this.headers(),
    });
  }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.headers(),
    });
  }

  listarPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`, {
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

  filtrarPorEstado(estado: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estado/${estado}`, {
      headers: this.headers(),
    });
  }
  actualizarEstado(id: number, estado: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}/estado`,
      { estado },
      {
        headers: this.headers(),
      },
    );
  }
  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.headers(),
    });
  }
}
