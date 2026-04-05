# Documentation Workflow

## Alcance

Este workflow aplica a toda feature nueva y a cambios relevantes en features existentes.

## Documentos obligatorios

Para cada trabajo se requiere:

1. `PRD`: alcance de producto y criterios de aceptacion.
2. `TRD`: implementacion tecnica, contratos y estrategia de pruebas.
3. `ARD`: decision arquitectonica asociada y consecuencias.

La politica del proyecto es `PRD + TRD + ARD siempre obligatorios`.

## Contenido minimo por documento

### PRD

- Problem
- Goals
- Non-goals
- Users and journeys
- Functional requirements
- Accessibility requirements
- Metrics
- Acceptance criteria

### TRD

- Overview
- Dependencies
- Data model
- API contracts
- Security and privacy
- Failure modes
- Observability
- Test strategy

### ARD

- Status
- Context
- Decision
- Consequences
- Follow-up actions

## Naming convention

- PRD: `PRD-XXX-short-name.md`
- TRD: `TRD-XXX-short-name.md`
- ARD: `ARD-XXX-short-name.md`

Usar ids incrementales y nombres cortos descriptivos.

## Flujo de actualizacion

1. Definir o actualizar PRD.
2. Definir o actualizar TRD.
3. Definir o actualizar ARD.
4. Actualizar estado en `docs/00-roadmap/phases.md`.
5. Verificar trazabilidad cruzada entre los 3 documentos.

## Definition of Done documental

- [ ] PRD actualizado y enlazado.
- [ ] TRD actualizado y enlazado.
- [ ] ARD actualizado y enlazado.
- [ ] Fase/estado actualizado en roadmap.
- [ ] PR incluye seccion de trazabilidad documental.
