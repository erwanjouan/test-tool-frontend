# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:4200 (uses environment.development.ts)
npm run build      # production build → dist/frontend/
npm test           # Karma/Jasmine test runner (Chrome)
ng test --include='**/foo.component.spec.ts'  # run a single spec file
```

The backend must be running locally at `http://localhost:8080` for `npm start` to work. It lives at `$HOME/Development/java/bpce/backend`.

## Architecture

**Domain**: Users create *Executions* (named groups of *Tasks*), launch them asynchronously on the backend, and watch status updates in real time via SSE.

**Routes**
- `/home` — `HomeComponent`: execution list table with live status, actions (start/cancel/delete/duplicate)
- `/execution/:executionId` — `CreateComponent`: multi-step stepper to create or pre-fill an execution from an existing one

**Service layer**
- `src/service/backend.service.ts` — all REST calls (`/scheduler/api/*`)
- `src/app/common/service/event-source.service.ts` — opens a persistent SSE connection to `/scheduler/api/sse/subscribe/{uuid}`, listens for named event types, and re-emits payloads via `EventBusService`
- `src/app/common/service/event-bus.service.ts` — internal typed pub/sub (`Subject`-based); components call `on$<T>(EventType.xxx)` to subscribe

**Real-time update flow**
`EventSourceService` (initialised at app startup via `provideAppInitializer`) → parses `ExecutionLog` payloads → `EventBusService.emit(EventType, payload)` → `ExecutionTableComponent` subscribes and mutates its `MatTableDataSource` in-place without re-fetching.

**Models** (`src/model/`)
- `Execution` → contains `Task[]`, each `Task` references a `TaskTemplate` and holds `Param[]`
- `ExecutionLog` — SSE payload wrapping an `Execution` and a `Task` with log metadata
- `Status` enum: `CREATED | RUNNING | COMPLETED | CANCELLED | ERROR`
- `EventType` enum — mirrors backend SSE event names (e.g. `EXECUTION_CREATED`)

**Create flow** (`src/app/create/`)
Three-step Angular Material stepper:
1. `TaskTemplateSelectionComponent` — fetches templates by category, user picks tasks
2. `TaskParametersComponent` / `TaskParamComponent` — per-task parameter forms
3. `TaskConfirmationComponent` — review before save

`CreateComponent.ngOnInit` loads an existing execution when `:executionId` is present (edit/re-run mode).

## Key conventions

- All components are **standalone** (`standalone: true`), no NgModules except `AppRoutingModule`.
- Styles use **SCSS**; Material theme is `magenta-violet` (set in `angular.json`).
- `inject()` function is preferred over constructor injection throughout.
- Dev vs prod API URL is handled entirely via `src/environments/` file replacement (no proxy config).
