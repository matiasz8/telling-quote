# PRD-011: Internationalization System (English/Spanish)

**Status:** Draft  
**Created:** 2025-06-XX  
**Last Updated:** 2025-06-XX  
**Owner:** Product Team  
**Related:** N/A

---

## 1. Overview

### Purpose
Enable **Telling** to support multiple languages, starting with English and Spanish, allowing users to select their preferred language for the entire platform interface.

### Background
Currently, the platform is fully implemented in Spanish. To expand accessibility and reach a broader audience, we need to implement a robust internationalization (i18n) system that allows seamless language switching while maintaining performance and user experience.

### Goals
1. Support two languages: Spanish (default) and English
2. Allow users to select language via Settings
3. Persist language preference across sessions
4. Translate all UI elements, modals, tutorials, and static text
5. Maintain accessibility standards across all languages

### Non-Goals
- Automatic language detection based on browser settings (future enhancement)
- Right-to-left (RTL) language support
- Content translation (readings remain in their original language)
- Real-time translation of user-generated content (titles, tags)

---

## 2. User Stories

### As a Spanish-speaking user (current state)
- I can use the platform entirely in Spanish as it is today
- I can see all UI elements, tutorials, and modals in Spanish
- I have no need to switch languages

### As an English-speaking user
- I want to switch the interface language to English in Settings
- I want all UI elements, buttons, labels, and help text to appear in English
- I want my language preference to persist across sessions
- I want tutorials and keyboard shortcuts to display in English

### As a bilingual user
- I want to easily toggle between Spanish and English
- I want the language change to take effect immediately without page refresh
- I want my readings to remain in their original language regardless of UI language

---

## 3. Functional Requirements

### 3.1 Language Selector in Settings

**Location:** Settings Modal → New "General Settings" section

**Component:**
```tsx
<div className="space-y-2" data-tour="settings-language">
  <label htmlFor="language" className="block text-sm font-medium">
    Idioma / Language
  </label>
  <select
    id="language"
    value={language}
    onChange={(e) => setLanguage(e.target.value)}
    className="w-full px-4 py-2 rounded-lg border..."
  >
    <option value="es">Español</option>
    <option value="en">English</option>
  </select>
  <p className="text-xs text-gray-600 dark:text-gray-400">
    {language === 'es' 
      ? 'Cambia el idioma de toda la interfaz'
      : 'Changes the language of the entire interface'
    }
  </p>
</div>
```

**Behavior:**
- Language changes immediately upon selection
- No page reload required
- New selection saved to `localStorage` as `user-language`
- Default language: `es` (Spanish)

### 3.2 Translation Architecture

**Approach 1: React Context + Translation Dictionaries (Recommended)**

**Pros:**
- No external dependencies
- Full control over implementation
- Lightweight (~2-3 KB for translation files)
- Easy to maintain and extend

**Structure:**
```
lib/
  i18n/
    index.ts          // Context provider and useTranslation hook
    translations/
      es.ts           // Spanish translations
      en.ts           // English translations
```

**Implementation:**
```typescript
// lib/i18n/index.ts
import { createContext, useContext, ReactNode } from 'react';
import { translations } from './translations';

type Language = 'es' | 'en';

const I18nContext = createContext<{
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
}>({
  language: 'es',
  t: (key) => key,
  setLanguage: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useLocalStorage<Language>('user-language', 'es');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useTranslation = () => useContext(I18nContext);
```

**Usage in Components:**
```tsx
import { useTranslation } from '@/lib/i18n';

function Header() {
  const { t } = useTranslation();
  
  return (
    <button title={t('header.keyboardShortcuts')}>
      ⌨️
    </button>
  );
}
```

**Approach 2: next-intl (Alternative)**

**Pros:**
- Built for Next.js App Router
- Automatic route-based language detection
- Strong TypeScript support

**Cons:**
- Adds ~15 KB to bundle
- More complex setup
- Requires route structure changes (`/es/`, `/en/`)

