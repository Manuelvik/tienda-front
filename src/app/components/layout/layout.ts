import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  rol = '';

  constructor(
    private authService: Auth,
    private router: Router,
  ) {}

  estaLogueado(): boolean {
    return !!localStorage.getItem('token');
  }

  obtenerRol(): string {
    return localStorage.getItem('rol') || '';
  }

  esAdmin(): boolean {
    return this.obtenerRol() === 'ADMIN';
  }

  esUser(): boolean {
    return this.obtenerRol() === 'USER';
  }

  logout(): void {
    this.authService.cerrarSesion();

    this.rol = '';

    this.router.navigate(['/inicio']);
  }

  irLogin(): void {
    this.router.navigate(['/login']);
  }
}
