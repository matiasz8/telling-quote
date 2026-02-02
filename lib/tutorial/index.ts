import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { tutorialSteps } from './steps';
import { getTutorialConfig } from './config';

let driverInstance: ReturnType<typeof driver> | null = null;

export function initTutorial() {
  // Check if tutorial should run
  if (typeof window === 'undefined') return;
  
  const hasCompleted = localStorage.getItem('tutorial-completed') === 'true';
  const hasSkipped = localStorage.getItem('tutorial-skipped') === 'true';
  
  if (hasCompleted || hasSkipped) return;
  
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
      title: '👋 Welcome to Telling!',
      description:
        'Telling is a focused reading tool that helps you read line-by-line with minimal distractions. Let us show you around! 🚀',
    },
  };
  
  // Add completion step at the end
  const completionStep: DriveStep = {
    popover: {
      title: "🎉 You're All Set!",
      description:
        'You can replay this tutorial anytime from Settings → "Show Tutorial Again". Now create your first reading and start focusing! 📖✨',
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
