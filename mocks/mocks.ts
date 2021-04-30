import {Sheet} from '../interfaces';

export const mockResultSheet = [
  [
    {
      value: {
        number: 5,
      },
    },
    {
      value: {
        boolean: true,
      },
    },
    {
      value: {
        text: 'c',
      },
    },
  ],
  [
    {
      value: {
        text: 'AA',
      },
    },
    {
      value: {
        text: 'BB',
      },
    },
    {
      value: {
        text: 'CC',
      },
    },
  ],
  [
    {
      value: {
        text: 'AAA',
      },
    },
    {
      value: {
        text: 'BBB',
      },
    },
    {
      value: {
        text: 'CCC',
      },
    },
  ],
] as Sheet;

export const deepResolveFormulaSheet = [
  [
    {
      formula: {
        reference: 'B1',
      },
    },
    {
      formula: {
        reference: 'C1',
      },
    },
    {
      formula: {
        reference: 'D1',
      },
    },
    {
      formula: {
        reference: 'E1',
      },
    },
    {
      formula: {
        reference: 'F1',
      },
    },
    {
      formula: {
        reference: 'G1',
      },
    },
    {
      formula: {
        reference: 'H1',
      },
    },
    {
      value: {
        text: 'Last',
      },
    },
  ],
];
