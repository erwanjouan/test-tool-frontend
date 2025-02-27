import {NrExecutionParam} from './nr-execution-param';

export interface NrExecution {
  id?:number
  name?:string
  description?:string
  status?: string
  nrExecutionParams?: NrExecutionParam[]
}
