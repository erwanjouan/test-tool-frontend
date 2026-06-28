import {Injectable} from '@angular/core';
import {filter, map, Observable, Subject} from 'rxjs';
import {EventType} from '../../../model/event-type';

interface EventBusEvent<T extends any> {
  type: EventType;
  payload: T;
}

// A service is a singleton class that Angular creates once and shares across the whole app.
// Components can inject it to share data or communicate with each other without being
// directly connected (no parent-child relationship required).
@Injectable({
  providedIn: 'root' // Angular creates one single instance for the entire app
})
export class EventBusService {

  // Subject is like an event emitter: you can push values into it with .next()
  // and any part of the app that subscribed will receive those values.
  // It acts as the central message channel for the whole application.
  private readonly eventBus = new Subject<EventBusEvent<any>>();

  // Publishes an event so that any subscriber listening for that type will be notified.
  emit<T>(type: EventType, payload: T): void {
    this.eventBus.next({type, payload});
  }

  // Returns an Observable that a component can subscribe to in order to react
  // to a specific event type. Only events matching the requested type are forwarded.
  // Observable is a stream: the callback runs every time a new value arrives.
  on$<T>(eventType: EventType): Observable<T> {
    return this.eventBus.asObservable()
      .pipe(
        // Ignore events that don't match the requested type
        filter((event: EventBusEvent<T>) => event.type === eventType),
        // Extract just the payload, discarding the type wrapper
        map((event: EventBusEvent<T>) => event.payload)
      );
  }
}
