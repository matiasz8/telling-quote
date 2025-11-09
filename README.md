# Telling Quote

Una aplicación interactiva de lectura que convierte contenido markdown en presentaciones tipo slides, permitiéndote leer y estudiar de forma organizada y visualmente atractiva.

## ✨ Características

- 📝 **Procesamiento de Markdown**: Convierte automáticamente contenido markdown en slides navegables
- 🎨 **Personalización completa**: 
  - 4 familias de fuentes (Serif, Sans-serif, Monospace, System)
  - 4 tamaños de texto (Pequeño, Mediano, Grande, Extra Grande)
  - 2 temas (Claro con gradiente ámbar, Oscuro con gradiente violeta)
- 💻 **Bloques de código modernos**: Renderizado profesional con botón de copiar y detección de lenguaje
- 📊 **Listas inteligentes**: Soporte completo para listas con viñetas y numeradas con contexto de padre
- 🔍 **Navegación fluida**: Navega entre slides con teclado o botones
- 💾 **Persistencia local**: Todas tus lecturas y configuraciones se guardan en localStorage

## 🚀 Inicio Rápido

### Desarrollo Local

1. Clona el repositorio:
```bash
git clone git@github.com:matiasz8/telling-quote.git
cd telling-quote
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build de Producción

```bash
npm run build
npm start
```

## 📦 Despliegue

### Vercel (Recomendado)

La forma más fácil de desplegar esta aplicación Next.js es usando [Vercel](https://vercel.com):

1. Sube tu repositorio a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com/new)
3. Vercel detectará automáticamente Next.js y configurará el build

### GitHub Pages

Para desplegar en GitHub Pages con exportación estática:

1. Actualiza `next.config.ts` para habilitar export estático:
```typescript
const nextConfig = {
  output: 'export',
  basePath: '/telling-quote', // Nombre de tu repositorio
  images: {
    unoptimized: true,
  },
};
```

2. Agrega un script en `package.json`:
```json
"scripts": {
  "export": "next build"
}
```

3. Crea `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

4. En GitHub, ve a Settings → Pages → Source y selecciona la rama `gh-pages`

## 🛠️ Tecnologías

- **Framework**: Next.js 16.0.1 con App Router
- **UI**: React 19.2.0
- **Estilos**: Tailwind CSS con gradientes personalizados
- **Tipado**: TypeScript
- **Almacenamiento**: localStorage con sincronización entre componentes

## 📁 Estructura del Proyecto

```
telling-quote/
├── app/
│   ├── page.tsx              # Dashboard con grid de lecturas
│   ├── reader/[id]/page.tsx  # Visor de slides
│   └── layout.tsx
├── components/
│   ├── CodeBlock.tsx         # Renderizado de bloques de código
│   ├── SettingsModal.tsx     # Modal de configuración
│   ├── Header.tsx            # Cabecera con navegación
│   ├── ReadingCard.tsx       # Card de lectura en dashboard
│   ├── NewReadingModal.tsx   # Modal para crear lecturas
│   └── EditTitleModal.tsx    # Modal para editar títulos
├── hooks/
│   ├── useLocalStorage.ts    # Hook para persistencia
│   └── useSettings.ts        # Hook para configuración
├── utils/
│   ├── textProcessor.ts      # Procesamiento de markdown
│   ├── markdownFormatter.ts  # Limpieza de markdown
│   └── styleHelpers.ts       # Mapeo de estilos
└── types/
    └── index.ts              # Definiciones de tipos
```

## 🎯 Uso

1. **Crear una lectura**: Click en "Nueva Lectura" en el dashboard
2. **Pegar contenido markdown**: Títulos (##), listas, código, etc.
3. **Navegar**: Usa las flechas del teclado o los botones para moverte entre slides
4. **Personalizar**: Click en el ícono de configuración (⚙️) para ajustar fuente, tamaño y tema
5. **Copiar código**: Los bloques de código tienen un botón de copiar integrado

## 📝 Formato Markdown Soportado

- **Títulos**: `## Subtítulo` divide el contenido en secciones
- **Listas con viñetas**: `- Item` o `* Item`
- **Listas numeradas**: `1. Item` con contexto de padre
- **Código inline**: `` `código` ``
- **Bloques de código**: 
  ````markdown
  ```javascript
  console.log('Hola');
  ```
  ````
- **Negrita**: `**texto**`
- **Enlaces**: `[texto](url)`

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si encuentras un bug o tienes una sugerencia, por favor abre un issue.

## 📄 Licencia

MIT

---

Desarrollado con ❤️ usando Next.js
