import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../services/pedido';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos implements OnInit {
  pedidos: any[] = [];
  cargando = true;
  mensaje = '';
  toast = '';

  constructor(
    private pedidoService: Pedido,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    const usuarioId = Number(localStorage.getItem('usuarioId'));

    if (!usuarioId) {
      this.mensaje = 'No se encontró el usuario en sesión';
      this.cargando = false;
      this.cdr.detectChanges();
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    this.pedidoService.listarPorUsuario(usuarioId).subscribe({
      next: (data) => {
        this.pedidos = data.sort((a: any, b: any) => {
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        });

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

  estadoClase(estado: string): string {
    if (estado === 'PENDIENTE') return 'estado-pendiente';
    if (estado === 'COMPLETADO') return 'estado-completado';
    if (estado === 'CANCELADO') return 'estado-cancelado';
    return 'estado-pendiente';
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