**Approach 3: react-i18next (Alternative)**

**Pros:**
- Industry standard
- Extensive features (pluralization, interpolation, namespaces)

**Cons:**
- Heaviest solution (~20 KB)
- Overkill for two languages
- More configuration required

**Recommendation:** Use **Approach 1** (React Context) for simplicity, control, and minimal bundle size.

---

## 4. Technical Specifications

### 4.1 Translation Dictionary Structure

**Spanish (es.ts):**
```typescript
export const es = {
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    close: 'Cerrar',
    delete: 'Eliminar',
    edit: 'Editar',
    confirm: 'Confirmar',
  },
  header: {
    keyboardShortcuts: 'Atajos de Teclado (Press ?)',
    viewTutorial: 'Ver Tutorial',
    settings: 'Ajustes',
  },
  settings: {
    title: 'Ajustes',
    general: 'Ajustes Generales',
    language: 'Idioma / Language',
    languageDescription: 'Cambia el idioma de toda la interfaz',
    accessibility: 'Accesibilidad',
    fontFamily: 'Familia de Fuente',
    fontSize: 'Tamaño de Letra',
    theme: 'Tema',
    // ... all other settings labels
  },
  tutorial: {
    next: 'Siguiente →',
    previous: '← Atrás',
    finish: 'Finalizar',
    skip: 'Saltar Tutorial',
    neverShowAgain: 'No volver a mostrar este tutorial',
    // ... all tutorial steps
  },
  keyboardShortcuts: {
    title: 'Atajos de Teclado',
    categories: {
      generalNavigation: 'Navegación General',
      readingMode: 'Modo Lectura',
      modalsAndForms: 'Modales y Formularios',
      touchGestures: 'Gestos Táctiles (Móvil)',
    },
    // ... all shortcut descriptions
  },
  // ... all other sections
};
```

**English (en.ts):**
```typescript
export const en = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
  },
  header: {
    keyboardShortcuts: 'Keyboard Shortcuts (Press ?)',
    viewTutorial: 'View Tutorial',
    settings: 'Settings',
  },
  settings: {
    title: 'Settings',
    general: 'General Settings',
    language: 'Idioma / Language',
    languageDescription: 'Changes the language of the entire interface',
    accessibility: 'Accessibility',
    fontFamily: 'Font Family',
    fontSize: 'Font Size',
    theme: 'Theme',
    // ... all other settings labels
  },
  // ... all other sections
};
```

### 4.2 Files to Internationalize

**Priority 1: Core UI (MVP)**
1. `components/Header.tsx`
2. `components/SettingsModal.tsx`
3. `components/NewReadingModal.tsx`
4. `components/KeyboardShortcutsModal.tsx`
5. `components/ConfirmDeleteModal.tsx`
6. `components/EditTitleModal.tsx`
7. `lib/tutorial/steps.ts` (all tutorial steps)
8. `lib/tutorial/config.ts` (button labels)

**Priority 2: Reader & Navigation**
9. `app/reader/[id]/page.tsx` (navigation buttons, progress)
10. `components/ReadingCard.tsx` (labels, buttons)
11. `app/page.tsx` (dashboard text)

**Priority 3: Accessibility**
12. `app/accessibility/page.tsx`
13. ARIA labels and screen reader text

### 4.3 Storage & Persistence

**localStorage Key:**
```typescript
const STORAGE_KEY = 'user-language';

// Default value: 'es' (Spanish)
// Possible values: 'es' | 'en'
```

**Behavior:**
- Language preference persists across sessions
- Survives page refreshes
- Independent of other settings
- Falls back to Spanish if key is missing

---

## 5. User Experience

### 5.1 Language Change Flow

1. User opens Settings modal
2. User sees "Idioma / Language" selector in General Settings
3. User selects "English" from dropdown
4. **Immediate effect:**
   - All visible text updates to English
   - Modal labels, buttons, descriptions translate
   - No page reload required
