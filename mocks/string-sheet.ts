import {Sheet} from '../interfaces';

export const mockStringSheetBuilder = () => ({
  build: () =>
    [
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
      [
        {
          formula: {
            concat: [
              {
                reference: 'A1',
              },
              {
                reference: 'B1',
              },
              {
                reference: 'B2',
              },
            ],
          },
        },
        {
          formula: {
            concat: [
              {
                reference: 'A1',
              },
              {
                reference: 'B1',
              },
              {
                reference: 'B2',
              },
            ],
          },
        },
      ],
    ] as Sheet,
});
