# NovaShop - Tienda Virtual

NovaShop es una tienda virtual desarrollada como proyecto académico. Permite visualizar productos de una API externa, buscar artículos, filtrar por categorías y administrar un carrito de compras.

## Descripción

El proyecto consume los productos de FakeStoreAPI mediante Fetch API. Presenta una interfaz moderna, adaptable a diferentes dispositivos y con opciones para cambiar entre modo claro y oscuro.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- FakeStoreAPI
- Fetch API
- LocalStorage
- Font Awesome

## Funcionalidades

- Visualización de productos desde FakeStoreAPI.
- Búsqueda de productos por nombre.
- Filtro por categorías.
- Ordenamiento por precio y valoración.
- Ventana con detalles de cada producto.
- Carrito de compras.
- Agregar y eliminar productos del carrito.
- Cálculo automático del total.
- Guardado del carrito mediante LocalStorage.
- Modo claro y oscuro.
- Diseño responsive.
- Botón para volver al inicio.

## API utilizada

[FakeStoreAPI](https://fakestoreapi.com/)

Endpoint de productos:

`https://fakestoreapi.com/products`

## Instalación y ejecución

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto.
3. Ejecutar el archivo `index.html` en un navegador.
4. Tener conexión a Internet para cargar los productos desde la API.

## Estructura del proyecto

```text
FakeStoreAPI/
│
├── index.html
├── style.css
├── script.js
└── README.md