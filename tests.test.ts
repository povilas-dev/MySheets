import {resolveFormula} from './formula';
import {
  deepResolveFormulaSheet,
  mockResultSheet,
  mockSumSheetBuilder,
} from './mocks';
import {
  getCellAtPosition,
  getValueCellAtPosition,
  updateCellAtPosition,
} from './sheet';
describe('Sheet', () => {
  describe('getReferencedCell', () => {
    it('should return a value for provided cell reference id', () => {
      const mockSheet = mockResultSheet;
      const resultCellA1 = getCellAtPosition('A1', mockSheet);
      const resultCellA2 = getCellAtPosition('A2', mockSheet);
      const resultCellC3 = getCellAtPosition('C3', mockSheet);

      expect(resultCellA1.value).toEqual({number: 5});
      expect(resultCellA2.value).toEqual({text: 'AA'});
      expect(resultCellC3.value).toEqual({text: 'CCC'});
    });
  });
  describe('updateCellAtPosition', () => {
    it('should update cell value at position in sheet', () => {
      const sheet = mockSumSheetBuilder().build();
      const updatedValue = {value: {number: 0}};
      updateCellAtPosition('A1', updatedValue, sheet);
      expect(getValueCellAtPosition('A1', sheet)?.value.number).toBe(0);
    });
  });
  describe('resolveFormula', () => {
    it('should resolve a deep formula cell into a value cell', () => {
      const sheet = deepResolveFormulaSheet;
      expect(resolveFormula({formula: {reference: 'B1'}}, sheet)).toEqual({
        value: {text: 'Last'},
      });
    });
    it('should resolve a shallow formula cell into a value cell', () => {
      const sheet = deepResolveFormulaSheet;
      expect(resolveFormula({formula: {reference: 'H1'}}, sheet)).toEqual({
        value: {text: 'Last'},
      });
    });
    describe('SUM', () => {
      it('should resolve a sum formula where every reference is direct', () => {
        const sheet = mockSumSheetBuilder().build();
        const sumFormula = {
          formula: {
            sum: [
              {
                reference: 'A1',
              },
              {
                reference: 'B1',
              },
            ],
          },
        };
        expect(resolveFormula(sumFormula, sheet)).toEqual({
          value: {number: 10},
        });
      });
      it.skip('should resolve a sum formula with a deep reference', () => {
        const sheet = mockSumSheetBuilder().build();
        const sumFormula = {
          formula: {
            sum: [
              {
                reference: 'C1',
              },
              {
                reference: 'D1',
              },
            ],
          },
        };
        expect(resolveFormula(sumFormula, sheet)).toEqual({
          value: {number: 24},
        });
      });
    });
  });
});
