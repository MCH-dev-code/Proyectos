# 🔌 API de Componentes y Context

Guía técnica detallada para desarrolladores que trabajan con Robcast.

---

## 🎯 Context API - CarritoContext

### Ubicación
`src/context/CarritoContext.jsx`

### Importar y Usar

```javascript
import { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext.jsx";

export function MiComponente() {
  const {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    totalCarrito,
    cantidadItems
  } = useContext(CarritoContext);

  return (
    <div>
      <p>Items: {cantidadItems}</p>
      <p>Total: ${totalCarrito}</p>
    </div>
  );
}
```

### Métodos Disponibles

#### `agregarAlCarrito(producto)`
Añade un producto al carrito o incrementa su cantidad si ya existe.

**Parámetro:**
- `producto` (Object): Objeto producto con estructura completa

**Ejemplo:**
```javascript
const producto = {
  id: 1,
  nombre: "Laptop Dell",
  precio: 899,
  categoria: "Computadoras",
  ...
};

agregarAlCarrito(producto);
```

#### `eliminarDelCarrito(id)`
Elimina completamente un producto del carrito.

**Parámetro:**
- `id` (number): ID único del producto

**Ejemplo:**
```javascript
eliminarDelCarrito(1);
```

#### `actualizarCantidad(id, cantidad)`
Actualiza la cantidad de un producto. Si la cantidad es ≤ 0, elimina el producto.

**Parámetros:**
- `id` (number): ID del producto
- `cantidad` (number): Nueva cantidad

**Ejemplo:**
```javascript
actualizarCantidad(1, 5);  // Establece cantidad a 5
actualizarCantidad(1, 0);  // Elimina el producto
```

#### `vaciarCarrito()`
Elimina todos los productos del carrito.

**Ejemplo:**
```javascript
vaciarCarrito();
```

### Propiedades Disponibles

#### `carrito`
Array de productos con cantidad.

**Tipo:** `Array<{...producto, cantidad: number}>`

```javascript
carrito.forEach(item => {
  console.log(`${item.nombre}: ${item.cantidad}x`);
});
```

#### `totalCarrito`
Total de la compra calculado automáticamente.

**Tipo:** `number`

```javascript
console.log(`Total: $${totalCarrito}`);
```

#### `cantidadItems`
Cantidad total de items en el carrito (suma de cantidades).

**Tipo:** `number`

```javascript
const badge = cantidadItems > 0 ? cantidadItems : "";
```

---

## 📄 Componente Principal

### Principal.jsx

#### Responsabilidades
- **Enrutamiento:** Maneja qué página mostrar
- **Estado Global:** Búsqueda y categoría
- **Props Drilling:** Distribuye callbacks a componentes

#### Estados

```javascript
const [paginaActual, setPaginaActual] = useState("inicio");
// "inicio" | "tienda" | "nosotros" | "contacto"

const [busquedaHeader, setBusquedaHeader] = useState("");
// String de búsqueda

const [categoriaFiltro, setCategoriaFiltro] = useState(null);
// null | "Computadoras" | "Laptops" | ...
```

#### Función Clave: `renderPagina()`

```javascript
const renderPagina = () => {
  switch (paginaActual) {
    case "inicio":
      return <Inicio 
        onNavigate={setPaginaActual} 
        onCategoryClick={setCategoriaFiltro} 
      />;
    case "tienda":
      return <Tienda 
        busquedaInicial={busquedaHeader} 
        categoriaSeleccionada={categoriaFiltro} 
      />;
    // ... más casos
  }
};
```

---

## 🎨 Componente Header

### Header.jsx

#### Props

```javascript
Header.propTypes = {
  onNavigate: PropTypes.func.isRequired,    // (pageId: string) => void
  onSearch: PropTypes.func.isRequired       // (searchTerm: string) => void
};
```

#### Ejemplo de Uso

```javascript
<Header 
  onNavigate={(page) => setPaginaActual(page)}
  onSearch={(term) => setBusquedaHeader(term)}
/>
```

#### Estados Internos

```javascript
const [mostrar, setMostrar] = useState(false);  // Dropdown carrito
```

#### Elementos Clave

