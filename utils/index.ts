import {ColumnPosition} from '../enums';
import {Cell} from '../interfaces';

export function parseCellPosition(cellPosition: string) {
  const positionStrSplit = cellPosition.split('');
  const parsedPosition = {
    row: ColumnPosition[positionStrSplit[0]] as number,
    column: parseInt(positionStrSplit[1]) - 1,
  };
  return parsedPosition;
}
