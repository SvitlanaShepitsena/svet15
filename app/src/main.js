define(['require', 'famous/core/Engine', 'views/cell/AppViewCell', 'views/desktop/AppViewDesk'], function (require, Engine, AppViewCell, AppViewDesk) {
    var Transform = require('famous/core/Transform');
    var mainContext = Engine.createContext();
    mainContext.setPerspective(500);

    var initialDevice = window.responsive();
    var appView = initialDevice === 'cell' ? new AppViewCell() : new AppViewDesk({ctx: mainContext});

    mainContext.on('resize', function () {
        var newDevice = window.responsive();
        if (newDevice !== initialDevice) {
            window.location.reload();
        }
    });
    mainContext.add(appView);
});

window.responsive = function responsive() {
    var MOBILEWIDTH = 490;
    var device;
    switch (true) {
        case window.innerWidth <= MOBILEWIDTH:
            device = 'cell';
            break;
        case window.innerWidth > MOBILEWIDTH:
            device = 'desktop';
            break;
    }
    return device;
}

window.sv = {
    cities: {
        northbrook: 'Northbrook',
        buffaloGrove: 'Buffalo Grove',
        highlandPark: 'Highland Park',
        deerfield: 'Deerfield',
        glencoe: "Glencoe",
        glenview: 'Glenview',
        skokie: 'Skokie',
        vernonHills: 'Vernon Hills',
        wheeling: 'Wheeling',
        wilmette: 'Wilmette',
        niles: 'Niles',
        evanston: 'Evanston'
    },
    cityMapColors: {
        buffaloGrove: 'coral',
        highlandpark: '#D98982',
        deerfield: '#EB8986',
        glencoe: '#FFC0A3',
        northbrook: '#9CDBAD',
        glenview: '#EB8986',
        skokie: '#61AEAE',
        vernonHills: '#D4E5FF',
        wheeling: '#B2A5B6',
        wilmette: '#89BF7A',
        niles: 'coral',
        evanston: '#FFBFA3'
    },
    sizing: {
        headerHeightCell: 0.08 * window.innerHeight,
        footerSize: 0 * window.innerHeight,
        headerHeight: 140,
        headerWidth: 1280,
        headerSmallHeight: Math.ceil(140 / 2.8),
        headerHeightShift: Math.ceil(140 - 140 / 2.8),
        viewHeight: (window.innerHeight - Math.ceil(140 / 2.8)) * .94,

        contentWidth: 1200,
        contentHeight: window.innerHeight,
        logoContainerWidth: 340,
        navContainerWidth: 500
    },
    options: {
        darkScheme: {
            textYellow: '#fafad2',
            textWhite: '#fffaf0',
            textDark: '#393939',
            textShadow: '1px 1px #BD8D46',
            lightRed: '#FA5C4F',
            lightGrey: '#F2EDE4',
            darkGrey: '#DED9D1',
            headerColor: '#000000',
            navColor: '#0B0B0B',
            homeIconColor: '#faebd7',
            logoColor: 'red',
            sectionColor: '#FF7F50',
            sectionFlipColor: '#F2CA80',
            footerColor: '#000000',
            aboutDesk: '#FFFAF0', radioDesk: '#FFFBE3',
            contactDesk: '#FFFAF0'
        }
    },

    mapPalette: [
        {
            "featureType": "administrative",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "lightness": 33
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#f2e5d4"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#c5dac6"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#c5c6c6"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e4d7c6"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#fbfaf7"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#acbcc9"
                }
            ]
        }
    ]
}

window.sv.scheme = window.sv.options.darkScheme;
