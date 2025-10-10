import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Execution} from '../model/execution';
import {TaskTemplate} from '../model/task-template';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private rootUrl: string = 'http://localhost:8080/scheduler/api'
  private _http: HttpClient = inject(HttpClient)

  getTasksTemplateByCategory(category: string): Observable<TaskTemplate[]> {
    const params = new HttpParams({
      fromObject: {
        category: category
      }
    })
    return this._http.get<TaskTemplate[]>(this.rootUrl + '/task-template', {params: params})
  }

  saveExecution(execution: Execution): Observable<Execution> {
    return this._http.post<Execution>(this.rootUrl + '/execution/save', execution);
  }

  getExecutions(): Observable<Execution[]> {
    return this._http.get<Execution[]>(this.rootUrl + '/execution')
  }

  getExecution(id: any): Observable<Execution> {
    return this._http.get<Execution>(this.rootUrl + '/execution/' + id)
  }

  duplicateExecution(id: number | undefined): Observable<number> {
    return this._http.get<number>(this.rootUrl + '/executions/' + id + '/duplicate')
  }

  cancelExecution(id: number | undefined) {
    return this._http.get<number>(this.rootUrl + '/executions/' + id + '/cancel')
  }

  startExecution(id: number | undefined) {
    return this._http.get<number>(this.rootUrl + '/executions/' + id + '/start')
  }

  deleteExecution(id: number | undefined): Observable<number> {
    return this._http.post<number>(this.rootUrl + '/executions/' + id + 'delete/', {params: id})
  }
}
