import { DriveStep } from 'driver.js';

export const tutorialSteps: DriveStep[] = [
  {
    element: '[data-tour="settings-button"]',
    popover: {
      title: '⚙️ Personaliza tu Experiencia',
      description:
        'Cambia temas, ajusta el tamaño de letra y elige tu estilo de lectura aquí. ¡Hazlo tuyo!',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="new-reading-button"]',
    popover: {
      title: '✨ Agrega tu Contenido',
      description:
        '¡Haz clic aquí para crear una nueva lectura. Pega cualquier texto o markdown y lo formatearemos hermosamente para ti!',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="reading-card"]',
    popover: {
      title: '📚 Tu Biblioteca de Lecturas',
      description:
        'Tus lecturas aparecen como tarjetas. Haz clic en cualquiera para comenzar a leer. Puedes etiquetar, editar o eliminarlas en cualquier momento.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '[data-tour="reader-navigation"]',
    popover: {
      title: '🎯 Navega tu Lectura',
      description:
        'Usa las flechas del teclado (← →) o estos botones para moverte línea por línea. ¡Prueba "Modo Spotlight" en ajustes para máximo enfoque!',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-tour="keyboard-shortcuts"]',
    popover: {
      title: '⚡ Tips de Usuario Experto',
      description:
        'Presiona "?" para ver todos los atajos de teclado. Prueba: ← → para navegar, Esc para salir de lectura, ? para menú de atajos.',
      side: 'bottom',
      align: 'end',
    },
  },
];

export const newReadingTutorialSteps: DriveStep[] = [
  {
    element: '[data-tour="reading-title-input"]',
    popover: {
      title: '📝 Título de tu Lectura',
      description:
        'Dale un nombre descriptivo a tu lectura. Por ejemplo: "Capítulo 1: Introducción" o "Artículo sobre IA".',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="reading-content-textarea"]',
    popover: {
      title: '📄 Contenido de la Lectura',
      description:
        'Pega aquí tu texto completo. Soportamos Markdown: **negrita**, *cursiva*, # títulos, código, y más. ¡Lo formatearemos automáticamente!',
      side: 'top',
      align: 'start',
    },
  },
  {
    element: '[data-tour="reading-tags-input"]',
    popover: {
      title: '🏷️ Etiquetas (Opcional)',
      description:
        'Organiza tus lecturas con etiquetas. Escribe una etiqueta y presiona Enter. Ejemplo: "trabajo", "estudio", "favoritos".',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="reading-create-button"]',
    popover: {
      title: '✅ Crear Lectura',
      description:
        '¡Cuando termines, haz clic aquí para guardar tu lectura! Aparecerá en tu biblioteca lista para leer.',
      side: 'top',
      align: 'center',
    },
  },
];

export const settingsTutorialSteps: DriveStep[] = [
  {
    popover: {
      title: '🎨 Panel de Ajustes',
      description:
        'Aquí puedes personalizar completamente tu experiencia de lectura. Vamos a explorar cada opción en detalle. 💡',
    },
  },
  {
    element: '[data-tour="settings-general-section"]',
    popover: {
      title: '🧭 Ajustes Generales',
      description:
        'En esta sección puedes cambiar la fuente, tamaño y tema. Primero revisaremos estos ajustes básicos.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="settings-font-family"]',
    popover: {
      title: '🔤 Familia de Fuente',
      description:
        '7 fuentes disponibles: Serif (clásica para lectura), Sans Serif (moderna y limpia), Monospace (ideal para código), Sistema (tu fuente predeterminada), OpenDyslexic (diseñada para dislexia), Comic Neue (informal y amigable), y Atkinson Hyperlegible (máxima claridad). ¡Elige la que más te guste!',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="settings-font-size"]',
    popover: {
      title: '📏 Tamaño de Letra',
      description:
        'Ajusta el tamaño del texto en el lector: Pequeño (S - 16px), Mediano (M - 18px, predeterminado), Grande (L - 20px), o Extra Grande (XL - 24px). Encuentra el tamaño perfecto para tu comodidad visual. Puedes ver cómo se verá en el Preview de abajo.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="settings-theme"]',
    popover: {
      title: '🌈 Temas Visuales',
      description:
        '☀️ Claro (brillante y enérgico), 🌙 Oscuro (perfecto para la noche), 🧘 Detox (minimalista sin distracciones), 🔳 Contraste Reforzado (máxima nitidez visual). Cada tema cambia colores, fondos y estilos completamente.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="settings-letter-spacing"]',
    popover: {
      title: '↔️ Espaciado entre Letras',
      description:
        'Controla el espacio entre cada letra: Normal (estándar), Compact (letras más juntas), o Relaxed (letras más separadas). Útil para mejorar la legibilidad según tus preferencias. Observa el cambio en el Preview.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="settings-line-height"]',
    popover: {
      title: '📐 Altura de Línea',
      description:
        'Ajusta el espacio vertical entre líneas: Normal, Compact (líneas más juntas para ver más texto), o Relaxed (líneas más separadas para lectura pausada). Afecta directamente la densidad del texto.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="settings-word-spacing"]',
    popover: {
      title: '🔤 Espaciado entre Palabras',
      description:
        'Controla la separación entre palabras: Normal, Compact (palabras más cercanas), o Relaxed (palabras más espaciadas). Ideal para encontrar tu ritmo de lectura perfecto.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="settings-reduce-motion"]',
    popover: {
      title: '🔇 Reducir Movimiento',
      description:
        'Activa esta opción para desactivar todas las animaciones y transiciones. Perfecto si prefieres una experiencia más estática o si las animaciones te distraen o causan mareos.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="settings-accessibility-header"]',
    popover: {
      title: 'Aa Ajustes de Accesibilidad',
      description:
        'Ahora pasamos a accesibilidad: espaciados, enfoque, ancho de contenido y más opciones para lectura cómoda.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="settings-auto-advance"]',
    popover: {
      title: '⏱️ Temporizador Automático',
      description:
        'Configura el avance automático basado en tu velocidad de lectura (WPM). Puedes activar el auto-inicio y mostrar un indicador de progreso durante la lectura.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="settings-focus-mode"]',
    popover: {
      title: '🎯 Modo Enfoque',
      description:
        'Cuando estás leyendo, el Modo Enfoque atenúa toda la interfaz excepto el texto, eliminando distracciones visuales. Ideal para concentración máxima. Prueba activarlo y abre una lectura para ver el efecto.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="settings-content-width"]',
    popover: {
      title: '📖 Ancho del Contenido',
      description:
        'Define el ancho máximo del texto en el lector: Angosto (45 caracteres - óptimo para lectura concentrada), Mediano (65 caracteres - balance perfecto), Ancho (80 caracteres - más información visible), o Ancho Completo (sin límite - usa toda la pantalla). Esta configuración solo afecta la vista de lectura.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="settings-tutorial-button"]',
    popover: {
      title: '📚 Volver a ver Tutoriales',
      description:
        '¿Necesitas un recordatorio? Usa "Tutorial de Ajustes" para ver este tutorial nuevamente, o "Tutorial Principal" para el tour completo de la app. Los tutoriales siempre están disponibles aquí.',
      side: 'top',
      align: 'start',
    },
  },
];
