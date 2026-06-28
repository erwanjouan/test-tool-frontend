import {Execution} from './execution';
import {Task} from './task';

export interface ExecutionLog {
  logLevel?: string,
  messsage?: string,
  eventDateTime?: Date
  logType: string
  execution: Execution
  task: Task
}
