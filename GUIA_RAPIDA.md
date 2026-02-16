# 🗺️ Guía Rápida y Diagramas de Arquitectura

---

## ⚡ Quick Start (30 segundos)

1. **Instalar:**
```bash
npm install
```

2. **Ejecutar:**
```bash
npm run dev
```

3. **Ver en:** `http://localhost:5173`

---

## 📐 Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                     Principal (Raíz)                      │
│  Estado: paginaActual, busquedaHeader, categoriaFiltro  │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   ┌─────────┐         ┌────────┐         ┌──────────┐
   │ Header  │────Búsqueda────→│ Navbar │         │CarritoProvider│
   │         │                 │        │         │  CarritoContext│
   └─────────┘                 └────────┘         └──────────┘
        │                          │                    ▲
        │                          ▼                    │
        │                   ┌──────────────┐      Sincronización
        │                   │ Página Actual│      Global
        │                   ├──────────────┤
        │                   │   - Inicio   │◄─────────┐
        │                   │   - Tienda   │          │
        │                   │   - Nosotros │          │
        │                   │   - Contacto │          │
        │                   └──────────────┘          │
        │                                              │
        ├──────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos - Búsqueda

```
                    Header
                      │
                      │ onSearch(término)
                      ▼
            Principal.setBusquedaHeader
                      │
                      │ Como prop: busquedaInicial
                      ▼
                    Tienda
                      │
                      │ useEffect(busquedaInicial)
                      ▼
              setBusqueda(inicial)
                      │
                      ▼
          Filtra productos en tiempo real
                      │
                      ▼
            Muestra resultados filtrados
```

---

## 🎯 Flujo de Datos - Categoría (Inicio → Tienda)

```
       Sidebar (en Inicio)
            │
            │ onClick categoría
            ▼
     handleCategoryClick(categoria)
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
onCategoryClick  onNavigate
    │                │
    ▼                ▼
Principal.setCategoriaFiltro  Principal.setPaginaActual
    │                │
    │                ▼
    │           Navega a Tienda
    │                │
    └────────────────┤
                     ▼
              Tienda (recibe como prop)
                     │
                     │ useEffect(categoriaSeleccionada)
                     ▼
            setCategoriaSeleccionada(cat)
                     │
                     ▼
              Filtra por categoría
                     │
                     ▼
           Muestra productos filtrados
```

---

## 🛒 Flujo del Carrito (Global)

```
       ProductCard (Tienda)
            │
            │ onClick "Agregar"
            ▼
    agregarAlCarrito(producto)
            │
            ▼
    CarritoContext.setCarrito()
            │
    ┌───────┴───────┐
    │               │
    ▼               ▼
Header           Tienda
(carrito         (carrito
dropdown)        sidebar)
    │               │
    │ Sincroniza    │
    │ automáticamente
    │               │
    ▼               ▼
Badge cantidad  Lista items
Dropdown items  Qty controls
+/- buttons     +/- buttons
WhatsApp btn    WhatsApp btn
```

---

## 📱 Estructura de Página - Inicio

```
┌─────────────────────────────────────┐
│           Header                    │
│  Logo | Búsqueda | Carrito | Móvil │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           Navbar                    │
│  Inicio | Tienda | Nosotros | Contacto
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│          Main Content               │
│ ┌────────────┬──────────────────┐  │
│ │  Sidebar   │    Flyer         │  │
│ │ Categorías │   Banner         │  │
│ │ - Compuadoras│              │  │
│ │ - Laptops  │    Promoción     │  │
│ │ - Monitores│                │  │
│ │ ...        │                │  │
│ └────────────┴──────────────────┘  │
│ ┌─────────────────────────────────┐│
│ │  CategoryCards                  ││
│ │  6 Tarjetas de categorías       ││
│ └─────────────────────────────────┘│
│ ┌─────────────────────────────────┐│
│ │  Brands                         ││
│ │  Logos de marcas                ││
│ └─────────────────────────────────┘│
│ ┌─────────────────────────────────┐│
│ │  ProductCatalog                 ││
│ │  Grid 2/3/4 cols (8 productos) ││
│ └─────────────────────────────────┘│
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           Footer                    │
│  Links | Legal | Contact Info      │
└─────────────────────────────────────┘
```

---

## 📱 Estructura de Página - Tienda

```
┌─────────────────────────────────────┐
│           Header                    │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           Navbar                    │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│          Main (Tienda)              │
│  ┌──────────────────────────────┐  │
│  │  "Tienda Robcast"            │  │
│  │  Catálogo completo...        │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │ 📦 🔥 ⭐ 📦  [Botones Vistas]│  │
│  └──────────────────────────────┘  │
│  ┌──────────────┬──────────────┐  │
│  │   Filtros    │  Productos   │  │
│  ├──────────────┤              │  │
│  │ Búsqueda     │ Grid 2/3/4   │  │
│  │ Categorías   │ 12 productos │  │
│  │ Ordenamiento │ por página   │  │
│  │              │              │  │
│  │ Todos ✓      │ ProductCard  │  │
│  │ Computadoras │ ProductCard  │  │
│  │ Monitores    │ ProductCard  │  │
│  │ ...          │ ...          │  │
│  │              │              │  │
│  │              │ [Paginación] │  │
│  └──────────────┴──────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Carrito Sidebar (Derecha)   │  │
│  │  - Items en carrito          │  │
│  │  - +/- cantidad              │  │
│  │  - Total: $XXX               │  │
│  │  [💬 WhatsApp Button]         │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           Footer                    │
└─────────────────────────────────────┘
```

