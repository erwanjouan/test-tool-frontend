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
    return this._http.get<TaskTemplate[]>(environment.apiUrl + '/task-templates', {params: params})
  }

  saveExecution(execution: Execution): Observable<Execution> {
    return this._http.post<Execution>(environment.apiUrl + '/executions/save', execution);
  }

  getExecutions(): Observable<Execution[]> {
    return this._http.get<Execution[]>(environment.apiUrl + '/executions')
  }

  getExecution(id: any): Observable<Execution> {
    return this._http.get<Execution>(environment.apiUrl + '/executions/' + id)
  }

  duplicateExecution(id: number | undefined): Observable<number> {
    return this._http.post<number>(environment.apiUrl + '/executions/duplicate', id)
  }

  cancelExecution(id: number | undefined) {
    return this._http.post<number>(environment.apiUrl + '/executions/cancel', id)
  }

  startExecution(id: number | undefined) {
    return this._http.post<number>(environment.apiUrl + '/executions/' + id + '/start', id)
  }

  deleteExecution(id: number | undefined): Observable<number> {
    return this._http.post<number>(environment.apiUrl + '/executions/delete', id)
  }
}