1. **Logo/Branding:** Clickeable → navega a inicio
2. **Barra de búsqueda:** Enter → ejecuta búsqueda
3. **Carrito:** 
   - Badge con cantidad
   - Dropdown con lista de productos
   - Botones +/- para cantidad
   - Botón WhatsApp
4. **Responsive:** Mobile menu en sm

---

## 🧭 Componente Navbar

### Navbar.jsx

#### Props

```javascript
Navbar.propTypes = {
  paginaActual: PropTypes.string.isRequired,
  setPaginaActual: PropTypes.func.isRequired
};
```

#### Botones Disponibles

- **Inicio:** page="inicio"
- **Tienda:** page="tienda"
- **Nosotros:** page="nosotros"
- **Contacto:** page="contacto"

#### Ejemplo

```javascript
<Navbar 
  paginaActual={paginaActual} 
  setPaginaActual={setPaginaActual}
/>
```

---

## 🏠 Componente Inicio

### Inicio.jsx

#### Props

```javascript
Inicio.propTypes = {
  onNavigate: PropTypes.func.isRequired,      // (pageId: string) => void
  onCategoryClick: PropTypes.func.isRequired   // (category: string) => void
};
```

#### Layout

```
Inicio
├── Main (max-width-7xl)
│   ├── Grid 3 columnas (1 móvil)
│   │   ├── Col 1: Sidebar
│   │   └── Col 2: Flyer
│   └── CategoryCards
├── Brands
└── ProductCatalog (8 productos fijos)
```

#### Ejemplo de Uso

```javascript
<Inicio 
  onNavigate={setPaginaActual}
  onCategoryClick={setCategoriaFiltro}
/>
```

---

## 📂 Componente Sidebar

### Sidebar.jsx

#### Props

```javascript
Sidebar.propTypes = {
  onNavigate: PropTypes.func.isRequired,      // () => void (navega a tienda)
  onCategoryClick: PropTypes.func.isRequired   // (category: string) => void
};
```

#### Categorías Disponibles

```javascript
const categorias = [
  "Computadoras", 
  "Laptops", 
  "Monitores", 
  "Accesorios", 
  "Impresoras", 
  "Bocinas", 
  "Sillas", 
  "Soporte Técnico"
];
```

#### Comportamiento

```
Usuario hace clic en categoría
  ↓
handleCategoryClick(categoria)
  ├─ onCategoryClick(categoria)           // Guarda en Principal
  └─ onNavigate("tienda")               // Navega a Tienda
```

---

## 🛍️ Componente Tienda

### Tienda.jsx

#### Props

```javascript
Tienda.propTypes = {
  busquedaInicial: PropTypes.string,           // De Header
  categoriaSeleccionada: PropTypes.string      // De Inicio
};
```

#### Estados Internos

```javascript
const [busqueda, setBusqueda] = useState(busquedaInicial);
const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
const [vista, setVista] = useState("todas");           // ofertas, mas-vendidos, combos
const [ordenamiento, setOrdenamiento] = useState("destacados");
const [paginaActual, setPaginaActual] = useState(1);
const [mostrarCarrito, setMostrarCarrito] = useState(false);
```

#### UEffect Hooks

```javascript
// Sincroniza búsqueda del Header
useEffect(() => {
  if (busquedaInicial) {
    setBusqueda(busquedaInicial);
    setPaginaActual(1);
  }
}, [busquedaInicial]);

// Sincroniza categoría de Inicio
useEffect(() => {
  if (categoriaSeleccionada) {
    setCategoriaSeleccionada(categoriaSeleccionada);
    setPaginaActual(1);
  }
}, [categoriaSeleccionada]);
```

#### Vistas Disponibles

| Vista | Valor | Filtro |
|-------|-------|--------|
| Todos | "todas" | Ninguno |
| Ofertas | "ofertas" | `esOferta === true` |
| Más Vendidos | "mas-vendidos" | `esMasVendido === true` |
| Combos | "combos" | `esCombo === true` |

#### Opciones de Ordenamiento

```javascript
const opciones = [
  { value: "destacados", label: "Destacados" },
  { value: "precio-menor", label: "Menor Precio" },
  { value: "precio-mayor", label: "Mayor Precio" },
  { value: "rating", label: "Mayor Rating" }
];
```

#### Estructura de Productos

