import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categoria } from '../../services/categoria';

@Component({
  selector: 'app-admin-categorias',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categorias.html',
  styleUrl: './admin-categorias.css',
})
export class AdminCategorias implements OnInit {
  categorias: any[] = [];

  editando = false;
  categoriaId: number | null = null;

  categoria = {
    nombre: '',
    descripcion: '',
  };

  mensaje = '';
  toast = '';

  constructor(
    private categoriaService: Categoria,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensaje = 'No se pudieron cargar las categorías';
        this.cdr.detectChanges();
      },
    });
  }

  guardarCategoria(): void {
    if (!this.categoria.nombre || !this.categoria.descripcion) {
      this.mostrarToast('Complete todos los campos');
      return;
    }

    if (this.editando && this.categoriaId !== null) {
      this.categoriaService.actualizar(this.categoriaId, this.categoria).subscribe({
        next: () => {
          this.mostrarToast('Categoría actualizada');
          this.limpiarFormulario();
          this.cargarCategorias();
        },
        error: () => this.mostrarToast('Error al actualizar categoría'),
      });
    } else {
      this.categoriaService.guardar(this.categoria).subscribe({
        next: () => {
          this.mostrarToast('Categoría registrada');
          this.limpiarFormulario();
          this.cargarCategorias();
        },
        error: () => this.mostrarToast('Error al registrar categoría'),
      });
    }
  }

  editar(categoria: any): void {
    this.editando = true;
    this.categoriaId = categoria.id;

    this.categoria = {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
    };

    this.cdr.detectChanges();
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;

    this.categoriaService.eliminar(id).subscribe({
      next: () => {
        this.mostrarToast('Categoría eliminada');
        this.cargarCategorias();
      },
      error: () => this.mostrarToast('Error al eliminar categoría'),
    });
  }

  limpiarFormulario(): void {
    this.editando = false;
    this.categoriaId = null;

    this.categoria = {
      nombre: '',
      descripcion: '',
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
