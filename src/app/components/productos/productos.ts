import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../services/producto';
import { Carrito } from '../../services/carrito';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];

  busqueda = '';
  mensaje = '';
  cargando = true;
  toast = '';

  constructor(
    private productoService: Producto,
    private carritoService: Carrito,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;

    this.productoService.listar().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensaje = 'No se pudieron cargar los productos';
        this.cargando = false;
      },
    });
  }

  filtrarProductos(): void {
    const texto = this.busqueda.toLowerCase().trim();

    this.productosFiltrados = this.productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(texto) ||
        producto.descripcion.toLowerCase().includes(texto) ||
        (producto.categoria?.nombre || '').toLowerCase().includes(texto),
    );
  }

  agregarCarrito(productoId: number): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.mostrarToast('Inicia sesión para agregar productos al carrito');

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1200);

      return;
    }

    const usuarioId = Number(localStorage.getItem('usuarioId'));

    const data = {
      cantidad: 1,
      usuarioId: usuarioId,
      productoId: productoId,
    };

    this.carritoService.agregar(data).subscribe({
      next: () => {
        this.mostrarToast('Producto agregado al carrito');
        this.cdr.detectChanges();
      },
      error: () => {
        this.mostrarToast('No se pudo agregar al carrito');
      },
    });
  }

  verDetalle(productoId: number): void {
    this.router.navigate(['/productos', productoId]);
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

  stockClase(stock: number): string {
    if (stock <= 0) return 'stock-danger';
    if (stock <= 5) return 'stock-warning';
    return 'stock-ok';
  }
}
