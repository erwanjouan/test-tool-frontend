import {NrTest} from './nr-test';

export interface NrTestExecution {
  name?:string
  description?:string
  nrTests?: NrTest[]
}
