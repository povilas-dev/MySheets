export const mockBooleanSheetBuilder = () => {
  return {
    build: () => [
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
    ],
  };
};
