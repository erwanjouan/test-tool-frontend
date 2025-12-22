import {Injectable} from '@angular/core';
import {filter, map, Observable, Subject} from 'rxjs';
import {EventType} from '../../../model/event-type';

interface EventBusEvent<T extends any> {
  type: EventType;
  payload: T;
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {

  private readonly eventBus = new Subject<EventBusEvent<any>>();

  emit<T>(type: EventType, payload: T): void {
    this.eventBus.next({type, payload});
  }

  on$<T>(eventType: EventType): Observable<T> {
    return this.eventBus.asObservable()
      .pipe(
        filter((event: EventBusEvent<T>) => event.type === eventType),
        map((event: EventBusEvent<T>) => event.payload)
      );
  }
}
