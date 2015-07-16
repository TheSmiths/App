var settings = Ti.App.Properties.getObject('app-survey-settings');
var distanceData = module.exports =  {
    'METRIC': [
        {
            id: 0,
            icon: '/images/icons/material/plastic.png',
            valueLabel: '0 - 10',
            captionLabel: 'Meter',
            type: 'large'
        },
        {
            id: 1,
            icon: '/images/icons/material/foam.png',
            valueLabel: '10 - 50',
            captionLabel: 'Meter',
            type: 'large'
        },
        {
            id: 2,
            icon: '/images/icons/material/glass.png',
            valueLabel: '50 - 100',
            captionLabel: 'Meter',
            type: 'large'
        },
        {
            id: 3,
            icon: '/images/icons/material/metal.png',
            valueLabel: '100+',
            captionLabel: 'Meter',
            type: 'large'
        }
    ],
    'IMPERIAL': [
        {
            id: 0,
            icon: '/images/icons/material/plastic.png',
            valueLabel: '0 - 33',
            captionLabel: 'Feet',
            type: 'large'
        },
        {
            id: 1,
            icon: '/images/icons/material/foam.png',
            valueLabel: '33 - 164',
            captionLabel: 'Feet',
            type: 'large'
        },
        {
            id: 2,
            icon: '/images/icons/material/glass.png',
            valueLabel: '164 - 328',
            captionLabel: 'Feet',
            type: 'large'
        },
        {
            id: 3,
            icon: '/images/icons/material/metal.png',
            valueLabel: '328+',
            captionLabel: 'Feet',
            type: 'large'
        }
    ],
};


