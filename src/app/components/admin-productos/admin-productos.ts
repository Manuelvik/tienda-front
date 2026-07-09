import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../services/producto';
import { Categoria } from '../../services/categoria';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  subiendoImagen = false;

  producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagenUrl: '',
    categoriaId: 1,
  };

  mensaje = '';
  toast = '';

  errores = {
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoriaId: '',
  };

  constructor(
    private productoService: Producto,
    private categoriaService: Categoria,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
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

  seleccionarImagen(event: any): void {
    const archivo = event.target.files[0];

    if (!archivo) {
      return;
    }

    if (!archivo.type.startsWith('image/')) {
      this.mostrarToast('Seleccione un archivo de imagen válido');
      event.target.value = '';
      return;
    }

    const pesoMaximo = 5 * 1024 * 1024;

    if (archivo.size > pesoMaximo) {
      this.mostrarToast('La imagen no debe superar los 5 MB');
      event.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('imagen', archivo);

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.subiendoImagen = true;
    this.mostrarToast('Subiendo imagen...');

    this.http
      .post<any>('https://tienda-production-856f.up.railway.app/productos/imagen', formData, {
        headers,
      })
      .subscribe({
        next: (resp) => {
          this.producto.imagenUrl = resp.imagenUrl;
          this.subiendoImagen = false;
          this.mostrarToast('Imagen subida correctamente');
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al subir imagen:', error);
          this.subiendoImagen = false;
          this.mostrarToast('No se pudo subir la imagen');
          this.cdr.detectChanges();
        },
      });
  }

  guardarProducto(): void {
    if (!this.validarFormulario()) {
      this.mostrarToast('Revise los campos del formulario');
      return;
    }

    if (this.subiendoImagen) {
      this.mostrarToast('Espere a que termine de subir la imagen');
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
      imagenUrl: producto.imagenUrl || '',
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
      imagenUrl: '',
      categoriaId: 1,
    };

    this.cdr.detectChanges();
  }

  apiBaseUrl = 'https://tienda-production-856f.up.railway.app';

  obtenerImagen(imagenUrl: string): string {
    if (!imagenUrl) {
      return 'assets/productos/default.png';
    }

    if (imagenUrl.startsWith('http')) {
      return imagenUrl;
    }

    return this.apiBaseUrl + imagenUrl;
  }

  mostrarToast(texto: string): void {
    this.toast = texto;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.toast = '';
      this.cdr.detectChanges();
    }, 2500);
  }

  validarFormulario(): boolean {
    this.errores = {
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoriaId: '',
    };

    let valido = true;

    if (!this.producto.nombre.trim()) {
      this.errores.nombre = 'El nombre del producto es obligatorio';
      valido = false;
    }

    if (!this.producto.descripcion.trim()) {
      this.errores.descripcion = 'La descripción es obligatoria';
      valido = false;
    }

    if (this.producto.precio <= 0) {
      this.errores.precio = 'El precio debe ser mayor que 0';
      valido = false;
    }

    if (this.producto.stock < 0) {
      this.errores.stock = 'El stock no puede ser negativo';
      valido = false;
    }

    if (!this.producto.categoriaId || this.producto.categoriaId === 0) {
      this.errores.categoriaId = 'Debe seleccionar una categoría';
      valido = false;
    }

    this.cdr.detectChanges();
    return valido;
  }
}
