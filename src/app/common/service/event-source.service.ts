import { Injectable } from '@angular/core';
import { Observable, retry, share } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { environment } from '../../../environments/environment';
import { EventType } from '../../../model/event-type';
import { ExecutionLog } from '../../../model/execution-log';
import { EventBusService } from './event-bus.service';

// This service manages the SSE (Server-Sent Events) connection to the backend.
// SSE is a protocol where the server can push updates to the browser at any time
// over a persistent HTTP connection — no polling needed.
@Injectable({ providedIn: 'root' })
export class EventSourceService {

  // We want to listen to every event type the backend can send, so we register
  // a listener for each value declared in the EventType enum.
  private readonly _sseEvents = Object.values(EventType);

  // An Observable that wraps the native EventSource API (the browser's built-in SSE client).
  // The function inside the Observable constructor runs when the first subscriber appears.
  private readonly stream$ = new Observable<{ type: EventType; log: ExecutionLog }>(subscriber => {
    // Open a persistent connection to the backend SSE endpoint.
    // Each browser tab gets a unique URL (uuid) so the server can tell clients apart.
    const es = new EventSource(`${environment.apiUrl}/sse/subscribe/${uuid()}`);

    // For each event type, register a listener that parses the JSON payload
    // and forwards it into the Observable stream.
    this._sseEvents.forEach(type => {
      es.addEventListener(type, (e: MessageEvent) =>
        subscriber.next({ type, log: JSON.parse(e.data) })
      );
    });

    // If the connection drops, signal the Observable with an error so retry can kick in.
    es.onerror = () => subscriber.error(new Error('SSE connection error'));

    // This teardown function is called when the Observable is unsubscribed.
    // It cleanly closes the SSE connection to avoid resource leaks.
    return () => es.close();
  }).pipe(
    // If the connection fails, wait 2 seconds and reconnect automatically.
    // resetOnSuccess means the retry counter resets after a successful reconnection.
    retry({ delay: 2000, resetOnSuccess: true }),
    // share() ensures only one EventSource is opened regardless of how many
    // subscribers are listening — they all share the same underlying connection.
    share()
  );

  // Angular calls this constructor when creating the service.
  // We subscribe here so the SSE connection starts at app boot (see provideAppInitializer
  // in app.config.ts), and forward every incoming event to the EventBusService
  // so the rest of the app can react to it without knowing about SSE at all.
  constructor(private readonly _eventBus: EventBusService) {
    this.stream$.subscribe(({ type, log }) => this._eventBus.emit(type, log));
  }
}
