import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { Producto } from '../../services/producto';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  productosDestacados: any[] = [];
  cargando = true;

  apiBaseUrl = 'https://tienda-production-856f.up.railway.app';

  constructor(
    private productoService: Producto,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarProductosDestacados();
  }

  cargarProductosDestacados(): void {
    this.productoService.listar().subscribe({
      next: (data) => {
        this.productosDestacados = data.slice(0, 4);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.productosDestacados = [];
        this.cargando = false;
        this.cdr.detectChanges();
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

  verDetalle(id: number): void {
    this.router.navigate(['/productos', id]);
  }
}
