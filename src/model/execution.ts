import {Task} from './task';
import {Status} from './status';

export interface Execution {
  id?: number
  name: string
  description: string
  status?: Status
  startTime?: Date
  endTime?: Date
  tasks: Task[]
}
