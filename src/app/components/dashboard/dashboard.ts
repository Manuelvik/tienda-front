import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(
    private authService: Auth,
    private router: Router,
  ) {}

  logout() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
