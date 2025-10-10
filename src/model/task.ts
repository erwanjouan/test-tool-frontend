import {Param} from './param';
import {TaskTemplate} from './task-template';

export interface Task {
  id?: number
  status: string
  startTime?: Date
  endTime?: Date
  taskTemplate: TaskTemplate
  params: Param[]
}
