export enum Operator {
  SUM = 'sum',
  MULTIPLY = 'multiply',
  DIVIDE = 'divide',
  IS_GREATER = 'is_greater',
  IS_EQUAL = 'is_equal',
  NOT = 'not',
  AND = 'and',
  OR = 'or',
  IF = 'if',
  CONCAT = 'concat',
}

export const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const ColumnPosition = Object.fromEntries(
  alphabet.map((key, index) => [key, index])
);
