import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { scan } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { EventBusService } from '../../common/service/event-bus.service';
import { EventType } from '../../../model/event-type';
import { ExecutionLog } from '../../../model/execution-log';

@Component({
  selector: 'app-log',
  imports: [MatExpansionModule],
  templateUrl: './log.component.html',
  standalone: true,
  styleUrl: './log.component.scss'
})
export class LogComponent {
  private _eventBus = inject(EventBusService);

  eventData = toSignal(
    this._eventBus.on$<ExecutionLog>(EventType.logPublished).pipe(
      scan((acc, log) => [...acc, log.messsage ?? ''], [] as string[])
    ),
    { initialValue: [] as string[] }
  );
}
