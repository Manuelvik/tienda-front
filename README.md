# CyberStore - Frontend

## Descripción

CyberStore es un sistema web de venta de productos tecnológicos.  
Este repositorio contiene el frontend desarrollado con Angular, encargado de mostrar las interfaces del sistema, consumir las APIs REST del backend y permitir la interacción de usuarios y administradores.

El sistema permite visualizar productos, registrarse, iniciar sesión, agregar productos al carrito, generar pedidos, revisar el estado de las compras y administrar la tienda desde un panel administrativo.

---

## Tecnologías utilizadas

- Angular
- TypeScript
- HTML
- CSS
- Bootstrap Icons
- JWT
- jsPDF
- Vercel

---

## Arquitectura del frontend

El frontend está organizado mediante componentes, servicios, rutas y guards.

```text
src/app
│
├── components
│   ├── login
│   ├── register
│   ├── layout
│   ├── dashboard
│   ├── productos
│   ├── producto-detalle
│   ├── carrito
│   ├── pedidos
│   ├── pedido-detalle
│   ├── admin-dashboard
│   ├── admin-productos
│   ├── admin-categorias
│   ├── admin-usuarios
│   └── admin-pedidos
│
├── services
│   ├── auth
│   ├── producto
│   ├── categoria
│   ├── usuario
│   ├── carrito
│   ├── pedido
│   └── reporte
│
├── guards
│   ├── auth-guard
│   ├── admin-guard
│   └── guest-guard
│
└── app.routes.ts



Funcionalidades del usuario

El usuario cliente puede:

Ver la página de inicio pública.
Ver el catálogo de productos.
Filtrar productos por categoría.
Buscar productos.
Ver detalle de producto.
Registrarse e iniciar sesión.
Agregar productos al carrito.
Modificar cantidades del carrito.
Generar pedidos con datos de compra.
Consultar sus pedidos.
Ver detalle del pedido.
Visualizar seguimiento del estado del pedido.
Descargar comprobante PDF cuando la compra está confirmada.
Funcionalidades del administrador

El administrador puede:

Iniciar sesión con rol ADMIN.
Acceder al panel administrativo.
Ver resumen general del sistema.
Gestionar productos.
Subir imágenes de productos.
Gestionar categorías.
Gestionar usuarios.
Gestionar pedidos.
Cambiar estados del pedido.


Rutas principales
Rutas públicas
/inicio
/productos
/productos/:id
/login
/register
Rutas protegidas del usuario
/carrito
/pedidos
/pedidos/:id
Rutas protegidas del administrador
/admin/dashboard
/admin/productos
/admin/categorias
/admin/usuarios
/admin/pedidos
Guards implementados
authGuard: protege rutas que requieren inicio de sesión.
adminGuard: protege rutas exclusivas del administrador.
guestGuard: evita que un usuario logueado vuelva al login o registro.
Servicios Angular
Servicio	Función
Auth	Gestiona login, registro, token, rol y cierre de sesión
Producto	Consume APIs de productos
Categoria	Consume APIs de categorías
Usuario	Consume APIs de usuarios
Carrito	Consume APIs del carrito
Pedido	Consume APIs de pedidos y estados
Reporte	Consume API de reportes
Estados del pedido

El sistema maneja los siguientes estados:

PENDIENTE
CONFIRMADO
EN_PREPARACION
EN_CAMINO
ENTREGADO
CANCELADO

El comprobante PDF se puede descargar cuando el pedido está en estado:

CONFIRMADO
EN_PREPARACION
EN_CAMINO
ENTREGADO
Conexión con el backend

El frontend consume el backend desplegado en Railway:

https://tienda-production-856f.up.railway.app



Manual básico de usuario
Ingresar al sistema.
Ver el catálogo de productos.
Iniciar sesión o registrarse.
Agregar productos al carrito.
Completar datos de compra.
Generar pedido.
Revisar el estado en Mis pedidos.
Descargar comprobante cuando el pedido sea confirmado.



Manual básico de administrador
Iniciar sesión como ADMIN.
Entrar al panel administrativo.
Registrar productos y categorías.
Revisar usuarios.
Revisar pedidos generados.
Cambiar el estado del pedido.
Confirmar, preparar, enviar o cancelar pedidos.


Autores

Victor Flores
Jade Medina
Marco Leon