# 📚 Documentación Robcast - E-Commerce

## 📋 Tabla de Contenidos
1. [Visión General](#visión-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Arquitectura y State Management](#arquitectura-y-state-management)
4. [Componentes](#componentes)
5. [Funcionalidades](#funcionalidades)
6. [Guía de Instalación](#guía-de-instalación)
7. [Comandos Disponibles](#comandos-disponibles)
8. [Flujos de Uso](#flujos-de-uso)
9. [Context API - Carrito](#context-api---carrito)

---

## 🎯 Visión General

**Robcast** es una plataforma de e-commerce moderna desarrollada con **React + Vite** y **Tailwind CSS**. Proporciona una experiencia de compra completa con catálogo de productos, carrito de compras sincronizado, búsqueda, filtrado por categorías y más.

### Características Principales:
- ✅ Navegación multi-página sin recargas (SPA)
- ✅ Carrito de compras global con Context API
- ✅ Sistema de búsqueda avanzado
- ✅ Filtrado por categorías y vistas (Ofertas, Más Vendidos, Combos)
- ✅ Ordenamiento de productos (precio, rating)
- ✅ Paginación (12 productos por página)
- ✅ Integración con WhatsApp para compras
- ✅ Diseño responsivo mobile-first
- ✅ Sincronización de estado entre componentes

---

## 📁 Estructura del Proyecto

```
robcast/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Barra superior con logo, búsqueda, carrito
│   │   ├── Navbar.jsx          # Menú de navegación principal
│   │   ├── Inicio.jsx          # Página de inicio/home
│   │   ├── Tienda.jsx          # Página de tienda con catálogo completo
│   │   ├── Nosotros.jsx        # Página about
│   │   ├── Contacto.jsx        # Página de contacto
│   │   ├── Footer.jsx          # Pie de página
│   │   ├── Sidebar.jsx         # Filtro de categorías (Inicio)
│   │   ├── ProductCatalog.jsx  # Grid de productos (Inicio)
│   │   ├── Flyer.jsx           # Banner promocional
│   │   ├── CategoryCards.jsx   # Tarjetas de categorías
│   │   └── Brands.jsx          # Sección de marcas
│   ├── context/
│   │   └── CarritoContext.jsx  # Context API para carrito global
│   ├── Principal.jsx           # Componente raíz, enrutador
│   ├── main.jsx                # Punto de entrada
│   ├── App.css                 # Estilos personalizados
│   └── index.css               # Estilos globales
├── public/                     # Assets estáticos
├── package.json               # Dependencias y scripts
├── vite.config.js             # Configuración Vite
├── tailwind.config.js         # Configuración Tailwind CSS
└── README.md                  # Documentación básica
```

---

## 🏗️ Arquitectura y State Management

### Estado Global - Principal.jsx

El componente raíz `Principal.jsx` gestiona tres estados principales:

```javascript
const [paginaActual, setPaginaActual] = useState("inicio");      // Página activa
const [busquedaHeader, setBusquedaHeader] = useState("");        // Búsqueda del Header
const [categoriaFiltro, setCategoriaFiltro] = useState(null);    // Categoría preseleccionada
```

**Flujo de Estado:**
```
Principal (raíz)
├── Header
│   └── setBusquedaHeader() → busquedaInicial → Tienda
├── Navbar
│   └── setPaginaActual() → renderiza página activa
├── Inicio
│   └── Sidebar
│       ├── onCategoryClick(cat) → setCategoriaFiltro()
│       └── onNavigate("tienda") → setPaginaActual()
├── Tienda
│   ├── busquedaInicial (prop)
│   └── categoriaSeleccionada (prop)
└── Nosotros/Contacto
```

### Context API - Carrito Global

Centraliza la gestión del carrito de compras usando React Context.

**Ubicación:** `src/context/CarritoContext.jsx`

**Estado disponible:**
- `carrito` - Array de productos en el carrito
- `agregarAlCarrito(producto)` - Añade o incrementa cantidad
- `eliminarDelCarrito(id)` - Elimina producto
- `actualizarCantidad(id, cantidad)` - Actualiza cantidad
- `vaciarCarrito()` - Vacía carrito
- `totalCarrito` - Total calculado
- `cantidadItems` - Cantidad de items

**Uso en componentes:**
```javascript
const { carrito, agregarAlCarrito, totalCarrito } = useContext(CarritoContext);
```

---

## 🧩 Componentes

### Principal.jsx (Raíz)
**Función:** Enrutador central, gestor de estado global
- Maneja navegación entre páginas
- Gestiona búsqueda y categorías
- Envuelve app en CarritoProvider

### Header.jsx
**Función:** Barra superior de navegación
- Logo/Branding
- Barra de búsqueda
- Botón carrito con dropdown
- Información de contacto (responsive)

**Props:**
- `onNavigate(pageId)` - Navega a página
- `onSearch(searchTerm)` - Ejecuta búsqueda

### Navbar.jsx
**Función:** Menú de navegación principal
- Botones: Inicio, Tienda, Nosotros, Contacto
- Estados activos visuales
- Responsive hamburger menu

**Props:**
- `paginaActual` - Página activa
- `setPaginaActual` - Cambiar página

### Inicio.jsx (Home)
**Función:** Página de inicio
- Combina Sidebar + Flyer en grid
- Muestra CategoryCards
- Brands section
- ProductCatalog (8 productos)

**Props:**
- `onNavigate(page)` - Callback para navegación
- `onCategoryClick(categoria)` - Callback selección categoría

### Sidebar.jsx
**Función:** Filtro de categorías
- 8 categorías: Computadoras, Laptops, Monitores, etc.
- Toggle móvil
- Redirige a Tienda al seleccionar

**Props:**
- `onNavigate` - Navega a Tienda
- `onCategoryClick` - Guarda categoría seleccionada

### Tienda.jsx (Shop)
**Función:** Catálogo completo de productos
- 21 productos de 6 categorías
- Búsqueda integrada
- 4 vistas: Todos, Ofertas, Más Vendidos, Combos
- Filtros por categoría
- Ordenamiento (precio, rating)
- Paginación (12/página)
- Carrito sincronizado

**Props:**
- `busquedaInicial` - Búsqueda del Header
- `categoriaSeleccionada` - Categoría preseleccionada

**Estados internos:**
```javascript
const [busqueda, setBusqueda] = useState(busquedaInicial);
const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
const [vista, setVista] = useState("todas");        // ofertas, mas-vendidos, combos
const [ordenamiento, setOrdenamiento] = useState("destacados");
const [paginaActual, setPaginaActual] = useState(1);
```

### ProductCatalog.jsx
**Función:** Grid de productos en Inicio
- Muestra 8 productos fijos
- Sin filtrado (siempre iguales)
- Botones WhatsApp

### Contacto.jsx
**Función:** Página de contacto
- Formulario de contacto
- Campos: nombre, email, teléfono, asunto, mensaje

### Nosotros.jsx
**Función:** Página sobre la empresa
- Información de la empresa
- Misión y valores

### Footer.jsx
**Función:** Pie de página
- Links útiles
- Información legal
- Redes sociales

### Flyer.jsx
**Función:** Banner promocional
- Carrusel de imágenes (si aplica)
- Call to action

### CategoryCards.jsx
**Función:** Tarjetas de categorías
- Muestra 6 categorías principales
- Cada una con imagen/icon

### Brands.jsx
**Función:** Sección de marcas
- Logos de marcas asociadas

---

## ⚡ Funcionalidades

### 1. Sistema de Navegación SPA
- Navegación sin recargas de página
- 4 páginas: Inicio, Tienda, Nosotros, Contacto
- Estado managedo en `Principal.jsx`

### 2. Búsqueda Avanzada
- **Header:** Busca en todos los productos de Tienda
- **Tienda:** Búsqueda adicional en tiempo real
- Busca por nombre y descripción

### 3. Filtrado por Categorías
- **Inicio:** Botones Sidebar redirigen a Tienda con categoría preseleccionada
- **Tienda:** Filtros independientes + categoría desde Inicio
- 6 categorías principales + "Todos"

### 4. Vistas de Productos (Tienda)
- **Todos:** Todos los productos
- **Ofertas (🔥):** Productos con descuento
- **Más Vendidos (⭐):** TOP sellers
- **Combos (📦):** Productos en combo

### 5. Ordenamiento
- Destacados (default)
- Precio menor → mayor
- Precio mayor → menor
- Por rating

### 6. Carrito Global
- Sincronizado entre Header y Tienda
- Agregar/eliminar productos
- Actualizar cantidades
- Total calculado automáticamente
- Integración WhatsApp

### 7. Paginación
- 12 productos por página
- Buttons para navegar
- Reset en cambios de filtro

### 8. Integración WhatsApp
- Mensaje preformateado con producto
- Abre directamente en WhatsApp
- Disponible en botones de carrito

---

## 📦 Guía de Instalación

### Requisitos
- Node.js 18+
- npm o yarn

### Pasos

1. **Clonar el repositorio:**
```bash
git clone <repo-url>
cd Robcast
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar desarrollo:**
```bash
npm run dev
```
La app estará en `http://localhost:5173`

4. **Build para producción:**
```bash
npm run build
```

5. **Preview de build:**
```bash
npm run preview
```

---

## 🔧 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con HMR |
| `npm run build` | Build para producción |
| `npm run preview` | Preview del build |
| `npm run lint` | Ejecuta ESLint |

---

## 🚀 Flujos de Uso

### Flujo 1: Navegar por el Sitio
1. Usuario ve **Inicio** con productos destacados
2. Hace clic en **Navbar** → Navega a cualquier página sin reload
3. Cada página mantiene su estado

### Flujo 2: Búsqueda desde Header
1. Usuario escribe en barra de búsqueda
2. Presiona Enter → Navega a **Tienda**
3. Resultados filtrados automáticamente
4. Puede refinar con filtros adicionales

### Flujo 3: Seleccionar Categoría en Inicio
1. Usuario ve **Sidebar** en Inicio
2. Hace clic en categoría (ej: "Computadoras")
3. Se guarda la categoría en estado
4. Navega a **Tienda** automáticamente
5. Productos filtrados por esa categoría

### Flujo 4: Comprar Producto
1. Usuario navega a **Tienda**
2. Localiza producto deseado
3. Hace clic en **"Agregar al Carrito"**
4. Carrito se actualiza (visible en Header)
5. Puede:
   - Seguir comprando
   - Ver carrito (dropdown en Header)
   - Aumentar/disminuir cantidad
   - Eliminar producto
   - Contactar por WhatsApp

### Flujo 5: Compra Final
1. Usuario revisa carrito en Header
2. Hace clic en **"💬 WhatsApp"**
3. Se abre WhatsApp con mensaje preformateado
4. Completa compra por WhatsApp

### Flujo 6: Filtrado Avanzado en Tienda
1. Usuario en **Tienda**
2. Usa filtros: busca, categoría, vista, ordenamiento
3. Resultados actualizan en tiempo real
4. Paginación ajusta automáticamente
5. Puede combinar múltiples filtros

---

## 📊 Estructura de Datos

### Producto (Tienda)
```javascript
{
  id: number,
  nombre: string,
  precio: number,
  descuentoPrecio?: number,
  categoria: string,
  imagen: string,
  stock: number,
  descripcion: string,
  rating: number,
  esOferta: boolean,
  esMasVendido: boolean,
  esCombo: boolean
}
```

### Producto en Carrito
```javascript
{
  ...producto,
  cantidad: number
}
```

### Categorías Disponibles
- Computadoras
- Laptops
- Monitores
- Accesorios
- Impresoras
- Bocinas
- Sillas
- Soporte Técnico

---

## 🎨 Estilos

**Framework CSS:** Tailwind CSS v4.1+

**Colores principales:**
- Primario: Blue (#003d7a, #0066cc)
- Secundario: Green (#22c55e para WhatsApp)
- Acentos: Red (#dc2626 ofertas), Orange (#ff9900)

**Responsive:**
- Mobile-first approach
- Breakpoints: sm, md, lg

---

## 🔄 Estado de Props y Callbacks

### Principal → Componentes

```
Principal
├── Header
│   ├── props: onNavigate, onSearch
│   └── callbacks: setBusquedaHeader, setPaginaActual
├── Navbar
│   ├── props: paginaActual, setPaginaActual
│   └── callbacks: setPaginaActual
├── Inicio
│   ├── props: onNavigate, onCategoryClick
│   └── Sidebar
│       ├── props: onNavigate, onCategoryClick
│       └── callbacks: setCategoriaFiltro, setPaginaActual
├── Tienda
│   ├── props: busquedaInicial, categoriaSeleccionada
│   ├── useEffect para sincronizar
│   └── useContext(CarritoContext)
```

---

## 📝 Notas Importantes

1. **Carrito sincronizado:** El contexto de carrito funciona globalmente, por lo que cualquier cambio en Header se refleja en Tienda y viceversa.

2. **Búsqueda independiente:** La búsqueda del Header es independiente de la búsqueda interna de Tienda para mayor flexibilidad.

3. **Categoría preseleccionada:** Cuando desde Inicio se selecciona una categoría, se pasa como prop a Tienda y se aplica automáticamente gracias a `useEffect`.

4. **Sin persistencia:** Los datos del carrito NO se persisten (no hay localStorage). Se limpian al recargar.

5. **Mobile responsive:** Todos los componentes son completamente responsivos con diseño mobile-first.

---

## 🐛 Troubleshooting

### Carrito no se sincroniza
- Verificar que el componente esté dentro de `<CarritoProvider>`
- Revisar que use `useContext(CarritoContext)`

### Búsqueda no funciona
- Verificar que la búsqueda content en Header use `onSearch` prop
- En Tienda, verificar que `busquedaInicial` sea pasada como prop

### Categoría no preselecciona
- Checkar que `categoriaSeleccionada` sea pasada como prop a Tienda
- Verificar que Tienda tenga el `useEffect` que sincroniza

### Mobile no se ve bien
- Revisar clases Tailwind responsive (sm:, md:, lg:)
- Testear en DevTools

---

## 📫 Información de Contacto (dentro de la app)
- Dirección: Calle 6ta No. 45 Mi hogar, Santo Domingo Este
- Teléfono: +1(809) 594-6269
- Email: ventas@robcast.com.do

---

## 👨‍💻 Stack Tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 19.2.0 | UI Framework |
| Vite | 8.0.0+ | Build tool & Dev server |
| Tailwind CSS | 4.1.18 | Styling |
| React Hooks | Built-in | State management |
| Context API | Built-in | Global state |
| ESLint | 9.39.1 | Linting |

---

**Última actualización:** Febrero 2026
**Versión:** 1.0.0
