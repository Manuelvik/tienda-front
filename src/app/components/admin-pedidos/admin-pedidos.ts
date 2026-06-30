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

  cargando = true;
  actualizandoId: number | null = null;
  eliminandoId: number | null = null;

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
    this.cargando = true;
    this.mensaje = '';

    this.pedidoService.listar().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensaje = 'No se pudieron cargar los pedidos';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  guardarEstado(pedido: any): void {
    if (this.actualizandoId !== null) {
      return;
    }

    if (!pedido.estado || !this.estados.includes(pedido.estado)) {
      this.mostrarToast('Seleccione un estado válido');
      return;
    }

    this.actualizandoId = pedido.id;

    this.pedidoService.actualizarEstado(pedido.id, pedido.estado).subscribe({
      next: () => {
        this.mostrarToast('Estado actualizado');
        this.actualizandoId = null;
        this.cargarPedidos();
        this.cdr.detectChanges();
      },
      error: () => {
        this.mostrarToast('Error al actualizar el estado');
        this.actualizandoId = null;
        this.cdr.detectChanges();
      },
    });
  }

  eliminar(id: number): void {
    if (this.eliminandoId !== null) {
      return;
    }

    if (!confirm('¿Eliminar pedido?')) {
      return;
    }

    this.eliminandoId = id;

    this.pedidoService.eliminar(id).subscribe({
      next: () => {
        this.mostrarToast('Pedido eliminado');
        this.eliminandoId = null;
        this.cargarPedidos();
        this.cdr.detectChanges();
      },
      error: () => {
        this.mostrarToast('No se pudo eliminar el pedido');
        this.eliminandoId = null;
        this.cdr.detectChanges();
      },
    });
  }

  estadoClase(estado: string): string {
    if (!estado) {
      return 'pendiente';
    }

    return estado.toLowerCase();
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
