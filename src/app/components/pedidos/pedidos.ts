import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../services/pedido';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router';

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
    private router: Router,
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
        return 'estado-entregado';
      case 'CANCELADO':
        return 'estado-cancelado';
      default:
        return 'estado-pendiente';
    }
  }

  estadoTexto(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'CONFIRMADO':
        return 'Confirmado';
      case 'EN_PREPARACION':
        return 'En preparación';
      case 'EN_CAMINO':
        return 'En camino';
      case 'ENTREGADO':
        return 'Entregado';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return 'Pendiente';
    }
  }

  mensajeEstado(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'Tu pedido fue registrado y está pendiente de confirmación.';
      case 'CONFIRMADO':
        return 'Tu pedido fue confirmado por el administrador. Ya puedes descargar tu comprobante.';
      case 'EN_PREPARACION':
        return 'Tu pedido está siendo preparado.';
      case 'EN_CAMINO':
        return 'Tu pedido está en camino.';
      case 'ENTREGADO':
        return 'Tu pedido fue entregado correctamente. Ya puedes descargar tu comprobante.';
      case 'CANCELADO':
        return 'Tu pedido fue cancelado. No se puede generar comprobante.';
      default:
        return 'Estado del pedido no disponible.';
    }
  }

  puedeDescargarPDF(pedido: any): boolean {
    return (
      pedido.estado === 'CONFIRMADO' ||
      pedido.estado === 'EN_PREPARACION' ||
      pedido.estado === 'EN_CAMINO' ||
      pedido.estado === 'ENTREGADO'
    );
  }

  generarPDF(pedido: any): void {
    if (!this.puedeDescargarPDF(pedido)) {
      this.mostrarToast('El comprobante estará disponible cuando el pedido sea completado');
      return;
    }

    const doc = new jsPDF();

    const fechaPedido = pedido.fecha
      ? new Date(pedido.fecha).toLocaleString()
      : new Date().toLocaleString();

    doc.setFontSize(20);
    doc.text('CyberStore', 14, 18);

    doc.setFontSize(13);
    doc.text('Comprobante de compra', 14, 28);

    doc.setFontSize(10);
    doc.text(`Pedido N°: ${pedido.id}`, 14, 40);
    doc.text(`Fecha del pedido: ${fechaPedido}`, 14, 46);
    doc.text(`Estado: ${pedido.estado}`, 14, 52);

    doc.setFontSize(12);
    doc.text('Datos del cliente', 14, 66);

    doc.setFontSize(10);
    doc.text(`Nombre: ${pedido.nombreCliente || 'No registrado'}`, 14, 76);
    doc.text(`DNI: ${pedido.dni || 'No registrado'}`, 14, 82);
    doc.text(`Teléfono: ${pedido.telefono || 'No registrado'}`, 14, 88);
    doc.text(`Dirección: ${pedido.direccion || 'No registrado'}`, 14, 94);
    doc.text(`Distrito/Ciudad: ${pedido.distrito || 'No registrado'}`, 14, 100);
    doc.text(`Método de pago: ${pedido.metodoPago || 'No registrado'}`, 14, 106);

    if (pedido.observacion) {
      doc.text(`Observación: ${pedido.observacion}`, 14, 112);
    }

    autoTable(doc, {
      startY: pedido.observacion ? 124 : 118,
      head: [['Concepto', 'Detalle']],
      body: [
        ['Pedido', `#${pedido.id}`],
        ['Estado', pedido.estado],
        ['Total pagado', `S/ ${pedido.total}`],
      ],
    });

    const finalY = (doc as any).lastAutoTable.finalY || 145;

    doc.setFontSize(12);
    doc.text(`Total: S/ ${pedido.total}`, 14, finalY + 14);

    doc.setFontSize(10);
    doc.text(
      'Este comprobante fue generado luego de la confirmación del administrador.',
      14,
      finalY + 26,
    );
    doc.text('Gracias por su compra en CyberStore.', 14, finalY + 34);

    doc.save(`comprobante-cyberstore-pedido-${pedido.id}.pdf`);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/pedidos', id]);
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

