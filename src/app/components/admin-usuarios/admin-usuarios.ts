import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../services/usuario';

@Component({
  selector: 'app-admin-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.css',
})
export class AdminUsuarios implements OnInit {
  usuarios: any[] = [];

  editando = false;
  usuarioId: number | null = null;
  guardando = false;

  usuario = {
    nombre: '',
    email: '',
    password: '',
    rol: 'USER',
  };

  errores = {
    nombre: '',
    email: '',
    password: '',
    rol: '',
  };

  mensaje = '';
  toast = '';

  constructor(
    private usuarioService: Usuario,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensaje = 'No se pudieron cargar los usuarios';
        this.cdr.detectChanges();
      },
    });
  }

  validarFormulario(): boolean {
    this.errores = {
      nombre: '',
      email: '',
      password: '',
      rol: '',
    };

    let valido = true;

    if (!this.usuario.nombre.trim()) {
      this.errores.nombre = 'El nombre del usuario es obligatorio';
      valido = false;
    }

    if (!this.usuario.email.trim()) {
      this.errores.email = 'El email es obligatorio';
      valido = false;
    } else if (!this.validarEmail(this.usuario.email)) {
      this.errores.email = 'Ingrese un email válido';
      valido = false;
    }

    if (!this.editando && !this.usuario.password.trim()) {
      this.errores.password = 'La contraseña es obligatoria';
      valido = false;
    }

    if (
      !this.editando &&
      this.usuario.password.trim().length > 0 &&
      this.usuario.password.length < 6
    ) {
      this.errores.password = 'La contraseña debe tener mínimo 6 caracteres';
      valido = false;
    }

    if (!this.usuario.rol) {
      this.errores.rol = 'Debe seleccionar un rol';
      valido = false;
    }

    this.cdr.detectChanges();
    return valido;
  }

  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  guardarUsuario(): void {
    if (this.guardando) {
      return;
    }

    if (!this.validarFormulario()) {
      this.mostrarToast('Revise los campos del formulario');
      return;
    }

    this.guardando = true;

    if (this.editando && this.usuarioId !== null) {
      this.usuarioService.actualizar(this.usuarioId, this.usuario).subscribe({
        next: () => {
          this.mostrarToast('Usuario actualizado');
          this.limpiarFormulario();
          this.cargarUsuarios();
          this.guardando = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.mostrarToast('Error al actualizar usuario');
          this.guardando = false;
          this.cdr.detectChanges();
        },
      });
    } else {
      this.usuarioService.guardar(this.usuario).subscribe({
        next: () => {
          this.mostrarToast('Usuario registrado');
          this.limpiarFormulario();
          this.cargarUsuarios();
          this.guardando = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.mostrarToast('Error al registrar usuario');
          this.guardando = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  editar(usuario: any): void {
    this.editando = true;
    this.usuarioId = usuario.id;

    this.usuario = {
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      rol: usuario.rol || 'USER',
    };

    this.errores = {
      nombre: '',
      email: '',
      password: '',
      rol: '',
    };

    this.cdr.detectChanges();
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    this.usuarioService.eliminar(id).subscribe({
      next: () => {
        this.mostrarToast('Usuario eliminado');
        this.cargarUsuarios();
      },
      error: () => this.mostrarToast('Error al eliminar usuario'),
    });
  }

  limpiarFormulario(): void {
    this.editando = false;
    this.usuarioId = null;

    this.usuario = {
      nombre: '',
      email: '',
      password: '',
      rol: 'USER',
    };

    this.errores = {
      nombre: '',
      email: '',
      password: '',
      rol: '',
    };

    this.cdr.detectChanges();
  }

  mostrarToast(texto: string): void {
    this.toast = texto;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.toast = '';
      this.cdr.detectChanges();
    }, 2500);
  }
}
