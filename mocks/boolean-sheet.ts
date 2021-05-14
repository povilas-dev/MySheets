export const mockBooleanSheet = () => [
  [
    {
      value: {
        boolean: true,
      },
    },
    {
      value: {
        boolean: false,
      },
    },
    {formula: {not: {value: {boolean: false}}}},
    {formula: {not: {reference: 'A1'}}},
  ],
];