```javascript
const productos = [
  {
    id: 1,
    nombre: "Laptop Dell Inspiron 15",
    precio: 899,
    descuentoPrecio: 799,           // Opcional, para ofertas
    categoria: "Computadoras",
    imagen: "https://...",
    stock: 5,
    descripcion: "Procesador i7, 8GB RAM, SSD 512GB",
    rating: 4.5,
    esOferta: true,
    esMasVendido: true,
    esCombo: false
  },
  // ... más productos
];
```

#### Paginación

```javascript
const productosPerPagina = 12;
const totalPaginas = Math.ceil(productosFiltrados.length / productosPerPagina);
const inicio = (paginaActual - 1) * productosPerPagina;
const productosActuales = productosFiltrados.slice(inicio, inicio + productosPerPagina);
```

---

## 📦 Componente ProductCatalog

### ProductCatalog.jsx

#### Props
Ninguna (componente de presentación fija)

#### Características

- Muestra 8 productos fijos
- Sin filtrado
- Botones WhatsApp
- Grid responsive

#### Ejemplo de Uso

```javascript
<ProductCatalog />
```

---

## 🔗 Flujo de Props y Estado

### Búsqueda

```
Header (barra entrada)
  ↓ onChange → setBusquedaHeader
  ↓
Principal (estado: busquedaHeader)
  ↓ [prop]
Tienda (recibe: busquedaInicial)
  ↓
useEffect → setBusqueda() → filtra productos
```

### Categoría

```
Sidebar (botón categoría)
  ↓ onClick → onCategoryClick(cat)
  ↓
Principal (setCategoriaFiltro)
  ↓ [prop]
Tienda (recibe: categoriaSeleccionada)
  ↓
useEffect → setCategoriaSeleccionada() → filtra productos
```

### Carrito

```
ProductCard (botón "Agregar")
  ↓ onClick → agregarAlCarrito(producto)
  ↓
CarritoContext (actualiza carrito[])
  ↓
Header (badge cantidadItems)
Tienda (sidebar carrito)
ambos sincronizados automáticamente
```

---

## ✅ Checklist para Agregar Nuevos Componentes

- [ ] Crear archivo en `src/components/`
- [ ] Importar en `Principal.jsx` si es página
- [ ] Añadir caso en `renderPagina()` si es página
- [ ] Documentar props en comentarios
- [ ] Usar Tailwind para estilos
- [ ] Hacer responsive (sm:, md:, lg:)
- [ ] Probar en mobile
- [ ] Exportar como default
- [ ] Actualizar documentación

---

## 🐛 Debugging

### Ver estado del carrito
```javascript
const context = useContext(CarritoContext);
console.log("Carrito:", context.carrito);
console.log("Total:", context.totalCarrito);
console.log("Items:", context.cantidadItems);
```

### Ver página activa
```javascript
console.log("Página:", paginaActual);
```

### Ver búsqueda
```javascript
console.log("Búsqueda header:", busquedaHeader);
```

---

## 📋 Estructura de Carpetas para Expandir

```
src/
├── components/
│   ├── Pages/              (← páginas grandes)
│   │   ├── Inicio.jsx
│   │   ├── Tienda.jsx
│   │   └── ...
│   ├── Shared/             (← componentes reutilizables)
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ...
│   └── Features/           (← features específicas)
│       ├── ProductCard.jsx
│       └── CartDropdown.jsx
├── context/
│   ├── CarritoContext.jsx
│   └── AuthContext.jsx     (← future)
├── hooks/                  (← custom hooks)
│   └── useCart.js
├── utils/                  (← helpers)
│   └── formatPrice.js
└── constants/              (← constantes)
    └── categories.js
```

---

## 🚀 Performance Tips

1. **Memoización:** Usar `React.memo()` en ProductCard
2. **useCallback:** Para callbacks en filtros
3. **Lazy Loading:** Para componentes pesados
4. **Code Splitting:** Vite maneja automáticamente

Ejemplo:
```javascript
const ProductCard = React.memo(({ producto, onAdd }) => {
  const handleClick = useCallback(() => {
    onAdd(producto);
  }, [producto, onAdd]);

  return (
    <div onClick={handleClick}>
      {/* contenido */}
    </div>
  );
});
```

---

**Última actualización:** Febrero 2026
