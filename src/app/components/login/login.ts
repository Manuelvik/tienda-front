import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  mensaje = '';
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login(): void {
    this.mensaje = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.mensaje = 'Complete correctamente los campos';
      return;
    }

    this.cargando = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (data) => {
        this.authService.guardarSesion(data);
        this.cargando = false;

        if (data.rol === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.mensaje = 'Credenciales incorrectas';
        this.cargando = false;
      },
    });
  }
}
