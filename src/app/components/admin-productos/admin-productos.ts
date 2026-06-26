import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../services/producto';
import { Categoria } from '../../services/categoria';

@Component({
  selector: 'app-admin-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-productos.html',
  styleUrl: './admin-productos.css',
})
export class AdminProductos implements OnInit {
  productos: any[] = [];
  editando = false;
  productoId: number | null = null;
  categorias: any[] = [];

  producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoriaId: 1,
  };

  mensaje = '';
  toast = '';

  constructor(
    private productoService: Producto,
    private categoriaService: Categoria,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos(): void {
    this.productoService.listar().subscribe({
      next: (data) => {
        this.productos = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensaje = 'No se pudieron cargar los productos';
        this.cdr.detectChanges();
      },
    });
  }

  guardarProducto(): void {
    if (!this.producto.nombre || !this.producto.descripcion || this.producto.categoriaId === 0) {
      this.mostrarToast('Complete todos los campos obligatorios');
      return;
    }

    if (this.editando && this.productoId !== null) {
      this.productoService.actualizar(this.productoId, this.producto).subscribe({
        next: () => {
          this.mostrarToast('Producto actualizado');
          this.limpiarFormulario();
          this.cargarProductos();
        },
        error: () => this.mostrarToast('Error al actualizar producto'),
      });
    } else {
      this.productoService.guardar(this.producto).subscribe({
        next: () => {
          this.mostrarToast('Producto registrado');
          this.limpiarFormulario();
          this.cargarProductos();
        },
        error: () => this.mostrarToast('Error al registrar producto'),
      });
    }
  }

  editar(producto: any): void {
    this.editando = true;
    this.productoId = producto.id;

    this.producto = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      categoriaId: producto.categoria?.id || 1,
    };

    this.cdr.detectChanges();
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;

    this.productoService.eliminar(id).subscribe({
      next: () => {
        this.mostrarToast('Producto eliminado');
        this.cargarProductos();
      },
      error: () => this.mostrarToast('Error al eliminar producto'),
    });
  }

  limpiarFormulario(): void {
    this.editando = false;
    this.productoId = null;

    this.producto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoriaId: 1,
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

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mostrarToast('No se pudieron cargar las categorías');
      },
    });
  }
}
