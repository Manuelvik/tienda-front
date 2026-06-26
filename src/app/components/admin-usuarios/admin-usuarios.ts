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

  usuario = {
    nombre: '',
    email: '',
    password: '',
    rol: 'USER',
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

  guardarUsuario(): void {
    if (!this.usuario.nombre || !this.usuario.email || (!this.editando && !this.usuario.password)) {
      this.mostrarToast('Complete los campos obligatorios');
      return;
    }

    if (this.editando && this.usuarioId !== null) {
      this.usuarioService.actualizar(this.usuarioId, this.usuario).subscribe({
        next: () => {
          this.mostrarToast('Usuario actualizado');
          this.limpiarFormulario();
          this.cargarUsuarios();
        },
        error: () => this.mostrarToast('Error al actualizar usuario'),
      });
    } else {
      this.usuarioService.guardar(this.usuario).subscribe({
        next: () => {
          this.mostrarToast('Usuario registrado');
          this.limpiarFormulario();
          this.cargarUsuarios();
        },
        error: () => this.mostrarToast('Error al registrar usuario'),
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
      rol: usuario.rol,
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
