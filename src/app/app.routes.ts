import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Layout } from './components/layout/layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Productos } from './components/productos/productos';
import { Carrito } from './components/carrito/carrito';
import { Pedidos } from './components/pedidos/pedidos';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { AdminProductos } from './components/admin-productos/admin-productos';
import { AdminCategorias } from './components/admin-categorias/admin-categorias';
import { AdminUsuarios } from './components/admin-usuarios/admin-usuarios';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: '',
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'productos', component: Productos },
      { path: 'carrito', component: Carrito },
      { path: 'pedidos', component: Pedidos },
      { path: 'admin/dashboard', component: AdminDashboard },
      { path: 'admin/productos', component: AdminProductos },
      { path: 'admin/categorias', component: AdminCategorias },
      { path: 'admin/usuarios', component: AdminUsuarios },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
