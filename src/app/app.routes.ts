import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Layout } from './components/layout/layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Productos } from './components/productos/productos';
import { ProductoDetalle } from './components/producto-detalle/producto-detalle';
import { Carrito } from './components/carrito/carrito';
import { Pedidos } from './components/pedidos/pedidos';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { AdminProductos } from './components/admin-productos/admin-productos';
import { AdminCategorias } from './components/admin-categorias/admin-categorias';
import { AdminUsuarios } from './components/admin-usuarios/admin-usuarios';
import { AdminPedidos } from './components/admin-pedidos/admin-pedidos';

import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard],
  },

  {
    path: '',
    component: Layout,
    children: [
      { path: 'inicio', component: Dashboard },

      { path: 'productos', component: Productos },
      { path: 'productos/:id', component: ProductoDetalle },

      { path: 'carrito', component: Carrito, canActivate: [authGuard] },
      { path: 'pedidos', component: Pedidos, canActivate: [authGuard] },

      {
        path: 'admin/dashboard',
        component: AdminDashboard,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'admin/productos',
        component: AdminProductos,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'admin/categorias',
        component: AdminCategorias,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'admin/usuarios',
        component: AdminUsuarios,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'admin/pedidos',
        component: AdminPedidos,
        canActivate: [authGuard, adminGuard],
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
