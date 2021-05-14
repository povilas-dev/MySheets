const jobs = [
  {
    id: 'job-14',
    data: [
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
        {
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
        },
      ],
      [
        {
          value: {
            boolean: false,
          },
        },
        {
          value: {
            boolean: false,
          },
        },
        {
          formula: {
            or: [
              {
                reference: 'A2',
              },
              {
                reference: 'B2',
              },
            ],
          },
        },
      ],
      [
        {
          value: {
            boolean: true,
          },
        },
        {
          value: {
            number: 1,
          },
        },
        {
          formula: {
            or: [
              {
                reference: 'A3',
              },
              {
                reference: 'B3',
              },
            ],
          },
        },
      ],
    ],
  },
  {
    id: 'job-12',
    data: [
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
        {
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
        },
      ],
      [
        {
          value: {
            boolean: true,
          },
        },
        {
          value: {
            boolean: true,
          },
        },
        {
          formula: {
            and: [
              {
                reference: 'A2',
              },
              {
                reference: 'B2',
              },
            ],
          },
        },
      ],
      [
        {
          value: {
            boolean: true,
          },
        },
        {
          value: {
            number: 1,
          },
        },
        {
          formula: {
            and: [
              {
                reference: 'A3',
              },
              {
                reference: 'B3',
              },
            ],
          },
        },
      ],
    ],
  },
];
