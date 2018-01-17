export const source = 'Vehicle Complaints';
export const queryConfig = {
  time: {
    timeField: 'failtimestamp_real',
    from: '+1995-01-01 08:00:00.000',
    to: '+2014-07-10 07:00:00.000',
  },
  filters: [],
  fields: [
    { name: 'make', limit: 50 },
    { name: 'model' },
    { name: 'year_string' },
    { name: 'state' },
    { name: 'component' },
    { name: 'crashed' },
    { name: 'fire' },
    { name: 'injured' },
    { name: 'speed' },
    { name: 'description' },
  ],
};
