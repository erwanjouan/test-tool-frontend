import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {NrTest} from '../model/nr-test';
import {NrExecution} from '../model/nr-execution';

@Injectable({
  providedIn: 'root'
})
export class RecevabiliteService {

  private rootUrl: string = 'http://localhost:8080/tnr/api'

  constructor(private http: HttpClient) {
  }

  getNrTestsByPriorite(priorite: number): Observable<NrTest[]> {
    const params = new HttpParams({
      fromObject: {
        priorite: priorite
      }
    })
    return this.http.get<NrTest[]>(this.rootUrl+ '/tests', {params: params})
  }

  createExecution(nrExecution:NrExecution): Observable<NrExecution> {
    return this.http.post<NrExecution>(this.rootUrl + '/executions/save', nrExecution);
  }

  getExecutions():Observable<NrExecution[]> {
    return this.http.get<NrExecution[]>(this.rootUrl+'/executions')
  }
}