---

## 🔑 Conceptos Clave

### 1️⃣ **State Management sin librería externa**
- React Hooks (useState) para estado local
- Context API para estado global (Carrito)
- Props drilling para comunicación componentes

### 2️⃣ **Single Page Application (SPA)**
- No usa React Router
- Navegación manual con estado
- Sin recargas de página

### 3️⃣ **Componentes Funcionales**
- Todos con React Hooks
- No hay componentes de clase

### 4️⃣ **Styling sin JavaScript**
- Tailwind CSS puro
- Clases utility-first
- Responsive built-in

---

## 🎓 Patrón: Props Drilling

El proyecto usa un patrón explícito de props drilling para comunicación:

```javascript
// Padres pasan callbacks a hijos
<Component 
  onEvent={handleEvent}        // Callback hacia arriba
  data={parentState}           // Data hacia abajo
/>

// Hijos ejecutan callbacks
function Child({ onEvent, data }) {
  return (
    <button onClick={() => onEvent(newData)}>
      Action
    </button>
  );
}
```

---

## 🎯 Patrón: Context para Estado Global

Para estado que afecta a múltiples componentes no relacionados:

```javascript
// Crear Context
const Context = createContext();

// Provider
export function Provider({ children }) {
  const [state, setState] = useState();
  return (
    <Context.Provider value={{ state, setState }}>
      {children}
    </Context.Provider>
  );
}

// Usar en componentes
function Component() {
  const { state } = useContext(Context);
}
```

**Usado en:** Carrito (accesible desde Header, Tienda, etc.)

---

## 📊 Matriz de Props por Componente

| Componente | Props | Callbacks |
|-----------|-------|-----------|
| Principal | - | - |
| Header | `onNavigate`, `onSearch` | - |
| Navbar | `paginaActual`, `setPaginaActual` | - |
| Inicio | `onNavigate`, `onCategoryClick` | - |
| Sidebar | `onNavigate`, `onCategoryClick` | - |
| Tienda | `busquedaInicial`, `categoriaSeleccionada` | - |
| ProductCatalog | - | - |
| Contacto | - | - |
| Nosotros | - | - |
| Footer | - | - |

---

## 🧪 Casos de Prueba Básicos

### Test 1: Navegación
- [ ] Click Navbar → Cambia página
- [ ] Navbar muestra página activa
- [ ] Header clickeable → Inicio
- [ ] Sin recargas

### Test 2: Búsqueda
- [ ] Escribir en Header → Filtra en Tienda
- [ ] Enter ejecuta búsqueda
- [ ] Tienda búsqueda independiente funciona
- [ ] Reseta al cambiar filtros

### Test 3: Categorías
- [ ] Click Sidebar en Inicio → Navega a Tienda
- [ ] Categoría preseleccionada en Tienda
- [ ] Tienda filtros funcionan
- [ ] Productos de Inicio invariables

### Test 4: Carrito
- [ ] Agregar producto → Badge actualiza
- [ ] Header carrito dropdown sincroniza
- [ ] Tienda carrito sidebar sincroniza
- [ ] +/- botones funcionan
- [ ] Eliminar funciona
- [ ] Total calcula correctamente

### Test 5: Responsive
- [ ] Mobile (375px): Se ve bien
- [ ] Tablet (768px): Se ve bien
- [ ] Desktop (1024px+): Se ve bien
- [ ] Hamburger menu funciona en móvil

---

## 🚨 Errores Comunes

### ❌ Carrito no sincroniza
```javascript
// MAL: Fuera de CarritoProvider
<Principal />  // Sin provider wrapper

// BIEN: CarritoProvider en Principal
<CarritoProvider>
  <Principal />
</CarritoProvider>
```

### ❌ Props indefinidas
```javascript
// MAL: No pasar props necesarias
<Component />

// BIEN: Pasar todos los props requeridos
<Component onNavigate={handler} onSearch={handler} />
```

### ❌ useEffect infinito
```javascript
// MAL: Sin dependencias
useEffect(() => {
  setState(value);
});

// BIEN: Con dependencias correctas
useEffect(() => {
  setState(value);
}, [value]);
```

---

## 📈 Escala del Proyecto

| Métrica | Valor |
|---------|-------|
| Componentes | 12 |
| Páginas | 4 |
| Contextos | 1 |
| Productos | 21 + 8 |
| Líneas de código aprox. | 3000+ |
| Categorías | 8 |

---

## 🔮 Mejoras Futuras Sugeridas

1. **Persistencia:**
   - localStorage para carrito
   - sessionStorage para búsqueda

2. **Autenticación:**
   - Login/Register
   - Historial de pedidos

3. **API Backend:**
   - Reemplazar productos estáticos
   - Cargar dinámicamente

4. **Enrutamiento:**
   - React Router v6
   - URL amigables (/tienda/computadoras)

5. **Pagos:**
   - Integración Stripe/PayPal
   - Checkouts real

6. **Notificaciones:**
   - Toast messages
   - Email confirmaciones

7. **Analytics:**
   - Google Analytics
   - Tracking conversiones

8. **SEO:**
   - Meta tags dinámicos
   - Head management

---

## 🎓 Recursos de Aprendizaje

- [React Hooks](https://react.dev/reference/react)
- [Context API](https://react.dev/learn/passing-data-deeply-with-context)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Última actualización:** Febrero 2026
