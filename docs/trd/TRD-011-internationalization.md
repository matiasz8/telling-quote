# TRD-011: Internationalization (i18n)

**Status**: Planning  
**Date**: 2026-07-25  
**Related PRD**: PRD-011-internationalization  
**Phase**: 4+  

## Overview

Technical requirements for internationalization (i18n) support as defined in PRD-011.

## Architecture

### i18n Framework
- next-i18n-router for routing
- next-intl for translations
- Language detection from browser

### Supported Languages
- Spanish (es)
- English (en)
- Portuguese (pt-BR)
- [To be determined]

### Translation Management
- JSON-based translation files
- Structure: /public/locales/[lang]/[namespace].json
- Namespacing strategy for organization

## Components
- Language selector in settings
- `useTranslation()` hook
- Language switcher component

## Localization Scope
- UI text
- Error messages
- Help content
- Date/time formatting

## Dependencies
- None (standalone feature)

---

*This document is a placeholder. Full TRD to be developed when PRD-011 moves to active development.*
