# Code Review — 2026-06-28

## Bugs (ranked by severity)

---

### 1. SSE reconnect is silently broken after any error
**`src/app/common/service/event-source.service.ts:50`**

`connectToSSE` creates an Observable and registers `addEventListener` inside the subscriber callback. On error, the handler calls `this.connectToSSE(sseEventTypes)` — but returns the Observable without subscribing to it. The new `EventSource` is created but no listeners are ever attached. After the first connection error, all real-time updates stop forever with no console warning.

**Fix:** store the subscriptions from `subscribeToEventBus` and re-invoke it after a successful `refreshEventSource`.

---

### 2. `onerror` is overwritten 5 times — only the last fires
**`src/app/common/service/event-source.service.ts:50`**

`subscribeToEventBus` calls `connectToSSE([sseEvent])` once per event type. Each call does `this.eventSource.onerror = ...`, overwriting the previous handler. Only the 5th assignment survives. The other 4 event types' error handling is silently dropped.

**Fix:** set `onerror` once, outside the per-event-type loop.

---

### 3. `sseDataSubject.error()` crashes the retry path on the second error
**`src/app/common/service/event-source.service.ts:53`**

`Subject.error()` permanently terminates the Subject. The retry path calls `this.sseDataSubject.error(error)` before checking MAX_RETRIES. On the second error, calling `.error()` on an already-terminated Subject throws `ObjectUnsubscribedError`, halting execution before `close()` and `refreshEventSource()` run — the broken connection is never replaced. `sseDataSubject` is also never subscribed to anywhere, making it dead code.

**Fix:** remove `sseDataSubject` entirely.

---

### 4. `LogComponent` imports from the deleted service path — build fails
**`src/app/home/log/log.component.ts:3`**

```ts
import { EventSourceService } from '../../../service/event-source.service'; // deleted
```

The old file was deleted. This is a compile-time module-not-found error. Even after fixing the path, `connectToServerSentEvents()` and `close()` no longer exist on the new service.

---

### 5. `LogComponent.eventSourceSubscription` is never assigned — crash in `ngOnDestroy`
**`src/app/home/log/log.component.ts:22`**

```ts
readonly eventSourceSubscription: SubscriptionLike; // never assigned
```

The `subscribe()` return value on line 29 is discarded. `ngOnDestroy` calls `.unsubscribe()` on `undefined`, throwing a `TypeError`. The subscription also leaks permanently.

---

### 6. Delete button shown on RUNNING rows
**`src/app/home/execution-table/execution-table.component.html:70`**

The old template used `@else { <delete> }` so delete only showed when no other button was visible. The refactor changed it to `@if (!isRunning(row))`, which now shows delete for `CREATED` and `COMPLETED` — but also means a RUNNING row gets both a Cancel and a Delete button simultaneously. Clicking Delete on a running execution leaves an orphaned process on the backend with no DB record.

---

### 7. Three subscriptions overwrite `_eventBusSubscription` — two always leak
**`src/app/home/execution-table/execution-table.component.ts:57`**

```ts
this._eventBusSubscription = this._eventBus.on$(...executionCreated).subscribe(...)
this._eventBusSubscription = this._eventBus.on$(...executionDeleted).subscribe(...) // overwrites
this._eventBusSubscription = this._eventBus.on$(...executionUpdated).subscribe(...) // overwrites
```

`ngOnDestroy` only unsubscribes the last one. Every navigation cycle leaks two subscriptions that keep reacting on a destroyed component.

**Fix:** use a `Subscription` and `.add()`:

```ts
private _subs = new Subscription();

// in ngAfterViewInit:
this._subs.add(this._eventBus.on$(...).subscribe(...))

// in ngOnDestroy:
this._subs.unsubscribe();
```

---

### 8. `updateRow` guard `index >= -1` is always true
**`src/app/home/execution-table/execution-table.component.ts:161`**

```ts
const index = data.findIndex(item => item.id === execution.id)
if (index >= -1) {   // -1 >= -1 is true → writes data[-1] when not found
  data[index] = execution;
}
```

