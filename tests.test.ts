import {resolveFormula} from './formula';
import {mockBooleanSheet} from './mocks/boolean-sheet';
import {mockDivideSheet} from './mocks/divide-sheet';
import {deepResolveFormulaSheet, mockResultSheet} from './mocks/mocks';
import {mockMultiplySheet} from './mocks/multiply-sheet';
import {mockStringSheet} from './mocks/string-sheet';
import {mockSumSheet} from './mocks/sum-sheet';
import {getValueCellAtPosition, updateCellAtPosition} from './sheet';
describe('Sheet', () => {
  describe('getValueCellAtPosition', () => {
    it('should return a value for provided cell reference id', () => {
      const mockSheet = mockResultSheet;
      const resultCellA1 = getValueCellAtPosition('A1', mockSheet);
      const resultCellA2 = getValueCellAtPosition('A2', mockSheet);
      const resultCellC3 = getValueCellAtPosition('C3', mockSheet);

      expect(resultCellA1.value).toEqual({number: 5});
      expect(resultCellA2.value).toEqual({text: 'AA'});
      expect(resultCellC3.value).toEqual({text: 'CCC'});
    });
  });
  describe('updateCellAtPosition', () => {
    it('should update cell value at position in sheet', () => {
      const sheet = mockSumSheet();
      const updatedValue = {value: {number: 0}};
      updateCellAtPosition('A1', updatedValue, sheet);
      expect(getValueCellAtPosition('A1', sheet)?.value.number).toBe(0);
    });
  });
  describe('getValueCellAtPosition', () => {
    it('should return a value cell for given shallow reference', () => {
      const mockSheet = mockResultSheet;
      const resultCellA1 = getValueCellAtPosition('A1', mockSheet);
      const resultCellA2 = getValueCellAtPosition('A2', mockSheet);
      const resultCellC3 = getValueCellAtPosition('C3', mockSheet);

      expect(resultCellA1.value).toEqual({number: 5});
      expect(resultCellA2.value).toEqual({text: 'AA'});
      expect(resultCellC3.value).toEqual({text: 'CCC'});
    });
    it('should return a value cell for given formula cell', () => {
      const sheet = mockSumSheet();
      expect(getValueCellAtPosition('C1', sheet)).toEqual({
        value: {number: 14},
      });
    });
    it('should update reference cell to value cell in sheet', () => {
      const sheet = mockSumSheet();
      const resultCell = getValueCellAtPosition('C1', sheet);
      expect(getValueCellAtPosition('C1', sheet)).toEqual(resultCell);
    });
  });
  describe('resolveFormula', () => {
    it('should resolve a deep formula cell into a value cell', () => {
      const sheet = deepResolveFormulaSheet;
      const formulaCell = {formula: {reference: 'B1'}};
      expect(resolveFormula(formulaCell.formula, sheet)).toEqual({
        value: {text: 'Last'},
      });
    });
    it('should resolve a shallow formula cell into a value cell', () => {
      const sheet = deepResolveFormulaSheet;
      const formulaCell = {formula: {reference: 'H1'}};
      expect(resolveFormula(formulaCell.formula, sheet)).toEqual({
        value: {text: 'Last'},
      });
    });
    describe('SUM', () => {
      it('should resolve a SUM formula where every reference is direct', () => {
        const sheet = mockSumSheet();
        const sumFormulaCell = {
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
        expect(resolveFormula(sumFormulaCell.formula, sheet)).toEqual({
          value: {number: 10},
        });
      });
      it('should resolve a SUM formula with a cell where a reference is to a SUM formula', () => {
        const sheet = mockSumSheet();
        const sumFormulaCell = {
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
        const resultCell = resolveFormula(sumFormulaCell.formula, sheet);
        expect(resultCell).toEqual({
          value: {number: 38},
        });
      });
      it('should have updated formula cells into value cells in the sheet', () => {
        const sheet = mockSumSheet();
        const sumFormulaCell = {
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
        const resultCell = resolveFormula(sumFormulaCell.formula, sheet);
        expect(resultCell).toEqual({
          value: {number: 38},
        });
      });
    });
    describe('MULTIPLY', () => {
      it('should resolve a MULTIPLY formula with direct references', () => {
        const sheet = mockMultiplySheet();
        const formulaCell = {
          formula: {
            multiply: [
              {
                reference: 'A1',
              },
              {
                reference: 'B1',
              },
            ],
          },
        };
        const resultCell = resolveFormula(formulaCell.formula, sheet);
        expect(resultCell).toEqual({value: {number: 24}});
      });
      it('should resolve a MULTIPLY formula with deep references', () => {
        const sheet = mockMultiplySheet();
        const formulaCell = {
          formula: {
            multiply: [
              {
                reference: 'C1',
              },
              {
                reference: 'D1',
              },
            ],
          },
        };
        const resultCell = resolveFormula(formulaCell.formula, sheet);
        expect(resultCell).toEqual({value: {number: 221184}});
      });
    });
    describe('DIVIDE', () => {
      it('should resolve a DIVIDE formula with direct references', () => {
        const sheet = mockDivideSheet();
        const formulaCell = {
          formula: {
            divide: [
              {
                reference: 'A1',
              },
              {
                reference: 'B1',
              },
            ],
          },
        };
        const resultCell = resolveFormula(formulaCell.formula, sheet);
        expect(resultCell).toEqual({value: {number: 25}});
      });
      it('should resolve a DIVIDE formula with deep references', () => {
        const sheet = mockDivideSheet();
        const formulaCell = {
          formula: {
            divide: [
              {
                reference: 'C1',
              },
              {
                reference: 'D1',
              },
            ],
          },
        };
        const resultCell = resolveFormula(formulaCell.formula, sheet);
        expect(resultCell).toEqual({value: {number: 1.5625}});
      });
    });
    describe('IS_GREATER', () => {
      it('should resolve a IS_GREATER formula with direct references', () => {
        const sheet = mockSumSheet();
        const formulaCell = {
          formula: {
            is_greater: [
              {
                reference: 'A1',
              },
              {
                reference: 'B1',
              },
            ],
          },
        };
        const resultCell = resolveFormula(formulaCell.formula, sheet);
        expect(resultCell).toEqual({value: {boolean: true}});
      });
      it('should resolve a IS_GREATER formula with deep references', () => {
        const sheet = mockSumSheet();
        const formulaCell = {
          formula: {
            is_greater: [
              {
                reference: 'C1',
              },
              {
                reference: 'D1',
              },
            ],
          },
        };
        const resultCell = resolveFormula(formulaCell.formula, sheet);
        expect(resultCell).toEqual({value: {boolean: false}});
      });
    });
    describe('IS_EQUAL', () => {
      it('should resolve a IS_EQUAL formula with direct references', () => {
        const sheet = mockSumSheet();
        const formulaCell1 = {
          formula: {
            is_equal: [
              {
                reference: 'A1',
              },
              {
                reference: 'B1',
              },
            ],
          },
        };
        const formulaCell2 = {
          formula: {
            is_equal: [
              {
                reference: 'B1',
              },
              {
                reference: 'B1',
              },
            ],
          },
        };
        const resultCell1 = resolveFormula(formulaCell1.formula, sheet);
        expect(resultCell1).toEqual({value: {boolean: false}});
        const resultCell2 = resolveFormula(formulaCell2.formula, sheet);
        expect(resultCell2).toEqual({value: {boolean: true}});
      });
      it('should resolve a IS_EQUAL formula with deep references', () => {
        const sheet = mockSumSheet();
        const formulaCell = {
          formula: {
            is_equal: [
              {
                reference: 'C1',
              },
              {
                reference: 'D1',
              },
            ],
          },
        };
        const resultCell = resolveFormula(formulaCell.formula, sheet);
        expect(resultCell).toEqual({value: {boolean: false}});
      });
    });
    describe('NOT', () => {
      it('should resolve a NOT formula with a deep reference', () => {
        const sheet = mockBooleanSheet();
        const formulaCell = {
          formula: {
            not: {reference: 'D1'},
          },
        };
        const resultCell = resolveFormula(formulaCell.formula, sheet);
        expect(resultCell).toEqual({value: {boolean: true}});
      });
    });
    describe('AND', () => {
      it('should resolve a AND formula with direct references', () => {
        const sheet = mockBooleanSheet();
        const formulaCell1 = {
          formula: {
            and: [
              {
                reference: 'A1',
              },
              {
                reference: 'B1',
              },
            ],
          },
        };
        const formulaCell2 = {
          formula: {
            and: [
              {
                reference: 'A1',
              },
              {
                reference: 'A1',
              },
            ],
          },
        };
        const resultCell1 = resolveFormula(formulaCell1.formula, sheet);
        const resultCell2 = resolveFormula(formulaCell2.formula, sheet);
        expect(resultCell1).toEqual({value: {boolean: false}});
        expect(resultCell2).toEqual({value: {boolean: true}});
      });
      it('should resolve a AND formula with deep references', () => {
        const sheet = mockBooleanSheet();
        const formulaCell = {
          formula: {
            and: [
              {
                reference: 'A1',
              },

              {
                reference: 'D1',
              },
            ],
          },
        };
        const resultCell = resolveFormula(formulaCell.formula, sheet);
        expect(resultCell).toEqual({value: {boolean: false}});
      });
    });
    describe('OR', () => {
      it('should resolve a OR formula with direct references', () => {
        const sheet = mockBooleanSheet();
        const formulaCell1 = {
          formula: {
            or: [
              {
                reference: 'A1',
              },
              {
                reference: 'B1',
              },
            ],
          },
        };
        const formulaCell2 = {
          formula: {
            or: [
              {
                reference: 'B1',
              },
              {
                reference: 'B1',
              },
            ],
          },
        };
        const resultCell1 = resolveFormula(formulaCell1.formula, sheet);
        const resultCell2 = resolveFormula(formulaCell2.formula, sheet);
        expect(resultCell1).toEqual({value: {boolean: true}});
        expect(resultCell2).toEqual({value: {boolean: false}});
      });
      it('should resolve a OR formula with deep references', () => {
        const sheet = mockBooleanSheet();
        const formulaCell = {
          formula: {
            or: [
              {
                reference: 'A1',
              },

              {
                reference: 'D1',
              },
            ],
          },
        };
        const resultCell = resolveFormula(formulaCell.formula, sheet);
        expect(resultCell).toEqual({value: {boolean: true}});
      });
    });

    describe('CONCAT', () => {
      it('should resolve a CONCAT formula with direct references', () => {
        const sheet = mockStringSheet();
        const formulaCell1 = {
          formula: {
            concat: [
              {
                reference: 'A1',
              },
              {
                reference: 'B1',
              },
            ],
          },
        };
        const formulaCell2 = {
          formula: {
            concat: [
              {
                reference: 'B1',
              },
              {
                reference: 'B1',
              },
            ],
          },
        };
        const resultCell1 = resolveFormula(formulaCell1.formula, sheet);
        const resultCell2 = resolveFormula(formulaCell2.formula, sheet);
        expect(resultCell1).toEqual({value: {text: 'AABB'}});
        expect(resultCell2).toEqual({value: {text: 'BBBB'}});
      });
      it('should resolve a CONCAT formula with deep references', () => {
        const sheet = mockStringSheet();
        const formulaCell = {
          formula: {
            concat: [
              {
                reference: 'A1',
              },
              {
                reference: 'B3',
              },
            ],
          },
        };
        const resultCell = resolveFormula(formulaCell.formula, sheet);
        expect(resultCell).toEqual({value: {text: 'AAAABBBBB'}});
      });
    });
    describe('IF', () => {
      it('should resolve an IF formula', () => {
        const sheet = mockSumSheet();
        const formulaCell = {
          formula: {
            if: [
              {
                is_greater: [{reference: 'A1'}, {reference: 'B1'}],
              },
              {value: {text: 'Stonks!'}},
              {value: {text: 'Sad face'}},
            ],
          },
        };
        const resultCell = resolveFormula(formulaCell.formula as any, sheet);
        expect(resultCell).toEqual({value: {text: 'Stonks!'}});
      });
    });
  });
});
