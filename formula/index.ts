import {Operator} from '../enums';
import {
  Cell,
  FormulaCell,
  ReferenceCell,
  Sheet,
  ValueCell,
} from '../interfaces';
import {getCellAtPosition, getValueCellAtPosition} from '../sheet';

export function resolveFormula(formulaCell: FormulaCell, sheet: Sheet): Cell {
  console.log('formulaCell: ', formulaCell);
  if (formulaCell.formula) {
    if ('reference' in formulaCell.formula) {
      // resolve ReferenceCell
      const resultCell = getCellAtPosition(
        formulaCell.formula.reference,
        sheet
      );
      if ('formula' in resultCell) {
        return resolveFormula(resultCell as FormulaCell, sheet);
      } else {
        return resultCell;
      }
    } else {
      // resolve FormulaOperator
      if (Operator.SUM in formulaCell.formula) {
        if (formulaCell.formula.sum !== undefined) {
          const resultCell = calculateSum(
            formulaCell.formula.sum as ReferenceCell[],
            sheet
          );
          return resultCell;
        }
      }
      if (Operator.MULTIPLY in formulaCell.formula) {
        return formulaCell;
      }
      if (Operator.DIVIDE in formulaCell.formula) {
        return formulaCell;
      }
      if (Operator.IS_GREATER in formulaCell.formula) {
        return formulaCell;
      }
      if (Operator.IS_EQUAL in formulaCell.formula) {
        return formulaCell;
      }
      if (Operator.NOT in formulaCell.formula) {
        return formulaCell;
      }
      if (Operator.AND in formulaCell.formula) {
        return formulaCell;
      }
      if (Operator.OR in formulaCell.formula) {
        return formulaCell;
      }
      if (Operator.IF in formulaCell.formula) {
        return formulaCell;
      }
      if (Operator.CONCAT in formulaCell.formula) {
        return formulaCell;
      }
    }
    return formulaCell;
  }
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
