export const source = 'Vehicle Complaints';
export const queryConfig = {
    limit: 50,
    offset: 0,
    restrictions: [{'path':'failtimestamp_real','operation':'BETWEEN','value':['1995-01-01 08:00:00.000','2014-07-10 07:00:00.000']}],
    streamSourceId: '',
    sortCfgs: [
        {
            dir: 'asc',
            name: 'failtimestamp_real'
        }
    ]
};