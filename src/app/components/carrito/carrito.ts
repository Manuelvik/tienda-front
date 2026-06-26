import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Carrito as CarritoService } from '../../services/carrito';
import { ChangeDetectorRef } from '@angular/core';
import { Pedido } from '../../services/pedido';
@Component({
  selector: 'app-carrito',
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito implements OnInit {
  items: any[] = [];
  total = 0;
  mensaje = '';
  cargando = true;
  toast = '';

  constructor(
    private carritoService: CarritoService,
    private pedidoService: Pedido,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    const usuarioId = Number(localStorage.getItem('usuarioId'));

    this.carritoService.listarPorUsuario(usuarioId).subscribe({
      next: (data) => {
        this.items = data;
        this.calcularTotal();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensaje = 'No se pudo cargar el carrito';
        this.cargando = false;
      },
    });
  }

  calcularTotal(): void {
    this.total = this.items.reduce((sum, item) => {
      return sum + item.producto.precio * item.cantidad;
    }, 0);
  }

  aumentar(item: any): void {
    const data = {
      cantidad: item.cantidad + 1,
      usuarioId: item.usuario?.id,
      productoId: item.producto?.id,
    };

    this.carritoService.actualizarCantidad(item.id, data).subscribe({
      next: () => {
        item.cantidad++;
        this.calcularTotal();
        this.cdr.detectChanges();
      },
    });
  }

  disminuir(item: any): void {
    if (item.cantidad <= 1) return;

    const data = {
      cantidad: item.cantidad - 1,
      usuarioId: item.usuario?.id,
      productoId: item.producto?.id,
    };

    this.carritoService.actualizarCantidad(item.id, data).subscribe({
      next: () => {
        item.cantidad--;
        this.calcularTotal();
        this.cdr.detectChanges();
      },
    });
  }

  eliminar(id: number): void {
    this.carritoService.eliminar(id).subscribe({
      next: () => {
        this.items = this.items.filter((item) => item.id !== id);
        this.calcularTotal();
        this.mostrarToast('Producto eliminado del carrito');
        this.cdr.detectChanges();
      },
    });
  }

  mostrarToast(texto: string): void {
    this.toast = texto;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.toast = '';
      this.cdr.detectChanges();
    }, 2500);
  }

  generarPedido(): void {
    if (this.total <= 0) {
      this.mostrarToast('El carrito está vacío');
      return;
    }

    const usuarioId = Number(localStorage.getItem('usuarioId'));

    const data = {
      total: this.total,
      usuarioId: usuarioId,
    };

    this.pedidoService.crear(data).subscribe({
      next: () => {
        this.mostrarToast('Pedido generado correctamente');
        this.cdr.detectChanges();
      },
      error: () => {
        this.mostrarToast('No se pudo generar el pedido');
        this.cdr.detectChanges();
      },
    });
  }
}
