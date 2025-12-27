import { Reading } from '@/types';

export const EXAMPLE_READING_ID = 'example-reading-v1';

const EXAMPLE_MARKDOWN_CONTENT = `# Ejemplo Completo de Markdown - tellingQuote

## Introducción a los Nuevos Formatos

En esta demostración verás todos los formatos markdown soportados por **tellingQuote**. Cada formato tiene un propósito específico para mejorar la presentación de tu contenido.

---

## Formatos de Texto Inline

### Énfasis y Estilo

El texto puede tener *énfasis sutil* usando cursiva, o **énfasis fuerte** con negrita. También puedes ~~tachar texto~~ cuando quieras indicar que algo está obsoleto o incorrecto.

Puedes combinarlos: ***texto en negrita y cursiva***, o **negrita con ~~tachado~~**, o incluso *cursiva con \`código inline\`*.

### Código

Para mencionar comandos o código en línea, usa \`backticks\`. Por ejemplo: ejecuta \`npm install\` para instalar las dependencias.

---

## Listas y Estructura

### Lista con Bullets

- Primer punto importante
- Segundo punto con *énfasis*
- Tercer punto con **negrita**
- Cuarto punto con ~~texto tachado~~
- Quinto punto con \`código inline\`

### Lista Numerada

1. Paso uno: Instalar las dependencias con \`npm install\`
2. Paso dos: Configurar el archivo \`.env\` 
3. Paso tres: Ejecutar \`npm run dev\` para iniciar
4. Paso cuatro: Abrir \`http://localhost:3000\` en el navegador

---

## Citas y Destacados

> "La educación es el arma más poderosa que puedes usar para cambiar el mundo."
> — Nelson Mandela

> Esta es una cita importante que contiene **texto en negrita**, *cursiva*, y hasta \`código inline\`.

> Las blockquotes son perfectas para destacar conceptos clave o frases memorables.

---

## Bloques de Código

### Ejemplo en JavaScript

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
\`\`\`

### Ejemplo en Python

\`\`\`python
def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
\`\`\`

### Ejemplo en Bash

\`\`\`bash
#!/bin/bash
echo "Hola desde tellingQuote"
npm run build
npm start
\`\`\`

---

## Combinaciones Avanzadas

### Lista con Múltiples Formatos

- **Negrita**: Para *destacar* información crítica
- *Cursiva*: Para ~~enfatizar~~ sutilmente
- \`Código\`: Para mencionar comandos como \`git commit\`
- ~~Tachado~~: Para indicar cambios o **obsolescencia**

### Enlaces y Referencias

Visita el [repositorio en GitHub](https://github.com/matiasz8/telling-quote) para ver el código fuente.

Aprende más sobre [Markdown](https://www.markdownguide.org/) y sus capacidades.

---

## Separadores Visuales

Los separadores horizontales ayudan a dividir secciones temáticas:

***

## Imágenes y Destacados (Phase 2)

### Imágenes

Puedes incluir imágenes usando la sintaxis markdown estándar:

![Logo de tellingQuote](https://picsum.photos/600/400)

Las imágenes se muestran centradas y con el tamaño optimizado para la lectura.

![Diagrama de flujo](https://picsum.photos/600/400)

### Texto Destacado

Puedes ==destacar texto importante== usando la sintaxis de highlighting.

Este formato es perfecto para ==resaltar conceptos clave== o ==términos importantes== que quieres que el lector recuerde.

También puedes combinar: **negrita con ==destacado==** o *cursiva con ==highlighting==*.

---

## Sección Final

### Resumen de Formatos Soportados

1. **Headings** - Para títulos y subtítulos
2. *Cursiva* - Para énfasis sutil
3. **Negrita** - Para énfasis fuerte
4. ~~Tachado~~ - Para texto obsoleto
5. \`Código inline\` - Para menciones técnicas
6. Bloques de código - Para ejemplos completos
7. > Blockquotes - Para citas importantes
8. Separadores - Para dividir secciones
9. [Enlaces](https://example.com) - Para referencias externas

---

## 📊 Tablas

Las tablas te permiten organizar información en filas y columnas con un diseño profesional y moderno.

### Tabla Simple

| Lenguaje | Popularidad | Tipo |
|----------|-------------|------|
| JavaScript | ⭐⭐⭐⭐⭐ | Multiparadigma |
| Python | ⭐⭐⭐⭐⭐ | Interpretado |
| TypeScript | ⭐⭐⭐⭐ | Tipado estático |
| Rust | ⭐⭐⭐ | Sistemas |

### Tabla con Formato

| Feature | Descripción | Estado |
|---------|-------------|--------|
| **Markdown** | Soporte completo | ==Activo== |
| *Tablas* | Diseño moderno | ✅ Listo |
| \`Code\` | Resaltado de código | 🚀 Mejorado |

---

## ✅ Listas de Tareas

Crea listas de tareas con checkboxes personalizados y animados.

### Tareas Completadas

- [x] Implementar soporte de markdown
- [x] Agregar temas claro y oscuro
- [x] Crear sistema de navegación

### Tareas Pendientes

- [ ] Añadir soporte para footnotes
- [ ] Implementar ecuaciones matemáticas
- [ ] Mejorar rendimiento de carga

### Lista Mixta

- [x] Diseñar interfaz de usuario
- [x] Implementar lógica de negocio
- [ ] Escribir tests unitarios
- [ ] Documentar API

---

## 📚 Footnotes y Referencias

Las footnotes te permiten agregar notas al pie y referencias académicas.

### Ejemplo Básico

Este texto tiene una referencia[^1] que aparece al final.

También puedes tener múltiples referencias[^2] en el mismo párrafo.

[^1]: Esta es la primera nota al pie con información adicional.
[^2]: Segunda nota que explica un concepto importante.

### Ejemplo Académico

La teoría de la relatividad[^einstein] revolucionó la física moderna.

Los principios de la computación cuántica[^quantum] permiten nuevos paradigmas.

[^einstein]: Einstein, A. (1905). "Zur Elektrodynamik bewegter Körper". Annalen der Physik.
[^quantum]: Nielsen, M. & Chuang, I. (2010). Quantum Computation and Quantum Information.

---

## 🧮 Ecuaciones Matemáticas

Renderiza ecuaciones matemáticas profesionales con KaTeX.

### Matemática Inline

La fórmula de Euler es $e^{i\pi} + 1 = 0$, una de las más bellas en matemáticas.

El teorema de Pitágoras: $a^2 + b^2 = c^2$.

### Ecuaciones en Bloque

$$E = mc^2$$

$$\\int_{a}^{b} f(x)dx = F(b) - F(a)$$

$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$

### Matrices y Sistemas

$$\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$$

$$f(x) = \\begin{cases} x^2 & \\text{if } x \\geq 0 \\\\ -x & \\text{if } x < 0 \\end{cases}$$

---

> ¡Ahora puedes crear contenido rico y visualmente atractivo en tellingQuote!

**Tip**: Combina estos formatos para crear presentaciones profesionales y educativas.

*¡Disfruta creando contenido increíble!* 🚀`;

export const EXAMPLE_READING: Reading = {
  id: EXAMPLE_READING_ID,
  title: 'Welcome to tellingQuote - Example Reading',
  content: EXAMPLE_MARKDOWN_CONTENT,
};

/**
 * Helper function to check if a reading is the example reading
 */
export function isExampleReading(reading: Reading | null | undefined): boolean {
  return reading?.id === EXAMPLE_READING_ID;
}


