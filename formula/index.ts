import {Operator} from '../enums';
import {
  Cell,
  ErrorCell,
  Formula,
  ReferenceCell,
  Sheet,
  ValueCell,
} from '../interfaces';
import {getCellAtPosition, getValueCellAtPosition} from '../sheet';

export function resolveFormula(
  formula: Formula,
  sheet: Sheet,
  acc = {} as ValueCell | ErrorCell
): ValueCell | ErrorCell {
  // console.log('formula: ', formula);
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
      if (formula.or !== undefined) {
        acc = calculateOr(formula.or as ReferenceCell[], sheet);
        return acc;
      }
    }
    if (Operator.IF in formula) {
      if (formula.if) {
        acc = calculateIf(formula.if as any[], sheet) as ValueCell;
        return acc;
      }
    }
    if (Operator.CONCAT in formula) {
      if (formula.concat !== undefined) {
        acc = calculateConcat(formula.concat as Cell[], sheet);
        return acc;
      }
    }
  }
  return acc;
}

function calculateSum(cells: ReferenceCell[], sheet: Sheet) {
  let result = 0;
  cells.forEach((cell) => {
    const cellValue = getValueCellAtPosition(cell.reference, sheet)?.value
      ?.number;
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
  const cellValueObjects = cells.map(
    (cell) => getValueCellAtPosition(cell.reference, sheet)?.value
  );
  const doesNotPassBooleanTypeCheck = cellValueObjects.some(
    (element) => 'number' in element || 'text' in element
  );
  if (doesNotPassBooleanTypeCheck)
    return {error: 'Formula did not pass boolean type check'} as ErrorCell;

  const filteredCells = cells.filter(
    (cell) => getValueCellAtPosition(cell.reference, sheet)?.value?.boolean
  );
  return {value: {boolean: filteredCells.length === cells.length}} as ValueCell;
}

function calculateOr(cells: ReferenceCell[], sheet: Sheet) {
  const cellValueObjects = cells.map(
    (cell) => getValueCellAtPosition(cell.reference, sheet)?.value
  );
  const doesNotPassBooleanTypeCheck = cellValueObjects.some(
    (element) => 'number' in element || 'text' in element
  );
  if (doesNotPassBooleanTypeCheck)
    return {error: 'Formula did not pass boolean type check'} as ErrorCell;

  const result = cells.some(
    (cell) => getValueCellAtPosition(cell.reference, sheet)?.value?.boolean
  );
  return {value: {boolean: result}} as ValueCell;
}

function calculateConcat(cells: Cell[], sheet: Sheet) {
  const cellStrings = cells.map((cell) => {
    if ('reference' in cell)
      return getValueCellAtPosition(cell.reference, sheet)?.value?.text;
    if ('value' in cell) return cell.value?.text;
  });
  const result = cellStrings.join('');
  return {value: {text: result}} as ValueCell;
}

function calculateIf(args: any[], sheet: Sheet) {
  const condition = args[0] as Formula | boolean;
  const firstValueCell = args[1];
  const secondValueCell = args[2];
  // console.log('args:', JSON.stringify(args, null, 4));
  // console.log('condition:', JSON.stringify(condition, null, 4));
  // console.log('firstValueCell:', JSON.stringify(firstValueCell, null, 4));
  // console.log('secondValueCell:', JSON.stringify(secondValueCell, null, 4));

  let conditionValue = null;

  if (typeof condition === 'boolean') {
    conditionValue = condition;
  } else {
    conditionValue = resolveFormula(condition, sheet).value?.boolean as boolean;
  }

  if (conditionValue) {
    if ('reference' in firstValueCell) {
      return getValueCellAtPosition(firstValueCell.reference, sheet);
    } else return firstValueCell as ValueCell;
  } else {
    if ('reference' in secondValueCell) {
      return getValueCellAtPosition(secondValueCell.reference, sheet);
    } else return secondValueCell as ValueCell;
  }
}
