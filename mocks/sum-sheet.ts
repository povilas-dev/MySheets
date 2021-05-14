export const mockSumSheet = () => [
  [
    {
      value: {
        number: 6,
      },
    },
    {
      value: {
        number: 4,
      },
    },
    {
      formula: {
        sum: [
          {
            reference: 'A1',
          },
          {
            reference: 'B1',
          },
          {
            reference: 'B1',
          },
        ],
      },
    },
    {
      formula: {
        sum: [
          {
            reference: 'A1',
          },
          {
            reference: 'B1',
          },
          {
            reference: 'C1',
          },
        ],
      },
    },
  ],
];
