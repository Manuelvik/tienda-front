import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, {
      responseType: 'text',
    });
  }

  guardarSesion(data: any): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuarioId', data.usuarioId);
    localStorage.setItem('rol', data.rol);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  cerrarSesion(): void {
    localStorage.clear();
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }

  obtenerRol(): string | null {
    return localStorage.getItem('rol');
  }
}
