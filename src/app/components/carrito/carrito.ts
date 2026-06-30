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
  generandoPedido = false;
  actualizandoId: number | null = null;
  eliminandoId: number | null = null;

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
    if (this.actualizandoId !== null) {
      return;
    }

    this.actualizandoId = item.id;

    const data = {
      cantidad: item.cantidad + 1,
      usuarioId: item.usuario?.id,
      productoId: item.producto?.id,
    };

    this.carritoService.actualizarCantidad(item.id, data).subscribe({
      next: () => {
        item.cantidad++;
        this.calcularTotal();
        this.actualizandoId = null;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mostrarToast('No se pudo aumentar la cantidad');
        this.actualizandoId = null;
        this.cdr.detectChanges();
      },
    });
  }

  disminuir(item: any): void {
    if (this.actualizandoId !== null) {
      return;
    }

    if (item.cantidad <= 1) {
      return;
    }

    this.actualizandoId = item.id;

    const data = {
      cantidad: item.cantidad - 1,
      usuarioId: item.usuario?.id,
      productoId: item.producto?.id,
    };

    this.carritoService.actualizarCantidad(item.id, data).subscribe({
      next: () => {
        item.cantidad--;
        this.calcularTotal();
        this.actualizandoId = null;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mostrarToast('No se pudo disminuir la cantidad');
        this.actualizandoId = null;
        this.cdr.detectChanges();
      },
    });
  }

  eliminar(id: number): void {
    if (this.eliminandoId !== null) {
      return;
    }

    this.eliminandoId = id;

    this.carritoService.eliminar(id).subscribe({
      next: () => {
        this.items = this.items.filter((item) => item.id !== id);
        this.calcularTotal();
        this.eliminandoId = null;
        this.mostrarToast('Producto eliminado del carrito');
        this.cdr.detectChanges();
      },
      error: () => {
        this.eliminandoId = null;
        this.mostrarToast('No se pudo eliminar el producto');
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
    if (this.generandoPedido) {
      return;
    }

    if (this.total <= 0 || this.items.length === 0) {
      this.mostrarToast('El carrito está vacío');
      return;
    }

    const usuarioId = Number(localStorage.getItem('usuarioId'));

    if (!usuarioId) {
      this.mostrarToast('No se encontró el usuario');
      return;
    }

    const data = {
      total: this.total,
      usuarioId: usuarioId,
    };

    this.generandoPedido = true;

    this.pedidoService.crear(data).subscribe({
      next: () => {
        this.mostrarToast('Pedido generado correctamente');
        this.generandoPedido = false;
        this.cargarCarrito();
        this.cdr.detectChanges();
      },
      error: () => {
        this.mostrarToast('No se pudo generar el pedido');
        this.generandoPedido = false;
        this.cdr.detectChanges();
      },
    });
  }
}