5. User closes Settings
6. All other UI elements (Header, cards, modals) now in English
7. Language preference saved to localStorage

### 5.2 First-Time User Experience

**Spanish User (Default):**
- Platform loads in Spanish (current behavior)
- Tutorial starts in Spanish
- No action needed

**English User:**
1. Platform loads in Spanish
2. User opens Settings (⚙️)
3. User sees "Idioma / Language" selector
4. User selects "English"
5. Settings modal immediately translates
6. User continues in English

### 5.3 Tutorial Integration

**Tutorial Steps Translation:**
- All 7 main tutorial steps translated
- All 4 New Reading tutorial steps translated
- All 11 Settings tutorial steps translated
- Button labels ("Next →", "← Back", "Finish") translated
- Checkbox "No volver a mostrar" → "Don't show again"

**Tutorial Launch:**
- Tutorial language matches selected UI language
- If user changes language mid-tutorial, tutorial restarts in new language

---

## 6. Implementation Plan

### Phase 1: Foundation (Week 1)
- [ ] Create `lib/i18n/` directory structure
- [ ] Implement `I18nProvider` context and `useTranslation` hook
- [ ] Create Spanish (`es.ts`) and English (`en.ts`) translation files
- [ ] Add language selector to SettingsModal
- [ ] Test language switching mechanism

### Phase 2: Core Components (Week 2)
- [ ] Translate `Header.tsx`
- [ ] Translate `SettingsModal.tsx`
- [ ] Translate `NewReadingModal.tsx`
- [ ] Translate `KeyboardShortcutsModal.tsx`
- [ ] Translate `ConfirmDeleteModal.tsx`
- [ ] Translate `EditTitleModal.tsx`

### Phase 3: Tutorials (Week 3)
- [ ] Translate `lib/tutorial/steps.ts`
- [ ] Translate `lib/tutorial/config.ts`
- [ ] Update tutorial system to use translation hook
- [ ] Test all three tutorials in both languages

### Phase 4: Reader & Dashboard (Week 4)
- [ ] Translate reader navigation
- [ ] Translate `ReadingCard.tsx`
- [ ] Translate dashboard page
- [ ] Translate accessibility page

### Phase 5: Testing & Polish (Week 5)
- [ ] Manual testing of all flows in both languages
- [ ] Verify accessibility with screen readers in both languages
- [ ] Check for missing translations
- [ ] Update documentation
- [ ] Create TRD-011

---

## 7. Accessibility Considerations

### 7.1 ARIA Labels
All ARIA labels must be translated:
```tsx
<button aria-label={t('common.close')}>
  <X className="w-5 h-5" />
</button>
```

### 7.2 Screen Reader Announcements
Dynamic announcements must use translated strings:
```tsx
const { t } = useTranslation();
const announceChange = () => {
  announce(t('settings.languageChanged'));
};
```

### 7.3 Language Attribute
Update HTML `lang` attribute when language changes:
```tsx
useEffect(() => {
  document.documentElement.lang = language;
}, [language]);
```

---

## 8. Testing Strategy

### 8.1 Unit Tests
- Test `useTranslation` hook
- Test translation key resolution
- Test fallback behavior for missing keys
- Test localStorage persistence

### 8.2 Integration Tests
- Test language change across components
- Test tutorial language switching
- Test modal translations
- Test Settings persistence

### 8.3 Manual Testing Checklist
- [ ] Change language in Settings
- [ ] All visible text updates immediately
- [ ] No console errors
- [ ] Refresh page → language persists
- [ ] Start tutorial → appears in selected language
- [ ] Open keyboard shortcuts → appears in selected language
- [ ] Create new reading → modal appears in selected language
- [ ] Delete reading → confirmation appears in selected language
- [ ] All ARIA labels in correct language
- [ ] Screen reader announces in correct language

---

## 9. Performance Considerations

