import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {NrTest} from '../model/nr-test';

@Injectable({
  providedIn: 'root'
})
export class RecevabiliteService {
  private url:string = 'http://localhost:8080/tnr/api/tests'

  constructor(private http:HttpClient) {
  }

  getNrTestsByPriorite(priorite:number): Observable<NrTest[]> {
    const params = new HttpParams({
      fromObject: {
        priorite: priorite
      }
    })
    return this.http.get<NrTest[]>(this.url, { params: params })
  }
}
