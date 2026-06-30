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
  rol = localStorage.getItem('rol') || 'USER';

  constructor(
    private authService: Auth,
    private router: Router,
  ) {}

  esAdmin(): boolean {
    return this.rol === 'ADMIN';
  }

  esUser(): boolean {
    return this.rol === 'USER';
  }

  logout(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
