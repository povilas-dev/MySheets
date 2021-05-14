export const mockMultiplySheet = () => [
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
        multiply: [
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
        multiply: [
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
