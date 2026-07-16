import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Pedido } from '../../services/pedido';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-pedido-detalle',
  imports: [CommonModule],
  templateUrl: './pedido-detalle.html',
  styleUrl: './pedido-detalle.css',
})
export class PedidoDetalle implements OnInit {
  pedido: any = null;
  cargando = true;
  mensaje = '';
  toast = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: Pedido,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarPedido();
  }

  cargarPedido(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.mensaje = 'Pedido no encontrado';
      this.cargando = false;
      return;
    }

    this.pedidoService.buscarPorId(id).subscribe({
      next: (data) => {
        this.pedido = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensaje = 'No se pudo cargar el detalle del pedido';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  volver(): void {
    this.router.navigate(['/pedidos']);
  }

  puedeDescargarPDF(): boolean {
    return this.pedido?.estado === 'ENTREGADO';
  }

  generarPDF(): void {
    if (!this.puedeDescargarPDF()) {
      this.mostrarToast('El comprobante estará disponible cuando el pedido sea completado');
      return;
    }

    const doc = new jsPDF();

    const fechaPedido = this.pedido.fecha
      ? new Date(this.pedido.fecha).toLocaleString()
      : new Date().toLocaleString();

    doc.setFontSize(20);
    doc.text('CyberStore', 14, 18);

    doc.setFontSize(13);
    doc.text('Comprobante de compra', 14, 28);

    doc.setFontSize(10);
    doc.text(`Pedido N°: ${this.pedido.id}`, 14, 40);
    doc.text(`Fecha del pedido: ${fechaPedido}`, 14, 46);
    doc.text(`Estado: ${this.pedido.estado}`, 14, 52);

    doc.setFontSize(12);
    doc.text('Datos del cliente', 14, 66);

    doc.setFontSize(10);
    doc.text(`Nombre: ${this.pedido.nombreCliente || 'No registrado'}`, 14, 76);
    doc.text(`DNI: ${this.pedido.dni || 'No registrado'}`, 14, 82);
    doc.text(`Teléfono: ${this.pedido.telefono || 'No registrado'}`, 14, 88);
    doc.text(`Dirección: ${this.pedido.direccion || 'No registrado'}`, 14, 94);
    doc.text(`Distrito/Ciudad: ${this.pedido.distrito || 'No registrado'}`, 14, 100);
    doc.text(`Método de pago: ${this.pedido.metodoPago || 'No registrado'}`, 14, 106);

    if (this.pedido.observacion) {
      doc.text(`Observación: ${this.pedido.observacion}`, 14, 112);
    }

    autoTable(doc, {
      startY: this.pedido.observacion ? 124 : 118,
      head: [['Concepto', 'Detalle']],
      body: [
        ['Pedido', `#${this.pedido.id}`],
        ['Estado', this.pedido.estado],
        ['Total pagado', `S/ ${this.pedido.total}`],
      ],
    });

    const finalY = (doc as any).lastAutoTable.finalY || 145;

    doc.setFontSize(12);
    doc.text(`Total: S/ ${this.pedido.total}`, 14, finalY + 14);

    doc.setFontSize(10);
    doc.text(
      'Este comprobante fue generado luego de la confirmación del administrador.',
      14,
      finalY + 26,
    );
    doc.text('Gracias por su compra en CyberStore.', 14, finalY + 34);

    doc.save(`comprobante-cyberstore-pedido-${this.pedido.id}.pdf`);
  }

  estadoTexto(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'Pendiente de confirmación';
      case 'CONFIRMADO':
        return 'Pedido confirmado';
      case 'EN_PREPARACION':
        return 'En preparación';
      case 'EN_CAMINO':
        return 'En camino';
      case 'ENTREGADO':
        return 'Entregado';
      case 'COMPLETADO':
        return 'Completado';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return estado || 'Sin estado';
    }
  }

  estadoClase(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'estado-pendiente';
      case 'CONFIRMADO':
        return 'estado-confirmado';
      case 'EN_PREPARACION':
        return 'estado-preparacion';
      case 'EN_CAMINO':
        return 'estado-camino';
      case 'ENTREGADO':
      case 'COMPLETADO':
        return 'estado-entregado';
      case 'CANCELADO':
        return 'estado-cancelado';
      default:
        return 'estado-pendiente';
    }
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
