define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var Transitionable = require('famous/transitions/Transitionable');
    var Easing = require('famous/transitions/Easing');

    var MapView = require('fmaps/MapView');
    var MapModifier = require('fmaps/MapModifier');
    var MapStateModifier = require('fmaps/MapStateModifier');


    function MapsCell() {
        View.apply(this, arguments);
        _init.call(this);

        _map.call(this);
        this.opacityLegend = new Transitionable(0);
        this.geocoder = new google.maps.Geocoder();

    }

    MapsCell.DEFAULT_OPTIONS = {
        colors: {
            buffaloGrove: '#FF280E',
            highlandpark: '#FF3714',
            deerfield: '#FF4F19',
            glencoe: '#FF3714',
            northbrook: '#FF4F19',
            glenview: '#FF611B',
            skokie: '#FF6D1C',
            vernonHills: '#FF7316',
            wheeling: '#FF7A14',
            wilmette: '#FF7F11',
            niles: '#FF8614',
            evanston: '#FF8614'
        }
    };

    function _closeAllOverlays() {
        this.infoWindows.forEach(function (info) {
            info.close(this.gMap);
        });
        this.markers.forEach(function (marker) {
            marker.setMap(null);
        });

        this.opacityLegend.set(0, {duration: 500, curve: 'easeInOut'});

    }

    function legend() {

        this.surface = new Surface({
            size: [170, 50],
            content: '<p><img src="img/svet-icon.png">  Svet distribution points</p>',
            properties: {
                color: 'grey'
            }
        });
        this.surface.pipe(this.mapView);
        this.modifier = new Modifier({
            align: [0, 0],
            origin: [0.5, 0.5],
            opacity: function () {
                return this.opacityLegend.get();
            }.bind(this)

        });
        this.opacityLegend.set(1, {duration: 500, curve: 'easeInOut'});

        this.mapModifier = new MapModifier({
            mapView: this.mapView,
            position: this.legendPlace,
            zoomBase: 9,
            zoomScale: 0.3
        });
        this.rootNode.add(this.mapModifier).add(this.modifier).add(this.surface);
    }

    function _map() {
        this.gMap;

        this.northChicagoStart = {lat: 41.011949, lng: -87.709012};
        this.legendPlace = {lat: 42.131767, lng: -87.579624};
        this.northChicagoEnd = {lat: 42.082571, lng: -87.710238};

        this.mapView = new MapView({
            type: MapView.MapType.GOOGLEMAPS,
            mapOptions: {
                zoom: 10,
                center: this.northChicagoStart,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        });
        this.infoWindows = [];
        this.markers = [];

        this.rootNode.add(this.mapView);

        this.mapView.on('load', function () {

            this.mapView.setPosition(
                this.northChicagoEnd,
                {duration: 500, curve: Easing.outBack}
            );
            this.gMap = this.mapView.getMap();
            /*********************************
             * Here are Svet Statistics by towns
             *********************************/

            /**
             * 1.Buffalo Grove
             */

            var buffaloGroveCoordinates = [
                new google.maps.LatLng(42.205179, -87.979918),
                new google.maps.LatLng(42.197167, -87.979574),
                new google.maps.LatLng(42.197167, -87.972880),
                new google.maps.LatLng(42.190681, -87.972708),
                new google.maps.LatLng(42.190427, -87.978029),
                new google.maps.LatLng(42.179742, -87.977514),
                new google.maps.LatLng(42.179488, -87.985068),
                new google.maps.LatLng(42.175671, -87.984896),
                //Long Grove
                new google.maps.LatLng(42.175671, -87.991934),
                new google.maps.LatLng(42.167911, -87.993651),
                new google.maps.LatLng(42.167784, -87.985239),
                new google.maps.LatLng(42.146914, -87.985754),
                new google.maps.LatLng(42.146532, -87.995196),
                new google.maps.LatLng(42.146660, -87.994852),
                new google.maps.LatLng(42.144114, -87.994681),
                new google.maps.LatLng(42.144114, -87.985583),
                new google.maps.LatLng(42.141950, -87.985583),
                new google.maps.LatLng(42.141950, -87.990217),
                new google.maps.LatLng(42.134695, -87.990217),
                new google.maps.LatLng(42.135204, -87.985068),
                new google.maps.LatLng(42.139023, -87.985068),
                new google.maps.LatLng(42.139023, -87.980261),
                //E Burr Oak Dr
                new google.maps.LatLng(42.129220, -87.980433),
                new google.maps.LatLng(42.129220, -87.980433),
                new google.maps.LatLng(42.135204, -87.970476),
                new google.maps.LatLng(42.135204, -87.961035),
                new google.maps.LatLng(42.131767, -87.961035),
                new google.maps.LatLng(42.131767, -87.951422),
                new google.maps.LatLng(42.134949, -87.951250),
                new google.maps.LatLng(42.135204, -87.949534),
                //Wheeling
                new google.maps.LatLng(42.139277, -87.949190),
                new google.maps.LatLng(42.139277, -87.956228),
                new google.maps.LatLng(42.152005, -87.957087),
                new google.maps.LatLng(42.155441, -87.954683),
                new google.maps.LatLng(42.155314, -87.948847),
                new google.maps.LatLng(42.153405, -87.949019),
                //E Lake Cook Road
                new google.maps.LatLng(42.153277, -87.910566),
                new google.maps.LatLng(42.159767, -87.914171),
                new google.maps.LatLng(42.159767, -87.938204),
                new google.maps.LatLng(42.167275, -87.940951),
                new google.maps.LatLng(42.167275, -87.922068),
                new google.maps.LatLng(42.171600, -87.923441),
                new google.maps.LatLng(42.173382, -87.920523),
                //Ryerson Conservation Area
                new google.maps.LatLng(42.174654, -87.921553),
                new google.maps.LatLng(42.174145, -87.928419),
                new google.maps.LatLng(42.181396, -87.932882),
                new google.maps.LatLng(42.182541, -87.940436),
                new google.maps.LatLng(42.177198, -87.940951),
                new google.maps.LatLng(42.176308, -87.944899),
                new google.maps.LatLng(42.189791, -87.951250),
                new google.maps.LatLng(42.189791, -87.942839),
                new google.maps.LatLng(42.196532, -87.943869),
                new google.maps.LatLng(42.196150, -87.951765),
                new google.maps.LatLng(42.197549, -87.954683),
                new google.maps.LatLng(42.207976, -87.955198),
                new google.maps.LatLng(42.208103, -87.951250),
                new google.maps.LatLng(42.210265, -87.952795),
                new google.maps.LatLng(42.208866, -87.958117),
                new google.maps.LatLng(42.204670, -87.957773),
                new google.maps.LatLng(42.204670, -87.974081),
                new google.maps.LatLng(42.206196, -87.974253),
                new google.maps.LatLng(42.205179, -87.979918)
            ];

            var buffaloGroveLayer = new google.maps.Polygon({
                paths: buffaloGroveCoordinates,
                strokeColor: this.options.colors.buffaloGrove,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: this.options.colors.buffaloGrove,
                fillOpacity: 0.35
            });
            buffaloGroveLayer.setMap(this.gMap);

            google.maps.event.addListener(buffaloGroveLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.buffaloGroveInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.buffaloGroveInfo);
                this.buffaloGroveInfo.setContent('<p class="map-info" >18.7% of Russian speaking customers</p>');
                this.buffaloGroveInfo.setPosition(e.latLng);
                this.buffaloGroveInfo.open(this.gMap);

            }.bind(this));


            /**/
            /**/
            /**/

            /*Highland Park starts*/

            var highlandParkCoordinates = [
                /*Border with Deerfield*/
                new google.maps.LatLng(42.189924, -87.852160),
                new google.maps.LatLng(42.189797, -87.847353),
                new google.maps.LatLng(42.183692, -87.847353),
                new google.maps.LatLng(42.167408, -87.828127),
                new google.maps.LatLng(42.168808, -87.823321),
                new google.maps.LatLng(42.158628, -87.823664),
                new google.maps.LatLng(42.152902, -87.821261),
                /*End// Border with Deerfield*/

                new google.maps.LatLng(42.152520, -87.759291),
                new google.maps.LatLng(42.211415, -87.802378),
                new google.maps.LatLng(42.196665, -87.808214),
                new google.maps.LatLng(42.196665, -87.808214),
                new google.maps.LatLng(42.210652, -87.817999),
                new google.maps.LatLng(42.211034, -87.816111),
                new google.maps.LatLng(42.213577, -87.818343),
                new google.maps.LatLng(42.217899, -87.804953),
                new google.maps.LatLng(42.223493, -87.807528),
                new google.maps.LatLng(42.218026, -87.821776),
                new google.maps.LatLng(42.218154, -87.842032),
                new google.maps.LatLng(42.212687, -87.842547),
                new google.maps.LatLng(42.210907, -87.847010),
                new google.maps.LatLng(42.203786, -87.847010),
                new google.maps.LatLng(42.203786, -87.851816),
                new google.maps.LatLng(42.189924, -87.852160)
            ];
            var highlandParkLayer = new google.maps.Polygon({
                paths: highlandParkCoordinates,
                strokeColor: this.options.colors.highlandpark,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: this.options.colors.highlandpark,
                fillOpacity: 0.35
            });
            highlandParkLayer.setMap(this.gMap);

            google.maps.event.addListener(highlandParkLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoHighlandPark = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoHighlandPark);
                this.infoHighlandPark.setContent('<p class="map-info" >18.2% of Russian speaking customers</p>');
                this.infoHighlandPark.setPosition(e.latLng);
                this.infoHighlandPark.open(this.gMap);

            }.bind(this));

            /*Highland Park end*/
            //
            /*Deerfield starts*/

            var deerfieldCoordinates = [
                /*Border with Highland Park*/
                new google.maps.LatLng(42.189924, -87.852160),
                new google.maps.LatLng(42.189797, -87.847353),
                new google.maps.LatLng(42.183692, -87.847353),
                new google.maps.LatLng(42.167408, -87.828127),
                new google.maps.LatLng(42.168808, -87.823321),
                new google.maps.LatLng(42.158628, -87.823664),
                new google.maps.LatLng(42.152902, -87.821261),
                /*End// Border with Highland Park*/

                /*Bottom Border with Northbrook*/
                new google.maps.LatLng(42.152887, -87.833732),
                new google.maps.LatLng(42.146269, -87.830985),
                new google.maps.LatLng(42.146015, -87.833389),
                new google.maps.LatLng(42.150088, -87.843002),
                new google.maps.LatLng(42.150342, -87.872012),
                new google.maps.LatLng(42.153269, -87.883857),
                new google.maps.LatLng(42.167394, -87.882827),
                new google.maps.LatLng(42.167648, -87.874244),
                new google.maps.LatLng(42.178335, -87.874587),
                new google.maps.LatLng(42.182151, -87.854503),
                new google.maps.LatLng(42.189846, -87.858194),
                new google.maps.LatLng(42.189924, -87.852160)
            ];
            var deerfieldLayer = new google.maps.Polygon({
                paths: deerfieldCoordinates,
                strokeColor: this.options.colors.deerfield,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: this.options.colors.deerfield,
                fillOpacity: 0.35
            });
            deerfieldLayer.setMap(this.gMap);

            google.maps.event.addListener(deerfieldLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoDeerfield = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoDeerfield);
                this.infoDeerfield.setContent('<p class="map-info" >16.1% of Russian speaking customers</p>');
                this.infoDeerfield.setPosition(e.latLng);
                this.infoDeerfield.open(this.gMap);

            }.bind(this));

            //
            /*Northbrook*/

            var northbrookCoordinates = [
                /*Top Border with Northbrook*/
                new google.maps.LatLng(42.152516, -87.795999),
                new google.maps.LatLng(42.152887, -87.833732),
                new google.maps.LatLng(42.146269, -87.830985),
                new google.maps.LatLng(42.146015, -87.833389),
                new google.maps.LatLng(42.150088, -87.843002),
                new google.maps.LatLng(42.150342, -87.872012),
                new google.maps.LatLng(42.153269, -87.883857),
                /*Bottom Border wiht Glenview*/
                new google.maps.LatLng(42.153152, -87.892301),
                new google.maps.LatLng(42.145516, -87.892129),
                new google.maps.LatLng(42.145516, -87.881829),
                new google.maps.LatLng(42.142970, -87.885263),
                new google.maps.LatLng(42.138515, -87.887838),
                new google.maps.LatLng(42.129477, -87.887323),
                new google.maps.LatLng(42.123875, -87.885434),
                new google.maps.LatLng(42.105793, -87.866208),
                new google.maps.LatLng(42.105284, -87.799089),
                new google.maps.LatLng(42.110887, -87.802350),
                new google.maps.LatLng(42.118018, -87.800290),
                new google.maps.LatLng(42.117509, -87.785356),
                new google.maps.LatLng(42.119928, -87.780034),
                new google.maps.LatLng(42.152516, -87.795999)
            ];
            var northbrookLayer = new google.maps.Polygon({
                paths: northbrookCoordinates,
                strokeColor: this.options.colors.northbrook,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: this.options.colors.northbrook,
                fillOpacity: 0.35
            });
            northbrookLayer.setMap(this.gMap);

            google.maps.event.addListener(northbrookLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoNorthbrook = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoNorthbrook);
                this.infoNorthbrook.setContent('<p class="map-info" >14.3% of Russian speaking customers</p>');
                this.infoNorthbrook.setPosition(e.latLng);
                this.infoNorthbrook.open(this.gMap);

            }.bind(this));

            //
            /*Glencoe*/

            var glencoeCoordinates = [
                /*Top Border with Northbrook*/
                new google.maps.LatLng(42.152516, -87.795999),
                new google.maps.LatLng(42.119928, -87.780034),
                new google.maps.LatLng(42.116280, -87.775601),
                new google.maps.LatLng(42.119973, -87.775601),
                new google.maps.LatLng(42.119591, -87.741268),
                new google.maps.LatLng(42.128503, -87.741612),
                new google.maps.LatLng(42.152433, -87.759293),

                new google.maps.LatLng(42.152516, -87.795999)
            ];
            var glencoeLayer = new google.maps.Polygon({
                paths: glencoeCoordinates,
                strokeColor: this.options.colors.glencoe,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: this.options.colors.glencoe,
                fillOpacity: 0.35
            });
            glencoeLayer.setMap(this.gMap);

            google.maps.event.addListener(glencoeLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoGlencoe = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoGlencoe);
                this.infoGlencoe.setContent('<p class="map-info" >14.4% of Russian speaking customers</p>');
                this.infoGlencoe.setPosition(e.latLng);
                this.infoGlencoe.open(this.gMap);

            }.bind(this));

            //
            /*Vernon Hills*/

            var vernonHillsCoordinates = [
                /*Top Border with Northbrook*/
                new google.maps.LatLng(42.269452, -87.968805),
                new google.maps.LatLng(42.267038, -87.968290),
                new google.maps.LatLng(42.266911, -87.963655),
                new google.maps.LatLng(42.266911, -87.963655),
                new google.maps.LatLng(42.263100, -87.949407),
                new google.maps.LatLng(42.245693, -87.945459),
                new google.maps.LatLng(42.245439, -87.940824),
                new google.maps.LatLng(42.231459, -87.935675),
                new google.maps.LatLng(42.224595, -87.937391),
                new google.maps.LatLng(42.226756, -87.938593),
                new google.maps.LatLng(42.218747, -87.932241),
                new google.maps.LatLng(42.218620, -87.937048),
                new google.maps.LatLng(42.201582, -87.933100),
                new google.maps.LatLng(42.201201, -87.933615),
                new google.maps.LatLng(42.201455, -87.939108),
                new google.maps.LatLng(42.205779, -87.948206),
                new google.maps.LatLng(42.210531, -87.951789),
                new google.maps.LatLng(42.209577, -87.958141),
                new google.maps.LatLng(42.211516, -87.965265),
                new google.maps.LatLng(42.211696, -87.974918),
                new google.maps.LatLng(42.218943, -87.974746),
                new google.maps.LatLng(42.219070, -87.994144),
                new google.maps.LatLng(42.233434, -87.993801),
                new google.maps.LatLng(42.233561, -87.990196),
                new google.maps.LatLng(42.236865, -87.988994),
                new google.maps.LatLng(42.236865, -87.984188),
                new google.maps.LatLng(42.247032, -87.984359),
                new google.maps.LatLng(42.266852, -87.974060),
                new google.maps.LatLng(42.269393, -87.974575),

                new google.maps.LatLng(42.269452, -87.968805)

            ];
            var vernonHillsLayer = new google.maps.Polygon({
                paths: vernonHillsCoordinates,
                strokeColor: this.options.colors.vernonHills,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: this.options.colors.vernonHills,
                fillOpacity: 0.35
            });
            vernonHillsLayer.setMap(this.gMap);

            google.maps.event.addListener(vernonHillsLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.vernonHillsInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.vernonHillsInfo);
                this.vernonHillsInfo.setContent('<p class="map-info" >9.1% of Russian speaking customers</p>');
                this.vernonHillsInfo.setPosition(e.latLng);
                this.vernonHillsInfo.open(this.gMap);

            }.bind(this));


            /*Skokie*/
            var skokieCoordinates = [
                new google.maps.LatLng(42.065100, -87.765800),
                new google.maps.LatLng(42.064723, -87.732705),
                new google.maps.LatLng(42.062429, -87.732190),
                new google.maps.LatLng(42.062429, -87.727555),

                new google.maps.LatLng(42.055828, -87.727563),
                new google.maps.LatLng(42.055828, -87.715718),
                new google.maps.LatLng(42.052131, -87.708852),
                new google.maps.LatLng(42.012095, -87.709367),
                new google.maps.LatLng(42.012095, -87.723614),
                new google.maps.LatLng(42.015156, -87.724129),
                new google.maps.LatLng(42.015156, -87.750565),
                new google.maps.LatLng(42.004569, -87.750909),
                new google.maps.LatLng(42.004952, -87.762238),
                new google.maps.LatLng(42.008396, -87.767560),
                new google.maps.LatLng(42.019237, -87.767216),
                new google.maps.LatLng(42.019237, -87.777173),
                new google.maps.LatLng(42.026506, -87.780949),
                new google.maps.LatLng(42.026506, -87.767216),
                new google.maps.LatLng(42.037089, -87.766873),
                new google.maps.LatLng(42.039129, -87.764298),
                new google.maps.LatLng(42.062583, -87.763955),
                new google.maps.LatLng(42.062583, -87.769963),
                new google.maps.LatLng(42.063730, -87.770821),
                new google.maps.LatLng(42.063730, -87.765964),
                new google.maps.LatLng(42.065100, -87.765800)
            ];

            var skokieLayer = new google.maps.Polygon({
                paths: skokieCoordinates,
                title: 'Skokie',
                strokeColor: this.options.colors.skokie,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: this.options.colors.skokie,
                fillOpacity: 0.35
            });
            skokieLayer.setMap(this.gMap);


            google.maps.event.addListener(skokieLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoSkokie = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoSkokie);
                this.infoSkokie.setContent('<p class="map-info" >20% of Russian speaking customers</p>');
                this.infoSkokie.setPosition(e.latLng);
                this.infoSkokie.open(this.gMap);

            }.bind(this));


            /*Evanston*/
            var evanstonCoordinates = [
                new google.maps.LatLng(42.062429, -87.732190),
                new google.maps.LatLng(42.062429, -87.727555),
                new google.maps.LatLng(42.055828, -87.727563),
                new google.maps.LatLng(42.055828, -87.715718),
                new google.maps.LatLng(42.052131, -87.708852),
                new google.maps.LatLng(42.012095, -87.709367),
                new google.maps.LatLng(42.019246, -87.673272),
                new google.maps.LatLng(42.023071, -87.678165),
                new google.maps.LatLng(42.023071, -87.678165),
                new google.maps.LatLng(42.028937, -87.668809),
                new google.maps.LatLng(42.028937, -87.668809),
                new google.maps.LatLng(42.041305, -87.669581),
                new google.maps.LatLng(42.041241, -87.669753),
                new google.maps.LatLng(42.048061, -87.673358),
                new google.maps.LatLng(42.052204, -87.669667),
                new google.maps.LatLng(42.059596, -87.669839),
                new google.maps.LatLng(42.060042, -87.671041),
                new google.maps.LatLng(42.071767, -87.679624),
                new google.maps.LatLng(42.071767, -87.682799),
                new google.maps.LatLng(42.068708, -87.682799),

                new google.maps.LatLng(42.069282, -87.729234),
                new google.maps.LatLng(42.069664, -87.729405),
                new google.maps.LatLng(42.068708, -87.732410),
                new google.maps.LatLng(42.065100, -87.732581),

                new google.maps.LatLng(42.062429, -87.732190),
            ];
            var evanstonLayer = new google.maps.Polygon({
                paths: evanstonCoordinates,
                strokeColor: this.options.colors.evanston,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: this.options.colors.evanston,
                fillOpacity: 0.35
            });
            evanstonLayer.setMap(this.gMap);
            google.maps.event.addListener(evanstonLayer, 'click', function (e) {

                _closeAllOverlays.call(this);
                this.evanstonInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.evanstonInfo);
                this.evanstonInfo.setContent('<p class="map-info" >7.2% of Russian speaking customers</p>');
                this.evanstonInfo.setPosition(e.latLng);
                this.evanstonInfo.open(this.gMap);

            }.bind(this));


            /*Wilmette*/
            var wilmetteCoordinates = [
                new google.maps.LatLng(42.065100, -87.765800),
                new google.maps.LatLng(42.064723, -87.732705),
                new google.maps.LatLng(42.068914, -87.732401),
                new google.maps.LatLng(42.069647, -87.729311),
                new google.maps.LatLng(42.069583, -87.729225),
                new google.maps.LatLng(42.069073, -87.729139),
                new google.maps.LatLng(42.068708, -87.682799),
                new google.maps.LatLng(42.071767, -87.682799),
                new google.maps.LatLng(42.071767, -87.679624),

                new google.maps.LatLng(42.076559, -87.682404),
                new google.maps.LatLng(42.078471, -87.681374),
                new google.maps.LatLng(42.089873, -87.703090),
                new google.maps.LatLng(42.086051, -87.703090),
                new google.maps.LatLng(42.085988, -87.713218),
                new google.maps.LatLng(42.085988, -87.713218),
                new google.maps.LatLng(42.082548, -87.718024),
                new google.maps.LatLng(42.082611, -87.722659),

                new google.maps.LatLng(42.087898, -87.724547),
                new google.maps.LatLng(42.088249, -87.726393),
                new google.maps.LatLng(42.088663, -87.726822),
                new google.maps.LatLng(42.087962, -87.727251),
                new google.maps.LatLng(42.087962, -87.732143),
                new google.maps.LatLng(42.087325, -87.732100),
                new google.maps.LatLng(42.087325, -87.737079),
                new google.maps.LatLng(42.087166, -87.737079),
                new google.maps.LatLng(42.087166, -87.741885),
                new google.maps.LatLng(42.085128, -87.742057),
                new google.maps.LatLng(42.084873, -87.750554),
                new google.maps.LatLng(42.087102, -87.752099),

                new google.maps.LatLng(42.084809, -87.751927),
                new google.maps.LatLng(42.085000, -87.760081),
                new google.maps.LatLng(42.084936, -87.760038),
                new google.maps.LatLng(42.086784, -87.760038),
                new google.maps.LatLng(42.086784, -87.764072),
                new google.maps.LatLng(42.085892, -87.765617),

                new google.maps.LatLng(42.085892, -87.765617),
                new google.maps.LatLng(42.087039, -87.766304),
                new google.maps.LatLng(42.087039, -87.773085),
                //Border with Glenview
                new google.maps.LatLng(42.084618, -87.775059),
                new google.maps.LatLng(42.084108, -87.777376),
                new google.maps.LatLng(42.082070, -87.778234),
                new google.maps.LatLng(42.079713, -87.777634),
                new google.maps.LatLng(42.079586, -87.764501),
                new google.maps.LatLng(42.079586, -87.764501),

                new google.maps.LatLng(42.079586, -87.764501),
                new google.maps.LatLng(42.070857, -87.758665),
                new google.maps.LatLng(42.065100, -87.758751),
                new google.maps.LatLng(42.065100, -87.765800)
            ];
            var wilmetteLayer = new google.maps.Polygon({
                paths: wilmetteCoordinates,
                strokeColor: this.options.colors.wilmette,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: this.options.colors.wilmette,
                fillOpacity: 0.35
            });
            wilmetteLayer.setMap(this.gMap);

            google.maps.event.addListener(wilmetteLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.wilmetteInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.wilmetteInfo);
                this.wilmetteInfo.setContent('<p class="map-info" >7.2% of Russian speaking customers</p>');
                this.wilmetteInfo.setPosition(e.latLng);
                this.wilmetteInfo.open(this.gMap);

            }.bind(this));


            /*Glenview*/
            var glenviewCoordinates = [
                new google.maps.LatLng(42.084618, -87.775059),
                //Border with Wilmette
                new google.maps.LatLng(42.084108, -87.777376),
                new google.maps.LatLng(42.082070, -87.778234),
                new google.maps.LatLng(42.079713, -87.777634),
                new google.maps.LatLng(42.079586, -87.764501),
                new google.maps.LatLng(42.079586, -87.764501),
                new google.maps.LatLng(42.079586, -87.764501),
                new google.maps.LatLng(42.070857, -87.758665),
                new google.maps.LatLng(42.065100, -87.758751),
                new google.maps.LatLng(42.065100, -87.765800),
                new google.maps.LatLng(42.065356, -87.780448),
                new google.maps.LatLng(42.062807, -87.780104),
                new google.maps.LatLng(42.062425, -87.789374),
                new google.maps.LatLng(42.058983, -87.789203),
                new google.maps.LatLng(42.058729, -87.797786),
                new google.maps.LatLng(42.055415, -87.795897),
                new google.maps.LatLng(42.054905, -87.815638),
                new google.maps.LatLng(42.060513, -87.822505),
                new google.maps.LatLng(42.059493, -87.835723),
                new google.maps.LatLng(42.056562, -87.840358),
                new google.maps.LatLng(42.058219, -87.844821),
                new google.maps.LatLng(42.060895, -87.845164),
                new google.maps.LatLng(42.060895, -87.845164),
                new google.maps.LatLng(42.072619, -87.843963),
                new google.maps.LatLng(42.067140, -87.850486),
                new google.maps.LatLng(42.066375, -87.867995),
                new google.maps.LatLng(42.082812, -87.866622),
                new google.maps.LatLng(42.083449, -87.870742),
                new google.maps.LatLng(42.080137, -87.870742),
                new google.maps.LatLng(42.080137, -87.878638),
                new google.maps.LatLng(42.094787, -87.878123),
                new google.maps.LatLng(42.093641, -87.868338),
                //top left corner with Northbrook
                new google.maps.LatLng(42.105995, -87.868853),
                new google.maps.LatLng(42.105613, -87.799331),
                new google.maps.LatLng(42.094532, -87.798472),
                new google.maps.LatLng(42.094150, -87.779418),
                new google.maps.LatLng(42.087271, -87.773238),
                new google.maps.LatLng(42.084618, -87.775059)
            ];
            var glenviewLayer = new google.maps.Polygon({
                paths: glenviewCoordinates,
                strokeColor: this.options.colors.glenview,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: this.options.colors.glenview,
                fillOpacity: 0.35
            });
            glenviewLayer.setMap(this.gMap);

            google.maps.event.addListener(glenviewLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.glenviewInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.glenviewInfo);
                this.glenviewInfo.setContent('<p class="map-info" >13.8% of Russian speaking customers</p>');
                this.glenviewInfo.setPosition(e.latLng);
                this.glenviewInfo.open(this.gMap);

            }.bind(this));


            /*Wheeling*/
            var wheelingCoordinates = [
                new google.maps.LatLng(42.131767, -87.961035),
                new google.maps.LatLng(42.131767, -87.951422),
                new google.maps.LatLng(42.134949, -87.951250),
                new google.maps.LatLng(42.135204, -87.949534),
                //Wheeling
                new google.maps.LatLng(42.139277, -87.949190),
                new google.maps.LatLng(42.139277, -87.956228),
                new google.maps.LatLng(42.152005, -87.957087),
                new google.maps.LatLng(42.155441, -87.954683),
                new google.maps.LatLng(42.155314, -87.948847),
                new google.maps.LatLng(42.153405, -87.949019),
                //E Lake Cook Road
                new google.maps.LatLng(42.153277, -87.910566),
                //Potawatomi Woods
                new google.maps.LatLng(42.140231, -87.903634),
                new google.maps.LatLng(42.138703, -87.888185),
                new google.maps.LatLng(42.115023, -87.894021),
                new google.maps.LatLng(42.115023, -87.894021),
                new google.maps.LatLng(42.114768, -87.907754),
                new google.maps.LatLng(42.094773, -87.907926),
                //E Camp MCdonald Rd
                new google.maps.LatLng(42.095282, -87.912904),
                new google.maps.LatLng(42.113367, -87.936593),
                new google.maps.LatLng(42.120498, -87.936937),
                new google.maps.LatLng(42.120753, -87.941743),
                new google.maps.LatLng(42.124190, -87.941743),
                new google.maps.LatLng(42.123936, -87.951185),
                new google.maps.LatLng(42.118206, -87.951185),
                new google.maps.LatLng(42.118333, -87.956334),
                new google.maps.LatLng(42.124190, -87.955991),
                new google.maps.LatLng(42.124572, -87.960798),
                new google.maps.LatLng(42.131767, -87.961035)
            ];
            var wheelingLayer = new google.maps.Polygon({
                paths: wheelingCoordinates,
                strokeColor: this.options.colors.wheeling,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: this.options.colors.wheeling,
                fillOpacity: 0.35
            });
            wheelingLayer.setMap(this.gMap);

            google.maps.event.addListener(wheelingLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.wheelingInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.wheelingInfo);
                this.wheelingInfo.setContent('<p class="map-info" >8.9% of Russian speaking customers</p>');
                this.wheelingInfo.setPosition(e.latLng);
                this.wheelingInfo.open(this.gMap);

            }.bind(this));


            /*Niles*/
            var nilesCoordinates = [
                new google.maps.LatLng(42.058624, -87.855539),
                new google.maps.LatLng(42.058624, -87.849702),
                new google.maps.LatLng(42.054609, -87.849702),
                new google.maps.LatLng(42.054609, -87.840433),
                new google.maps.LatLng(42.059452, -87.840433),
                new google.maps.LatLng(42.059452, -87.835798),
                new google.maps.LatLng(42.059452, -87.835798),
                new google.maps.LatLng(42.059452, -87.835798),
                new google.maps.LatLng(42.059452, -87.835798),
                new google.maps.LatLng(42.059452, -87.835798),
                new google.maps.LatLng(42.059452, -87.835798),
                new google.maps.LatLng(42.059452, -87.835798),
                new google.maps.LatLng(42.044156, -87.820091),
                new google.maps.LatLng(42.044156, -87.820091),
                new google.maps.LatLng(42.044156, -87.800865),
                new google.maps.LatLng(42.033383, -87.796058),
                new google.maps.LatLng(42.033383, -87.796058),
                new google.maps.LatLng(42.033383, -87.796058),
                new google.maps.LatLng(42.026506, -87.780949),
                new google.maps.LatLng(42.019237, -87.777173),
                new google.maps.LatLng(42.019237, -87.767216),
                new google.maps.LatLng(42.004434, -87.768077),
                //Touhu/Lehigh
                new google.maps.LatLng(42.011832, -87.773571),
                new google.maps.LatLng(42.012023, -87.789020),
                new google.maps.LatLng(42.004498, -87.782154),
                new google.maps.LatLng(42.000416, -87.790823),
                //Devon/Harlem
                new google.maps.LatLng(42.000734, -87.806787),
                //Howard/Harlem
                new google.maps.LatLng(42.018846, -87.806701),
                new google.maps.LatLng(42.018846, -87.816743),
                new google.maps.LatLng(42.025924, -87.816400),
                new google.maps.LatLng(42.025924, -87.816400),
                new google.maps.LatLng(42.028283, -87.836055),
                new google.maps.LatLng(42.029048, -87.841119),
                new google.maps.LatLng(42.029048, -87.841119),
                new google.maps.LatLng(42.029048, -87.841119),
                new google.maps.LatLng(42.036443, -87.840690),
                new google.maps.LatLng(42.039886, -87.840776),
                //Golf Mill Center
                new google.maps.LatLng(42.049829, -87.840862),
                new google.maps.LatLng(42.049765, -87.845583),
                new google.maps.LatLng(42.051359, -87.846183),
                new google.maps.LatLng(42.051295, -87.850561),
                new google.maps.LatLng(42.054163, -87.850732),
                new google.maps.LatLng(42.054163, -87.850732),
                new google.maps.LatLng(42.058560, -87.855281),
                //
                new google.maps.LatLng(42.058624, -87.855539)
            ];
            var nilesLayer = new google.maps.Polygon({
                paths: nilesCoordinates,
                strokeColor: this.options.colors.niles,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: this.options.colors.niles,
                fillOpacity: 0.35
            });
            nilesLayer.setMap(this.gMap);
            google.maps.event.addListener(nilesLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.nilesInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.nilesInfo);
                this.nilesInfo.setContent('<p class="map-info" >7.2% of Russian speaking customers</p>');
                this.nilesInfo.setPosition(e.latLng);
                this.nilesInfo.open(this.gMap);

            }.bind(this));


            //_modifier.call(this);
        }.bind(this));
    }

    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    MapsCell.prototype = Object.create(View.prototype);
    MapsCell.prototype.constructor = MapsCell;


    MapsCell.prototype.showSvetPoints = function () {
        var baseLat = 42.04,
            baseLong = -87.85;

        _closeAllOverlays.call(this);

        var maxRandom = .1;

        function getRandomShift(n) {
            var random = seed(n) * .1 + 0.01;
            return random;
        }

        function seed(x) {
            x = (x << 13) ^ x;
            return ( 1.0 - ( (x * (x * x * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);
        }

        var counter = 0;

        function dropSvetPoints() {
            counter++;
            var latLng = new google.maps.LatLng(baseLat + getRandomShift(counter), baseLong + getRandomShift(counter + 2));
            this.svetMarker = new google.maps.Marker({
                position: latLng,
                icon: 'img/svet-icon.png',
                animation: google.maps.Animation.DROP
            });
            this.markerInfo = new google.maps.InfoWindow();
            this.infoWindows.push(this.markerInfo);

            google.maps.event.addListener(this.svetMarker, 'click', function (e) {
                this.geocoder.geocode({'latLng': latLng}, function (res) {
                    this.markerInfo.setContent('<p class="map-marker-info">' + res[0].formatted_address + '</p>');
                    this.markerInfo.setPosition(e.latLng);
                    this.markerInfo.open(this.gMap);
                }.bind(this));


            }.bind(this));

            this.markers.push(this.svetMarker);
            this.svetMarker.setMap(this.gMap);
        }

        for (var i = 1; i < 20; i++) {
            setTimeout(function () {

                dropSvetPoints.call(this);
            }.bind(this), i * 100);
        }
        legend.call(this);

    }
    module.exports = MapsCell;
})
;
