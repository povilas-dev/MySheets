export const mockStringSheet = () => [
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
];
