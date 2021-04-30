export const mockDivideSheetBuilder = () => {
  return {
    build: () => [
      [
        {
          value: {
            number: 100,
          },
        },
        {
          value: {
            number: 4,
          },
        },
        {
          formula: {
            divide: [
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
            divide: [
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
    ],
  };
};
