export default class ColDefFactory {

    createColDefs() {
        const leftAlignStyle = {
            'text-align': 'left'
        };
        const centerAlignStyle = {
            'text-align': 'center'
        }
        const makeAlignStyle = {
            'border-left': '1px solid #808080',
            'text-align': 'left'
        }
        const columnDefs = [
            {
                headerName: 'MAKE',
                field: 'make',
                width: 100,
                suppressSorting: true,
                suppressSizeToFit: true,
                suppressMenu: true,
                cellStyle: makeAlignStyle
            },
            {
                headerName: 'MODEL',
                field: 'model',
                width: 90,
                suppressSorting: true,
                suppressSizeToFit: true,
                suppressMenu: true,
                cellStyle: leftAlignStyle
            },
            {
                headerName: 'YEAR',
                field: 'year',
                width: 60,
                suppressSorting: true,
                suppressSizeToFit: true,
                suppressMenu: true,
                cellStyle: centerAlignStyle
            },
            {
                headerName: 'STATE',
                field: 'state',
                width: 60,
                suppressSorting: true,
                suppressSizeToFit: true,
                suppressMenu: true,
                cellStyle: centerAlignStyle,
                cellRenderer: stateCellRenderer
            },
            {
                headerName: 'FAILED COMPONENT',
                field: 'component',
                width: 200,
                suppressSorting: true,
                suppressSizeToFit: true,
                suppressMenu: true,
                cellStyle: centerAlignStyle
            },
            {
                headerName: 'CRASH',
                field: 'crashed',
                width: 30,
                suppressSorting: true,
                suppressSizeToFit: true,
                suppressMenu: true,
                headerClass: 'crashed',
                cellStyle: centerAlignStyle,
                cellRenderer: defaultMetricCellRenderer
            },
            {
                headerName: 'FIRE',
                field: 'fire',
                width: 30,
                suppressSorting: true,
                suppressSizeToFit: true,
                suppressMenu: true,
                headerClass: 'fire',
                cellStyle: centerAlignStyle,
                cellRenderer: defaultMetricCellRenderer
            },
            {
                headerName: 'INJURY',
                field: 'injured',
                width: 30,
                suppressSorting: true,
                suppressSizeToFit: true,
                suppressMenu: true,
                headerClass: 'injured',
                cellStyle: centerAlignStyle,
                cellRenderer: defaultMetricCellRenderer
            },
            {
                headerName: 'MPH',
                field: 'speed',
                width: 40,
                suppressSorting: true,
                suppressSizeToFit: true,
                suppressMenu: true,
                headerClass: 'speed',
                cellStyle: centerAlignStyle,
                cellRenderer: speedCellRenderer
            },
            {
                headerName: 'DESCRIPTION OF ISSUE',
                field: 'description',
                minWidth: 320,
                suppressSorting: true,
                suppressMenu: true,
                cellStyle: leftAlignStyle
            }
        ];
        return columnDefs;
    }
}

function defaultMetricCellRenderer(params) {
    if (!params.value || params.value === '' || params.value === '0') {
        return '•';
    } else {
        return 'Y';
    }
}

function speedCellRenderer(params) {
    if (!params.value || params.value === '' || params.value === '0') {
        return 'n/a';
    } else {
        return params.value;
    }
}

function stateCellRenderer(params) {
    const stateAbbreviationLookup = {
        'Alabama': 'AL',
        'Alaska': 'AK',
        'Arizona': 'AZ',
        'Arkansas': 'AR',
        'California': 'CA',
        'Colorado': 'CO',
        'Connecticut': 'CT',
        'Delaware': 'DE',
        'Florida': 'FL',
        'Georgia': 'GA',
        'Hawaii': 'HI',
        'Idaho': 'ID',
        'Illinois': 'IL',
        'Indiana': 'IN',
        'Iowa': 'IA',
        'Kansas': 'KS',
        'Kentucky': 'KY',
        'Louisiana': 'LA',
        'Maine': 'ME',
        'Maryland': 'MD',
        'Massachusetts': 'MA',
        'Michigan': 'MI',
        'Minnesota': 'MN',
        'Mississippi': 'MS',
        'Missouri': 'MO',
        'Montana': 'MT',
        'Nebraska': 'NE',
        'Nevada': 'NV',
        'New Hampshire': 'NH',
        'New Jersey': 'NJ',
        'New Mexico': 'NM',
        'New York': 'NY',
        'North Carolina': 'NC',
        'North Dakota': 'ND',
        'Ohio': 'OH',
        'Oklahoma': 'OK',
        'Oregon': 'OR',
        'Pennsylvania': 'PA',
        'Rhode Island': 'RI',
        'South Carolina': 'SC',
        'South Dakota': 'SD',
        'Tennessee': 'TN',
        'Texas': 'TX',
        'Utah': 'UT',
        'Vermont': 'VT',
        'Virginia': 'VA',
        'Washington': 'WA',
        'West Virginia': 'WV',
        'Wisconsin': 'WI',
        'Wyoming': 'WY'
    };
    return stateAbbreviationLookup[params.value]
}