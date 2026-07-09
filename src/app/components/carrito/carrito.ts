import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { Carrito as CarritoService } from '../../services/carrito';
import { Pedido } from '../../services/pedido';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-carrito',
  imports: [CommonModule, RouterLink, FormsModule],
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

  datosCompra = {
    nombreCompleto: '',
    dni: '',
    telefono: '',
    direccion: '',
    distrito: '',
    metodoPago: '',
    observacion: '',
  };

  erroresCompra = {
    nombreCompleto: '',
    dni: '',
    telefono: '',
    direccion: '',
    distrito: '',
    metodoPago: '',
  };

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

  validarDatosCompra(): boolean {
    this.erroresCompra = {
      nombreCompleto: '',
      dni: '',
      telefono: '',
      direccion: '',
      distrito: '',
      metodoPago: '',
    };

    let valido = true;

    if (!this.datosCompra.nombreCompleto.trim()) {
      this.erroresCompra.nombreCompleto = 'El nombre completo es obligatorio';
      valido = false;
    }

    if (!this.datosCompra.dni.trim()) {
      this.erroresCompra.dni = 'El DNI es obligatorio';
      valido = false;
    } else if (this.datosCompra.dni.length !== 8) {
      this.erroresCompra.dni = 'El DNI debe tener 8 dígitos';
      valido = false;
    }

    if (!this.datosCompra.telefono.trim()) {
      this.erroresCompra.telefono = 'El teléfono es obligatorio';
      valido = false;
    } else if (this.datosCompra.telefono.length < 9) {
      this.erroresCompra.telefono = 'Ingrese un teléfono válido';
      valido = false;
    }

    if (!this.datosCompra.direccion.trim()) {
      this.erroresCompra.direccion = 'La dirección es obligatoria';
      valido = false;
    }

    if (!this.datosCompra.distrito.trim()) {
      this.erroresCompra.distrito = 'El distrito o ciudad es obligatorio';
      valido = false;
    }

    if (!this.datosCompra.metodoPago) {
      this.erroresCompra.metodoPago = 'Seleccione un método de pago';
      valido = false;
    }

    this.cdr.detectChanges();
    return valido;
  }

  generarPedido(): void {
    if (this.generandoPedido) {
      return;
    }

    if (this.total <= 0 || this.items.length === 0) {
      this.mostrarToast('El carrito está vacío');
      return;
    }

    if (!this.validarDatosCompra()) {
      this.mostrarToast('Complete los datos de compra');
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
      nombreCliente: this.datosCompra.nombreCompleto,
      dni: this.datosCompra.dni,
      telefono: this.datosCompra.telefono,
      direccion: this.datosCompra.direccion,
      distrito: this.datosCompra.distrito,
      metodoPago: this.datosCompra.metodoPago,
      observacion: this.datosCompra.observacion,
    };

    // this.generandoPedido = true;

    this.pedidoService.crear(data).subscribe({
      next: (pedidoCreado) => {
        this.mostrarToast('Pedido generado. Espere confirmación del administrador');
        this.limpiarDatosCompra();


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

  limpiarDatosCompra(): void {
    this.datosCompra = {
      nombreCompleto: '',
      dni: '',
      telefono: '',
      direccion: '',
      distrito: '',
      metodoPago: '',
      observacion: '',
    };

    this.erroresCompra = {
      nombreCompleto: '',
      dni: '',
      telefono: '',
      direccion: '',
      distrito: '',
      metodoPago: '',
    };
  }
  generarPDF(pedido: any): void {
    const doc = new jsPDF();

    const fecha = new Date().toLocaleString();

    doc.setFontSize(18);
    doc.text('CyberStore', 14, 18);

    doc.setFontSize(13);
    doc.text('Comprobante de compra', 14, 28);

    doc.setFontSize(10);
    doc.text(`Fecha: ${fecha}`, 14, 38);
    doc.text(`Pedido N°: ${pedido?.id || 'Generado'}`, 14, 44);

    doc.setFontSize(12);
    doc.text('Datos del cliente', 14, 58);

    doc.setFontSize(10);
    doc.text(`Nombre: ${this.datosCompra.nombreCompleto}`, 14, 68);
    doc.text(`DNI: ${this.datosCompra.dni}`, 14, 74);
    doc.text(`Teléfono: ${this.datosCompra.telefono}`, 14, 80);
    doc.text(`Dirección: ${this.datosCompra.direccion}`, 14, 86);
    doc.text(`Distrito/Ciudad: ${this.datosCompra.distrito}`, 14, 92);
    doc.text(`Método de pago: ${this.datosCompra.metodoPago}`, 14, 98);

    if (this.datosCompra.observacion.trim()) {
      doc.text(`Observación: ${this.datosCompra.observacion}`, 14, 104);
    }

    const productos = this.items.map((item) => [
      item.producto.nombre,
      item.cantidad,
      `S/ ${item.producto.precio}`,
      `S/ ${item.producto.precio * item.cantidad}`,
    ]);

    autoTable(doc, {
      startY: this.datosCompra.observacion.trim() ? 114 : 108,
      head: [['Producto', 'Cantidad', 'Precio', 'Subtotal']],
      body: productos,
    });

    const finalY = (doc as any).lastAutoTable.finalY || 130;

    doc.setFontSize(12);
    doc.text(`Total: S/ ${this.total}`, 14, finalY + 14);

    doc.setFontSize(10);
    doc.text('Gracias por su compra en CyberStore.', 14, finalY + 26);

    doc.save(`comprobante-cyberstore-${pedido?.id || 'pedido'}.pdf`);
  }
}