Should be `index >= 0` (or `index !== -1`). Currently a missing-execution SSE event silently writes to `data[-1]` (a non-index property on the array) and triggers a full spurious re-render.

---

### 9. `retryCount` is `static` and never reset
**`src/app/common/service/event-source.service.ts:13`**

After 50 cumulative errors (transient network, server restart), the counter reaches `MAX_RETRIES` and reconnection stops permanently, even if the server recovers. The count is never decremented on a successful connection.

**Fix:** change to an instance field and reset it to `0` after a successful connect.

---

## Angular 19 modernization

These are not bugs but the code reads like Angular 14.

### Replace manual subscription management with `takeUntilDestroyed`

Inject `DestroyRef` and pipe `takeUntilDestroyed(destroyRef)` instead of managing `SubscriptionLike` fields and `ngOnDestroy` manually:

```ts
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

private destroyRef = inject(DestroyRef);

this._eventBus.on$<ExecutionLog>(EventType.executionCreated)
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe(log => ...)
```

No `ngOnDestroy`, no subscription fields.

---

### Replace `MatTableDataSource` + Subject with a `WritableSignal`

```ts
executions = signal<Execution[]>([]);
```

Template uses `@for (row of executions(); track row.id)` with a plain `mat-table` bound to the signal. SSE handlers call `this.executions.update(list => [...])`. Eliminates the repeated `resetDataSource` dance and the paginator/sort re-assignment on every change.

---

### `NgZone.run()` is not needed with signals

`EventSourceService` currently calls `this._zone.run(() => subscriber.next(data))` to trigger change detection. Once the table uses signals, Angular's signal graph handles propagation automatically — no `NgZone` injection needed.

---

### Derive row state with pure functions, prepare for `computed()`

`isRunning`, `isCompleted`, `isCreated` are currently methods called on every render cycle. They're fine as pure functions, but with a signal-based table, `@for` with `track row.id` avoids re-rendering unchanged rows, making this essentially free.

---

## SSE flow — redesign recommendation

The current design has one `EventSource` but routes events through a Subject bus, which adds indirection and makes cleanup fragile. A cleaner Angular 19 approach:

1. **Wrap `EventSource` with a proper Observable teardown** — the `return () => es.close()` teardown callback handles cleanup automatically; no manual `close()` needed.
2. **One shared Observable, multiple consumers** — use RxJS `share()` so there is one real SSE connection regardless of how many components subscribe.
3. **`retry({ resetOnSuccess: true })`** from RxJS replaces the static counter and recursive reconnect call.
4. **Expose typed Observables (or signals via `toSignal()`) per event type** — no custom `EventBusService` indirection needed.

```ts
@Injectable({ providedIn: 'root' })
export class EventSourceService {
  private readonly _sseEvents: EventType[] = [
    EventType.taskStatusModified,
    EventType.logPublished,
    EventType.executionCreated,
    EventType.executionDeleted,
    EventType.executionUpdated,
  ];

  private sseStream$ = new Observable<{ type: EventType; log: ExecutionLog }>(sub => {
    const es = new EventSource(`${environment.apiUrl}/sse/subscribe/${uuid()}`);
    this._sseEvents.forEach(type => {
      es.addEventListener(type, (e: MessageEvent) =>
        sub.next({ type, log: JSON.parse(e.data) })
      );
    });
    es.onerror = () => sub.error(new Error('SSE connection error'));
    return () => es.close(); // automatic teardown on unsubscribe
  }).pipe(
    retry({ delay: 2000, resetOnSuccess: true }),
    share()
  );

  on$<T>(eventType: EventType): Observable<T> {
    return this.sseStream$.pipe(
      filter(e => e.type === eventType),
      map(e => e.log as T)
    );
  }
}
```

Components then call `this._sseService.on$<ExecutionLog>(EventType.executionCreated)` directly — `EventBusService` becomes unnecessary. With `toSignal()`, the subscription is also managed automatically:

```ts
executionCreated = toSignal(
  this._sseService.on$<ExecutionLog>(EventType.executionCreated)
);
```