### Bundle Size Impact
- Translation files: ~3-5 KB (gzipped)
- Context provider: ~1 KB
- Total overhead: **~4-6 KB**

### Runtime Performance
- Translation lookup: O(1) for flat keys, O(n) for nested keys
- Context re-renders: Minimal (only when language changes)
- No network requests (all translations bundled)

### Optimization
- Use `React.memo()` for components that don't need translations
- Lazy-load translation files if bundle size becomes concern
- Consider code-splitting for future languages

---

## 10. Future Enhancements

### V2 Features (Future)
- [ ] Automatic language detection from browser settings
- [ ] Support for additional languages (French, Portuguese, etc.)
- [ ] Pluralization support (1 reading vs. 2 readings)
- [ ] Date/time formatting per locale
- [ ] Number formatting per locale
- [ ] Currency formatting (if adding payment features)

### Content Translation (Future)
- [ ] AI-powered translation of reading content
- [ ] Language tags for readings (EN, ES, FR, etc.)
- [ ] Filter readings by language

---

## 11. Success Metrics

### Launch Criteria
- ✅ All UI elements translated in both languages
- ✅ Language persists across sessions
- ✅ No visual bugs or layout issues
- ✅ All tutorials work in both languages
- ✅ Accessibility maintained (WCAG 2.1 AA)
- ✅ Performance impact < 5% bundle size increase

### Post-Launch Metrics
- **Adoption Rate:** % of users who change language to English
- **Error Rate:** Console errors related to missing translations
- **Performance:** Page load time impact
- **User Feedback:** Qualitative feedback on translation quality

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Missing translations | High | Comprehensive test checklist, fallback to key name |
| Performance degradation | Medium | Lazy-load translations, optimize context |
| Layout breaking in English | Medium | Test all components in both languages |
| Accessibility regression | High | Manual testing with screen readers in both languages |
| Bundle size bloat | Low | Use compression, monitor bundle size |

---

## 13. Open Questions

1. **Should we auto-detect language from browser settings?**
   - Decision: No for MVP, add in V2
   
2. **How do we handle user-generated content (titles, tags)?**
   - Decision: Keep in original language, don't translate
   
3. **Should we translate reading content?**
   - Decision: No, readings remain in original language
   
4. **Do we need pluralization support?**
   - Decision: Yes, add simple pluralization helper
   
5. **Should language selector be in Header or Settings?**
   - Decision: Settings (consistent with other preferences)

---

## 14. References

- [React i18n Best Practices](https://react.i18next.com/latest/using-with-hooks)
- [Next.js Internationalization](https://nextjs.org/docs/advanced-features/i18n-routing)
- [WCAG 2.1 Language of Page](https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html)
- [MDN: HTMLElement.lang](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/lang)

---

## Appendix A: Translation Key Examples

```typescript
// Flat structure (simpler lookup)
const translations = {
  'header.keyboardShortcuts': 'Atajos de Teclado',
  'header.viewTutorial': 'Ver Tutorial',
  'settings.title': 'Ajustes',
};

// Nested structure (more organized)
const translations = {
  header: {
    keyboardShortcuts: 'Atajos de Teclado',
    viewTutorial: 'Ver Tutorial',
  },
  settings: {
    title: 'Ajustes',
  },
};
```

**Recommendation:** Use **nested structure** for better organization and IDE autocomplete support.

---

## Appendix B: Example Component Migration

**Before (hardcoded Spanish):**
```tsx
export function Header() {
  return (
    <button title="Atajos de Teclado (Press ?)">
      <span className="text-2xl">⌨️</span>
    </button>
  );
}
```

**After (internationalized):**
```tsx
import { useTranslation } from '@/lib/i18n';

export function Header() {
  const { t } = useTranslation();
  
  return (
    <button title={t('header.keyboardShortcuts')}>
      <span className="text-2xl">⌨️</span>
    </button>
  );
}
```

---

**End of PRD-011**
