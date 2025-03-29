import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, SubscriptionLike} from 'rxjs';
import {EventSourceService} from '../../../service/event-source.service';
import {AsyncPipe} from '@angular/common';
import {MatAccordion, MatExpansionModule, MatExpansionPanel, MatExpansionPanelTitle} from '@angular/material/expansion';

@Component({
  selector: 'app-log',
  imports: [MatExpansionModule],
  templateUrl: './log.component.html',
  standalone: true,
  styleUrl: './log.component.scss'
})
export class LogComponent implements OnInit, OnDestroy{

  url = 'http://localhost:8080/tnr/api/sse';
  options = { withCredentials: false };
  eventNames=  ['log']

  eventData:string[]=[]

  readonly eventSourceSubscription: SubscriptionLike;

  constructor(private eventSourceService: EventSourceService) {
  }

  ngOnInit(): void {
    this.eventSourceService.connectToServerSentEvents(this.url, this.options, this.eventNames)
      .subscribe(messageEvent => {
        this.eventData.push(messageEvent.data)
      })
    }

  ngOnDestroy() {
    this.eventSourceSubscription.unsubscribe();
    this.eventSourceService.close();
  }
}
