import {resolveFormula} from './formula';
import {
  Cell,
  ErrorCell,
  Formula,
  FormulaCell,
  Job,
  Sheet,
  ValueCell,
} from './interfaces';
import {parseCellPosition} from './utils';

export function getValueCellAtPosition(
  cellPosition: string,
  sheet: Sheet
): ValueCell {
  const position = parseCellPosition(cellPosition);
  const cell = sheet[position.column][position.row];
  if ('formula' in cell) {
    const resultCell = resolveFormula(cell.formula as Formula, sheet);
    updateCellAtPosition(cellPosition, resultCell, sheet);
    return resultCell as ValueCell;
  }
  return cell as ValueCell;
}

export function updateCellAtPosition(
  cellPosition: string,
  cellValue: ValueCell | ErrorCell,
  sheet: Sheet
) {
  const position = parseCellPosition(cellPosition);
  sheet[position.column][position.row] = cellValue;
}

export function findFormulas(
  sheet: Sheet
): {formulaCell: FormulaCell; cellPosition: {row: number; column: number}}[] {
  const rowCount = sheet.length;
  let formulas: {
    formulaCell: FormulaCell;
    cellPosition: {row: number; column: number};
  }[] = [];
  for (let i = 0; i < rowCount; i++) {
    sheet[i].forEach((cell: Cell, index: number) => {
      if (cell.formula !== undefined) {
        formulas.push({
          formulaCell: cell,
          cellPosition: {row: i, column: index},
        });
      }
    });
  }
  return formulas;
}
