export const source = 'Vehicle Complaints';
export const queryConfig = {
  time: {
    timeField: 'failtimestamp_real',
    from: '+1995-01-01 08:00:00.000',
    to: '+2014-07-10 07:00:00.000',
  },
  filters: [],
  groups: [
    {
      name: 'component',
      limit: 50,
      sort: {
        dir: 'desc',
        name: 'count',
      },
    },
  ],
  metrics: [
    {
      name: 'crashed',
      func: 'sum',
    },
    {
      name: 'injured',
      func: 'sum',
    },
    {
      name: 'fire',
      func: 'sum',
    },
    {
      name: 'speed',
      func: 'avg',
    },
  ],
};