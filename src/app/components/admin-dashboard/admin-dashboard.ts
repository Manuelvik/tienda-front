import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reporte } from '../../services/reporte';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  resumen: any = null;
  cargando = true;
  mensaje = '';

  constructor(
    private reporteService: Reporte,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen(): void {
    this.cargando = true;
    this.mensaje = '';

    this.reporteService.resumen().subscribe({
      next: (data) => {
        this.resumen = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensaje = 'No se pudo cargar el resumen del dashboard';
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  porcentaje(valor: number, total: number): number {
    if (!total || total === 0) {
      return 0;
    }

    return Math.round((valor / total) * 100);
  }

  obtenerTotalPedidos(): number {
    return this.resumen?.totalPedidos || 0;
  }

  obtenerTotalProductos(): number {
    return this.resumen?.totalProductos || 0;
  }

  obtenerTotalUsuarios(): number {
    return this.resumen?.totalUsuarios || 0;
  }
}
