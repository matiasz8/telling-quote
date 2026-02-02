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
        'Aquí puedes personalizar completamente tu experiencia de lectura. Te mostraremos cada opción y cómo usar el Preview en tiempo real. 💡',
    },
  },
  {
    element: '[data-tour="settings-theme-section"]',
    popover: {
      title: '🌈 Temas Visuales',
      description:
        '4 temas disponibles: Light (claro y brillante), Dark (nocturno para reducir fatiga), Detox (minimalista sin distracciones), y High Contrast (máxima legibilidad). El Preview muestra los cambios en tiempo real. 👀',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="settings-font-section"]',
    popover: {
      title: '🔤 Tipografía',
      description:
        'Elige entre 7 fuentes: Serif (clásica), Sans-serif (moderna), Monospace (código), OpenDyslexic (dislexia), Atkinson Hyperlegible (claridad), Comic Neue (informal), y Lexend (fluidez). Ajusta el tamaño: XS, S, M, L, XL. Pruébalas en el Preview! 📝',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="settings-accessibility-section"]',
    popover: {
      title: '♿ Accesibilidad',
      description:
        'Personaliza el espaciado: Letter Spacing (separación entre letras), Line Height (altura de líneas), Word Spacing (espacio entre palabras), y Content Width (ancho del texto). Activa "Reducir Movimiento" para desactivar animaciones. Observa cada cambio en el Preview! ✨',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="settings-tutorial-button"]',
    popover: {
      title: '📚 Volver a ver Tutoriales',
      description:
        '¿Necesitas un recordatorio? Usa "Tutorial de Ajustes" para ver este tutorial nuevamente, o "Tutorial Principal" para el tour completo de la app.',
      side: 'top',
      align: 'start',
    },
  },
];
