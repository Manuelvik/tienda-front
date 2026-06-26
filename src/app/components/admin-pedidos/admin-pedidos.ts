import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Pedido } from '../../services/pedido';

@Component({
  selector: 'app-admin-pedidos',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pedidos.html',
  styleUrl: './admin-pedidos.css',
})
export class AdminPedidos implements OnInit {
  pedidos: any[] = [];

  estados = ['PENDIENTE', 'COMPLETADO', 'CANCELADO'];

  toast = '';

  mensaje = '';

  constructor(
    private pedidoService: Pedido,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.pedidoService.listar().subscribe({
      next: (data) => {
        this.pedidos = data;

        this.cdr.detectChanges();
      },

      error: () => {
        this.mensaje = 'No se pudieron cargar los pedidos';
      },
    });
  }

  guardarEstado(pedido: any) {
    this.pedidoService.actualizarEstado(pedido.id, pedido.estado).subscribe({
      next: () => {
        this.mostrarToast('Estado actualizado');
      },

      error: () => {
        this.mostrarToast('Error al actualizar');
      },
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar pedido?')) return;

    this.pedidoService.eliminar(id).subscribe({
      next: () => {
        this.mostrarToast('Pedido eliminado');

        this.cargarPedidos();
      },

      error: () => {
        this.mostrarToast('No se pudo eliminar');
      },
    });
  }

  mostrarToast(texto: string) {
    this.toast = texto;

    this.cdr.detectChanges();

    setTimeout(() => {
      this.toast = '';

      this.cdr.detectChanges();
    }, 2500);
  }
}
