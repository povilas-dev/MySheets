import {Operator} from '../enums';
import {
  Cell,
  ErrorCell,
  Formula,
  ReferenceCell,
  Sheet,
  ValueCell,
} from '../interfaces';
import {getValueCellAtPosition} from '../sheet';

export function resolveFormula(
  formula: Formula,
  sheet: Sheet
): ValueCell | ErrorCell {
  if ('reference' in formula) {
    // resolve ReferenceCell
    return getValueCellAtPosition(formula.reference, sheet);
  } else {
    // resolve FormulaOperator
    if (Operator.SUM in formula) {
      if (formula.sum !== undefined) {
        calculateSum(formula.sum as ReferenceCell[], sheet);
        return calculateSum(formula.sum as ReferenceCell[], sheet);
      }
    }
    if (Operator.MULTIPLY in formula) {
      if (formula.multiply !== undefined) {
        return calculateMultiply(formula.multiply as ReferenceCell[], sheet);
      }
    }
    if (Operator.DIVIDE in formula) {
      if (formula.divide !== undefined) {
        return calculateDivide(formula.divide as ReferenceCell[], sheet);
      }
    }
    if (Operator.IS_GREATER in formula) {
      if (formula.is_greater !== undefined) {
        return calculateIsGreater(formula.is_greater as ReferenceCell[], sheet);
      }
    }
    if (Operator.IS_EQUAL in formula) {
      if (formula.is_equal !== undefined) {
        return calculateIsEqual(formula.is_equal as ReferenceCell[], sheet);
      }
    }
    if (Operator.NOT in formula) {
      if (formula.not !== undefined) {
        return calculateNegation(formula.not as ReferenceCell, sheet);
      }
    }
    if (Operator.AND in formula) {
      if (formula.and !== undefined) {
        return calculateAnd(formula.and as ReferenceCell[], sheet);
      }
    }
    if (Operator.OR in formula) {
      if (formula.or !== undefined) {
        return calculateOr(formula.or as ReferenceCell[], sheet);
      }
    }
    if (Operator.IF in formula) {
      if (formula.if) {
        return calculateIf(formula.if as any[], sheet) as ValueCell;
      }
    }
    if (Operator.CONCAT in formula) {
      if (formula.concat !== undefined) {
        return calculateConcat(formula.concat as Cell[], sheet);
      }
    }
  }
  return formula as ValueCell;
}

function calculateSum(cells: ReferenceCell[], sheet: Sheet) {
  if (cells.length <= 0) {
    return {error: 'Values for number operation are missing'};
  }
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
  if (cells.length <= 0) {
    return {error: 'Values for number operation are missing'};
  }
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
  if (cells.length <= 0) {
    return {error: 'Values for number operation are missing'};
  }
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
  if (cells.length <= 0) {
    return {error: 'Values for number operation are missing'};
  }
  const firstCell = getValueCellAtPosition(cells[0].reference, sheet);
  const secondCell = getValueCellAtPosition(cells[1].reference, sheet);

  const firstValue = firstCell.value.number as number;
  const secondValue = secondCell.value.number as number;

  const result = firstValue > secondValue;
  return {value: {boolean: result}} as ValueCell;
}

function calculateIsEqual(cells: ReferenceCell[], sheet: Sheet) {
  if (cells.length <= 0) {
    return {error: 'Values for number operation are missing'};
  }
  if (cells.length <= 0) {
    return {error: 'Values for number operation are missing'};
  }
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
  const condition = args[0] as Formula;
  const firstValueCell = args[1];
  const secondValueCell = args[2];
  let conditionValue = resolveFormula(condition, sheet).value?.boolean;

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
