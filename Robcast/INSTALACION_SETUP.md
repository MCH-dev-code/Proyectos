# 🛠️ Guía de Instalación, Setup y Configuración

Instrucciones completas para configurar el proyecto Robcast en tu máquina.

---

## ✅ Requisitos Previos

### Software Requerido
- **Node.js** v18.0.0 o superior ([Descargar](https://nodejs.org))
- **npm** v9.0.0 o superior (incluido con Node.js)
- **Git** (opcional, solo si clonas desde repositorio)
- **Editor de código** (VSCode recomendado)

### Verificar Instalación

```bash
# Verificar Node.js
node --version
# Debe mostrar v18.x.x o superior

# Verificar npm
npm --version
# Debe mostrar 9.x.x o superior
```

---

## 📥 Paso 1: Obtener el Código

### Opción A: Clonar desde Git
```bash
cd C:\Usuarios\TuUsuario\Documentos
git clone <url-repositorio>
cd Robcast
```

### Opción B: Descargar ZIP
1. Descargar ZIP del repositorio
2. Extraer en `C:\Usuarios\TuUsuario\Documentos`
3. Abrir carpeta `Robcast` en terminal

### Opción C: Ya existe en máquina
```bash
cd c:\Proyectos\Robcast
```

---

## 📦 Paso 2: Instalar Dependencias

```bash
# Navegar a la carpeta del proyecto
cd Robcast

# Instalar todas las dependencias
npm install
```

**¿Qué hace?**
- Descarga React, Vite, Tailwind CSS, etc.
- Crea carpeta `node_modules/`
- Genera archivo `package-lock.json`

**Tiempo estimado:** 2-5 minutos (depende conexión internet)

**Tamaño:** ~500MB (es normal, incluye herramientas)

---

## 🚀 Paso 3: Ejecutar en Desarrollo

### Iniciar servidor de desarrollo

```bash
npm run dev
```

**Output esperado:**
```
VITE v8.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

### Acceder a la app

1. Abre navegador
2. Ve a `http://localhost:5173`
3. Deberías ver la página de Robcast

### Características del modo desarrollo

- **Hot Module Replacement (HMR):** Los cambios se ven al instante
- **Errores en consola:** Mensajes claros de qué falló
- **DevTools:** Acceso a React DevTools

---

## 🛑 Parar el Servidor

```bash
# En la terminal donde corre npm run dev
Ctrl + C

# Confirmar con 'y' si pregunta
```

---

## 🏗️ Paso 4: Build para Producción

Cuando estés listo para publicar:

```bash
npm run build
```

**¿Qué hace?**
- Compila React → JavaScript optimizado
- Compila CSS → Tailwind CSS optimizado
- Minifica código y assets
- Crea carpeta `dist/`

**Tamaño esperado:** ~200KB (muy pequeño)

**Tiempo:** 30-60 segundos

### Archivos generados

```
dist/
├── index.html          # Archivo principal
├── assets/
│   ├── index-XXX.js    # JavaScript
│   └── index-XXX.css   # CSS compilado
└── ...
```

---

## 👁️ Paso 5: Preview del Build

Para ver cómo se vería en producción:

```bash
npm run build          # Generar build
npm run preview       # Servir el build
```

Abre `http://localhost:4173`

---

## 📋 Paso 6: Linter (Validar código)

Para revisar el código usando ESLint:

```bash
npm run lint
```

**Muestra:**
- Errores de sintaxis
- Código ineficiente
- Warnings

---

## 🗂️ Estructura tras instalación

```
Robcast/
├── node_modules/              ← Dependencias (NO SUBIR A GIT)
├── src/
│   ├── components/
│   ├── context/
│   ├── Principal.jsx
│   ├── main.jsx
│   └── ...
├── public/
├── dist/                       ← Se genera con npm run build
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
└── README.md
```

---

## 🔧 Configuración Tras Instalación

### VSCode Extensions Recomendadas

1. **ES7+ React/Redux/React-Native snippets**
   - ID: `dsznajder.es7-react-js-snippets`

2. **Tailwind CSS IntelliSense**
   - ID: `bradlc.vscode-tailwindcss`

3. **ESLint**
   - ID: `dbaeumer.vscode-eslint`

4. **Prettier**
   - ID: `esbenp.prettier-vscode`

5. **React DevTools**
   - ID: `msjsdiag.debugger-for-chrome`

**Instalación:** Ctrl+Shift+X → Buscar → Install

### Configurar VSCode

Crear `.vscode/settings.json` en raíz:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## 🌍 Variables de Entorno (Opcional)

Si necesitas variables de entorno en el futuro:

1. Crear archivo `.env` en raíz:
```env
VITE_API_URL=http://localhost:3000
VITE_WHATSAPP_NUMBER=18095946269
```

2. Usar en código:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER;
```

**Nota:** Variables deben empezar con `VITE_` para que Vite las procese.

---

## 📚 Primeros Pasos en el Código

### 1. Explorar la estructura
```bash
# Abre VSCode
code .

# Mira los archivos en:
# - src/Principal.jsx (raíz)
# - src/components/ (componentes)
# - src/context/CarritoContext.jsx (estado global)
```

### 2. Hacer un cambio simple
```javascript
// En src/components/Header.jsx
// Busca: "<p className="font-bold">Robcast</p>"
// Cambia el texto
// Guardas (Ctrl+S)
// Ves el cambio instantáneamente (HMR)
```

### 3. Ver estado del carrito
```javascript
// En cualquier componente que use CarritoContext
const { carrito, cantidadItems } = useContext(CarritoContext);
console.log("Carrito actual:", carrito);
console.log("Cantidad de items:", cantidadItems);
```

---

## 🐛 Troubleshooting Instalación

### ❌ Error: "npm not found"
**Solución:**
1. Desinstala Node.js
2. Descarga Node.js v18+ desde nodejs.org
3. Instala de nuevo
4. Reinicia terminal

### ❌ Error: "port 5173 already in use"
**Solución:**
```bash
# Opción 1: Parar lo que usa el puerto
# O matar en Task Manager

# Opción 2: Usar otro puerto
npm run dev -- --port 3000
```

### ❌ Error: "EACCES permission denied"
**Solución (Mac/Linux):**
```bash
# Usa sudo
sudo npm install

# O mejor: arregla permisos npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

### ❌ Error en build: "Out of memory"
**Solución:**
```bash
# Incrementar memoria Node.js
node --max-old-space-size=4096 ./node_modules/vite/bin/vite.js build
```

### ❌ Cambios no se ven (HMR no funciona)
**Solución:**
1. Guarda el archivo (Ctrl+S)
2. Escucha la terminal:
```
[HMR] hot updated: src/components/Header.jsx
```
3. Si no dice "[HMR]", recarga página (F5)

### ❌ node_modules corrompidos
**Solución:**
```bash
# Elimina node_modules
rm -rf node_modules        # Mac/Linux
rmdir /s node_modules      # Windows

# Elimina lock
rm package-lock.json

# Reinstala
npm install
```

---

## 🔐 Archivos .gitignore

El proyecto ya debe tener `.gitignore`. Incluye:

```
node_modules/
dist/
.env.local
.DS_Store
.vscode/
*.log
```

**NO SUBAS** `node_modules/` a Git (es enorme y se regenera).

---

## 📱 Probar en Teléfono Local

Para ver la app en tu teléfono en la red local:

1. Encontrar tu IP:
```bash
ipconfig  # Windows
ifconfig  # Mac/Linux
# Busca IPv4 address ej: 192.168.1.100
```

2. Iniciar Vite permitiendo acceso:
```bash
npm run dev -- --host
```

3. En teléfono, abre:
```
http://192.168.1.100:5173
```

---

## 💾 Guardar Cambios (Git)

Si trabajas con repositorio:

```bash
# Ver cambios
git status

# Añadir cambios
git add .

# Commit
git commit -m "Describir cambio"

# Push
git push origin main

# Para nada: NO hagas commit de node_modules/
```

---

## 🚀 Desplegar en Producción

### Opción A: Netlify (Recomendado)

1. Hacer build:
```bash
npm run build
```

2. Carpeta `dist/` está lista
3. Ir a [netlify.com](https://netlify.com)
4. Drag & drop carpeta `dist/`
5. Listo, app publicada

### Opción B: Vercel

1. Instalar Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Seguir preguntas interactivas

### Opción C: Servidor propio

```bash
# Copiar contenido de dist/ a servidor
# Configurar servidor web (nginx/apache)
# IMPORTANTE: Redirect 404 → index.html para SPA
```

---

## 📊 Checklist Post-Instalación

- [ ] Node.js v18+ instalado
- [ ] npm install completado sin errores
- [ ] npm run dev funciona
- [ ] http://localhost:5173 carga la app
- [ ] VSCode extensions instaladas
- [ ] Hot reload (HMR) funciona
- [ ] Puedes navegar entre páginas
- [ ] Carrito funciona
- [ ] Búsqueda funciona
- [ ] Responsive looks bien en móvil

---

## 🆘 Support/Help

Si algo no funciona:

1. **Lee la terminal:** ESLint/Vite mostrarán errores claros
2. **Revisa console:** F12 → Console tab
3. **Borra cache:**
```bash
# Limpiar npm cache
npm cache clean --force

# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install
```

4. **Pregunta en documentación:**
   - [React Docs](https://react.dev)
   - [Vite Docs](https://vitejs.dev)
   - [Tailwind Docs](https://tailwindcss.com)

---

## 📝 Archivo .npmrc (Opcional)

Para configuración global de npm, crear `.npmrc`:

```
legacy-peer-deps=true
strict-peer-dependencies=false
```

---

**Última actualización:** Febrero 2026
**Versión:** 1.0.0
