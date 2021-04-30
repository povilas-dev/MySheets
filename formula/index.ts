import {Operator} from '../enums';
import {
  Cell,
  Formula,
  FormulaCell,
  ReferenceCell,
  Sheet,
  ValueCell,
} from '../interfaces';
import {getCellAtPosition, getValueCellAtPosition} from '../sheet';

export function resolveFormula(
  formula: Formula,
  sheet: Sheet,
  acc = {} as ValueCell
): ValueCell {
  console.log('formula: ', formula);
  if ('reference' in formula) {
    // resolve ReferenceCell
    const resultCell = getCellAtPosition(formula.reference, sheet);
    if ('formula' in resultCell) {
      return resolveFormula(resultCell.formula as Formula, sheet, acc);
    } else {
      acc = resultCell as ValueCell;
      return acc;
    }
  } else {
    // resolve FormulaOperator
    if (Operator.SUM in formula) {
      if (formula.sum !== undefined) {
        acc = calculateSum(formula.sum as ReferenceCell[], sheet);
        return acc;
      }
    }
    if (Operator.MULTIPLY in formula) {
      if (formula.multiply !== undefined) {
        acc = calculateMultiply(formula.multiply as ReferenceCell[], sheet);
        return acc;
      }
    }
    if (Operator.DIVIDE in formula) {
      if (formula.divide !== undefined) {
        acc = calculateDivide(formula.divide as ReferenceCell[], sheet);
        return acc;
      }
    }
    if (Operator.IS_GREATER in formula) {
      if (formula.is_greater !== undefined) {
        acc = calculateIsGreater(formula.is_greater as ReferenceCell[], sheet);
        return acc;
      }
    }
    if (Operator.IS_EQUAL in formula) {
      if (formula.is_equal !== undefined) {
        acc = calculateIsEqual(formula.is_equal as ReferenceCell[], sheet);
        return acc;
      }
    }
    if (Operator.NOT in formula) {
      if (formula.not !== undefined) {
        acc = calculateNegation(formula.not as ReferenceCell, sheet);
        return acc;
      }
    }
    if (Operator.AND in formula) {
      if (formula.and !== undefined) {
        acc = calculateAnd(formula.and as ReferenceCell[], sheet);
        return acc;
      }
    }
    if (Operator.OR in formula) {
      return {} as ValueCell;
    }
    if (Operator.IF in formula) {
      return {} as ValueCell;
    }
    if (Operator.CONCAT in formula) {
      return {} as ValueCell;
    }
  }
  return acc;
}

function calculateSum(cells: ReferenceCell[], sheet: Sheet) {
  let result = 0;
  cells.forEach((cell) => {
    const cellValue = getValueCellAtPosition(cell.reference, sheet)?.value
      ?.number;
    console.log('Cell Value: ', cellValue);
    if (cellValue !== undefined) {
      result += cellValue;
    }
  });
  return {value: {number: result}} as ValueCell;
}

function calculateMultiply(cells: ReferenceCell[], sheet: Sheet) {
  let result = 1;
  cells.forEach((cell) => {
    const cellValue = getValueCellAtPosition(cell.reference, sheet)?.value
      ?.number;
    if (cellValue !== undefined) {
      result *= cellValue;
    }
  });
  return {value: {number: result}} as ValueCell;
}

function calculateDivide(cells: ReferenceCell[], sheet: Sheet) {
  const firstCell = getValueCellAtPosition(cells[0].reference, sheet);
  let result = firstCell.value.number as number;
  const slicedCells = cells.slice(1);
  slicedCells.forEach((cell) => {
    const cellValue = getValueCellAtPosition(cell.reference, sheet)?.value
      ?.number;
    if (cellValue !== undefined) {
      result = result / cellValue;
    }
  });
  return {value: {number: result}} as ValueCell;
}

function calculateIsGreater(cells: ReferenceCell[], sheet: Sheet) {
  //return errors if length = 0
  const firstCell = getValueCellAtPosition(cells[0].reference, sheet);
  const secondCell = getValueCellAtPosition(cells[1].reference, sheet);

  const firstValue = firstCell.value.number as number;
  const secondValue = secondCell.value.number as number;

  const result = firstValue > secondValue;
  return {value: {boolean: result}} as ValueCell;
}

function calculateIsEqual(cells: ReferenceCell[], sheet: Sheet) {
  //return errors if length = 0
  const firstCell = getValueCellAtPosition(cells[0].reference, sheet);
  const secondCell = getValueCellAtPosition(cells[1].reference, sheet);

  const firstValue = firstCell.value.number as number;
  const secondValue = secondCell.value.number as number;
  const result = firstValue === secondValue;
  return {value: {boolean: result}} as ValueCell;
}

function calculateNegation(cell: ReferenceCell, sheet: Sheet) {
  const valueCell = getValueCellAtPosition(cell.reference, sheet);
  const value = valueCell.value.boolean as boolean;
  const result = !value;
  return {value: {boolean: result}} as ValueCell;
}

function calculateAnd(cells: ReferenceCell[], sheet: Sheet) {
  const filteredCells = cells.filter(
    (cell) => getValueCellAtPosition(cell.reference, sheet)?.value?.boolean
  );
  return {value: {boolean: filteredCells.length === cells.length}} as ValueCell;
}
