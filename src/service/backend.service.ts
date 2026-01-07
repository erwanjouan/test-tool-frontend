import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Execution} from '../model/execution';
import {TaskTemplate} from '../model/task-template';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private _http: HttpClient = inject(HttpClient)

  getTasksTemplateByCategory(category: string): Observable<TaskTemplate[]> {
    const params = new HttpParams({
      fromObject: {
        category: category
      }
    })
    return this._http.get<TaskTemplate[]>(environment.apiUrl + '/task-template', {params: params})
  }

  saveExecution(execution: Execution): Observable<Execution> {
    return this._http.post<Execution>(environment.apiUrl + '/execution/save', execution);
  }

  getExecutions(): Observable<Execution[]> {
    return this._http.get<Execution[]>(environment.apiUrl + '/execution')
  }

  getExecution(id: any): Observable<Execution> {
    return this._http.get<Execution>(environment.apiUrl + '/execution/' + id)
  }

  duplicateExecution(id: number | undefined): Observable<number> {
    return this._http.get<number>(environment.apiUrl + '/execution/' + id + '/duplicate')
  }

  cancelExecution(id: number | undefined) {
    return this._http.get<number>(environment.apiUrl + '/execution/' + id + '/cancel')
  }

  startExecution(id: number | undefined) {
    return this._http.post<number>(environment.apiUrl + '/execution/' + id + '/start', id)
  }

  deleteExecution(id: number | undefined): Observable<number> {
    return this._http.post<number>(environment.apiUrl + '/execution/' + id + 'delete/', {params: id})
  }
}
