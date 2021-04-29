import {Operator} from './enums';

export interface Job {
  id: string;
  data: Cell[][];
}

export interface JobsResponse {
  submissionUrl: string;
  jobs: Job[];
}

export interface NumberValue {
  number: number;
  text?: undefined;
  boolean?: undefined;
}
export interface TextValue {
  text: string;
  boolean?: undefined;
  number?: undefined;
}
export interface BooleanValue {
  boolean: boolean;
  number?: undefined;
  text?: undefined;
}

export type Value = NumberValue | TextValue | BooleanValue;

export interface ValueCell {
  value: Value;
  formula?: undefined;
}
export interface ReferenceCell {
  reference: string;
  value?: undefined;
  formula?: undefined;
}
export interface ErrorCell {
  error: string;
  value?: undefined;
  formula?: undefined;
}

export interface FormulaCell {
  formula: Formula;
  value?: undefined;
}

export type Formula = Partial<Record<Operator, Cell[]>> | ReferenceCell;

export type BaseCell = {cellId: string};
export type Cell = ValueCell | ErrorCell | FormulaCell | ReferenceCell;

export type Sheet = Cell[][];
