import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { tutorialSteps, newReadingTutorialSteps, settingsTutorialSteps } from './steps';
import { getTutorialConfig } from './config';

let driverInstance: ReturnType<typeof driver> | null = null;

export function initTutorial() {
  // Check if tutorial should run
  if (typeof window === 'undefined') return;
  
  const hasCompleted = localStorage.getItem('tutorial-completed') === 'true';
  const hasSkipped = localStorage.getItem('tutorial-skipped') === 'true';
  const neverShow = localStorage.getItem('tutorial-never-show') === 'true';
  
  if (hasCompleted || hasSkipped || neverShow) return;
  
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(startTutorial, 1000);
    });
  } else {
    setTimeout(startTutorial, 1000);
  }
}

export function startTutorial(customSteps?: DriveStep[]) {
  // Get current theme from body class
  const bodyClasses = document.body.classList;
  let theme: 'light' | 'dark' | 'detox' | 'high-contrast' = 'light';
  
  if (bodyClasses.contains('theme-dark')) theme = 'dark';
  else if (bodyClasses.contains('theme-detox')) theme = 'detox';
  else if (bodyClasses.contains('theme-high-contrast')) theme = 'high-contrast';
  
  // Check for reduced motion preference
  const reduceMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    localStorage.getItem('reduceMotion') === 'true';
  
  // Initialize driver
  const config = getTutorialConfig({ theme, reduceMotion });
  driverInstance = driver(config);
  
  // Filter steps to only show those with visible elements
  const steps = customSteps || tutorialSteps;
  const visibleSteps = steps.filter((step) => {
    if (!step.element || typeof step.element !== 'string') return true;
    const element = document.querySelector(step.element);
    return element !== null;
  });
  
  if (visibleSteps.length === 0) {
    console.warn('No tutorial steps found. Skipping tutorial.');
    return;
  }
  
  // Add welcome step at the beginning
  const welcomeStep: DriveStep = {
    popover: {
      title: '👋 ¡Bienvenido a Telling!',
      description:
        'Telling es una herramienta de lectura enfocada que te ayuda a leer línea por línea con mínimas distracciones. ¡Déjanos mostrarte cómo funciona! 🚀',
    },
  };
  
  // Add completion step at the end with option to not show again
  const completionStep: DriveStep = {
    popover: {
      title: '🎉 ¡Todo Listo!',
      description: `
        <p style="margin-bottom: 16px;">Puedes ver este tutorial nuevamente desde Ajustes → "Tutorial Principal". ¡Ahora crea tu primera lectura y comienza a enfocarte! 📖✨</p>
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(128, 128, 128, 0.3);">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.95rem;">
            <input 
              type="checkbox" 
              id="tutorial-no-show-again"
              style="width: 18px; height: 18px; cursor: pointer;"
            />
            <span>No volver a mostrar automáticamente</span>
          </label>
        </div>
      `,
      onNextClick: () => {
        const checkbox = document.getElementById('tutorial-no-show-again') as HTMLInputElement;
        if (checkbox && checkbox.checked) {
          localStorage.setItem('tutorial-never-show', 'true');
        }
        // Mark tutorial as completed
        localStorage.setItem('tutorial-completed', 'true');
        // Destroy the driver instance
        if (driverInstance) {
          driverInstance.destroy();
        }
      },
    },
  };
  
  driverInstance.setSteps([welcomeStep, ...visibleSteps, completionStep]);
  driverInstance.drive();
}

export function resetTutorial() {
  localStorage.removeItem('tutorial-completed');
  localStorage.removeItem('tutorial-skipped');
  startTutorial();
}

export function stopTutorial() {
  if (driverInstance) {
    driverInstance.destroy();
    driverInstance = null;
  }
}

export function startNewReadingTutorial() {
  // Get current theme from body class
  const bodyClasses = document.body.classList;
  let theme: 'light' | 'dark' | 'detox' | 'high-contrast' = 'light';
  
  if (bodyClasses.contains('theme-dark')) theme = 'dark';
  else if (bodyClasses.contains('theme-detox')) theme = 'detox';
  else if (bodyClasses.contains('theme-high-contrast')) theme = 'high-contrast';
  
  // Check for reduced motion preference
  const reduceMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    localStorage.getItem('reduceMotion') === 'true';
  
  // Initialize driver
  const config = getTutorialConfig({ theme, reduceMotion });
  driverInstance = driver(config);
  
  // Add welcome step
  const welcomeStep: DriveStep = {
    popover: {
      title: '📝 Tutorial: Nueva Lectura',
      description:
        '¡Vamos a crear tu primera lectura juntos! Te mostraremos cada campo y qué poner en él.',
    },
  };
  
  driverInstance.setSteps([welcomeStep, ...newReadingTutorialSteps]);
  driverInstance.drive();
}

export function startSettingsTutorial() {
  // Expandir las secciones de Settings antes de iniciar el tutorial
  const generalButton = document.querySelector('[aria-label="General settings section"]') as HTMLElement;
  const accessibilityButton = document.querySelector('[aria-label="Accessibility settings section"]') as HTMLElement;
  
  if (generalButton && generalButton.getAttribute('aria-expanded') === 'false') {
    generalButton.click();
  }
  
  // Pequeño delay para que la sección General se expanda antes de expandir Accessibility
  setTimeout(() => {
    if (accessibilityButton && accessibilityButton.getAttribute('aria-expanded') === 'false') {
      accessibilityButton.click();
    }
    
    // Hacer scroll al primer elemento del tutorial después de expandir
    setTimeout(() => {
      const firstElement = document.querySelector('[data-tour="settings-font-family"]');
      if (firstElement) {
        firstElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Iniciar el tutorial después del scroll
      setTimeout(() => {
        // Get current theme from body class
        const bodyClasses = document.body.classList;
        let theme: 'light' | 'dark' | 'detox' | 'high-contrast' = 'light';
        
        if (bodyClasses.contains('theme-dark')) theme = 'dark';
        else if (bodyClasses.contains('theme-detox')) theme = 'detox';
        else if (bodyClasses.contains('theme-high-contrast')) theme = 'high-contrast';
        
        // Check for reduced motion preference
        const reduceMotion =
          window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
          localStorage.getItem('reduceMotion') === 'true';
        
        // Initialize driver
        const config = getTutorialConfig({ theme, reduceMotion });
        driverInstance = driver(config);
        
        driverInstance.setSteps(settingsTutorialSteps);
        driverInstance.drive();
      }, 500);
    }, 300);
  }, 300);
}
