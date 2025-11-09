# Ejemplo Completo de Markdown - tellingQuote

## Introducción a los Nuevos Formatos

En esta demostración verás todos los formatos markdown soportados por **tellingQuote**. Cada formato tiene un propósito específico para mejorar la presentación de tu contenido.

---

## Formatos de Texto Inline

### Énfasis y Estilo

El texto puede tener *énfasis sutil* usando cursiva, o **énfasis fuerte** con negrita. También puedes ~~tachar texto~~ cuando quieras indicar que algo está obsoleto o incorrecto.

Puedes combinarlos: ***texto en negrita y cursiva***, o **negrita con ~~tachado~~**, o incluso *cursiva con `código inline`*.

### Código

Para mencionar comandos o código en línea, usa `backticks`. Por ejemplo: ejecuta `npm install` para instalar las dependencias.

---

## Listas y Estructura

### Lista con Bullets

- Primer punto importante
- Segundo punto con *énfasis*
- Tercer punto con **negrita**
- Cuarto punto con ~~texto tachado~~
- Quinto punto con `código inline`

### Lista Numerada

1. Paso uno: Instalar las dependencias con `npm install`
2. Paso dos: Configurar el archivo `.env` 
3. Paso tres: Ejecutar `npm run dev` para iniciar
4. Paso cuatro: Abrir `http://localhost:3000` en el navegador

---

## Citas y Destacados

> "La educación es el arma más poderosa que puedes usar para cambiar el mundo."
> — Nelson Mandela

> Esta es una cita importante que contiene **texto en negrita**, *cursiva*, y hasta `código inline`.

> Las blockquotes son perfectas para destacar conceptos clave o frases memorables.

---

## Bloques de Código

### Ejemplo en JavaScript

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
```

### Ejemplo en Python

```python
def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
```

### Ejemplo en Bash

```bash
#!/bin/bash
echo "Hola desde tellingQuote"
npm run build
npm start
```

---

## Combinaciones Avanzadas

### Lista con Múltiples Formatos

- **Negrita**: Para *destacar* información crítica
- *Cursiva*: Para ~~enfatizar~~ sutilmente
- `Código`: Para mencionar comandos como `git commit`
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

![Logo de tellingQuote](https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=tellingQuote)

Las imágenes se muestran centradas y con el tamaño optimizado para la lectura.

![Diagrama de flujo](https://via.placeholder.com/800x300/10B981/FFFFFF?text=Diagrama+de+Flujo)

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
5. `Código inline` - Para menciones técnicas
6. Bloques de código - Para ejemplos completos
7. > Blockquotes - Para citas importantes
8. Separadores - Para dividir secciones
9. [Enlaces](https://example.com) - Para referencias externas

---

> ¡Ahora puedes crear contenido rico y visualmente atractivo en tellingQuote!

**Tip**: Combina estos formatos para crear presentaciones profesionales y educativas.

*¡Disfruta creando contenido increíble!* 🚀
