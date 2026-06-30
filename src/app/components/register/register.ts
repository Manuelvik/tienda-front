import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  mensaje = '';
  exito = '';
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  registrar(): void {
    this.mensaje = '';
    this.exito = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.mensaje = 'Complete correctamente los campos';
      return;
    }

    this.cargando = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.exito = 'Usuario registrado correctamente';
        this.cargando = false;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: () => {
        this.mensaje = 'No se pudo registrar el usuario';
        this.cargando = false;
      },
    });
  }
}
