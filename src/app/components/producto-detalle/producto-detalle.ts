import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Producto } from '../../services/producto';
import { Carrito } from '../../services/carrito';

@Component({
  selector: 'app-producto-detalle',
  imports: [CommonModule],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css',
})
export class ProductoDetalle implements OnInit {
  producto: any = null;
  cargando = true;
  mensaje = '';
  toast = '';

  apiBaseUrl = 'https://tienda-production-856f.up.railway.app';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: Producto,
    private carritoService: Carrito,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarProducto();
  }

  cargarProducto(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.mensaje = 'Producto no encontrado';
      this.cargando = false;
      return;
    }

    this.productoService.buscarPorId(id).subscribe({
      next: (data) => {
        this.producto = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensaje = 'No se pudo cargar el detalle del producto';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  agregarCarrito(): void {
    if (!this.producto) {
      return;
    }

    const usuarioId = Number(localStorage.getItem('usuarioId'));

    const data = {
      cantidad: 1,
      usuarioId: usuarioId,
      productoId: this.producto.id,
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

  obtenerImagen(imagenUrl: string): string {
    if (!imagenUrl) {
      return 'assets/productos/default.png';
    }

    if (imagenUrl.startsWith('http')) {
      return imagenUrl;
    }

    return this.apiBaseUrl + imagenUrl;
  }

  volver(): void {
    this.router.navigate(['/productos']);
  }

  irCarrito(): void {
    this.router.navigate(['/carrito']);
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
