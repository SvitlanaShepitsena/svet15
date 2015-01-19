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
    }

    function _modifier() {
        this.opacityOurRegion = new Transitionable(0);

        this.surface = new Surface({
            size: [100, 100],
            properties: {
                backgroundColor: 'grey'
            }
        });
        this.surface.pipe(this.mapView);
        this.modifier = new Modifier({
            align: [0, 0],
            origin: [0.5, 0.5],
            opacity: function () {
                return this.opacityOurRegion.get();
            }.bind(this)

        });
        setTimeout(function () {
            this.opacityOurRegion.set(.5, {duration: 2000, curve: 'easeInOut'});
        }.bind(this), 1000);

        this.mapModifier = new MapModifier({
            mapView: this.mapView,
            position: this.northChicagoEnd,
            zoomBase: 9,
            zoomScale: 0.3
        });
        this.rootNode.add(this.mapModifier).add(this.modifier).add(this.surface);
    }

    function _map() {
        this.gMap;

        this.northChicagoStart = {lat: 41.850033, lng: -87.6500523};
        this.northChicagoEnd = {lat: 42.012571, lng: -87.710238};

        this.mapView = new MapView({
            type: MapView.MapType.GOOGLEMAPS,
            mapOptions: {
                zoom: 11,
                center: this.northChicagoStart,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        });


        this.rootNode.add(this.mapView);

        this.mapView.on('load', function () {

            this.mapView.setPosition(
                this.northChicagoEnd,
                {duration: 5000, curve: Easing.outBack}
            );
            this.gMap = this.mapView.getMap();

            var skokieCoordinates = [
                new google.maps.LatLng(42.065100, -87.765800),
                new google.maps.LatLng(42.065100, -87.727563),
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
                new google.maps.LatLng(42.023063, -87.767388),
                new google.maps.LatLng(42.022808, -87.762582),
                new google.maps.LatLng(42.033264, -87.762067),
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
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });
            skokieLayer.setMap(this.gMap);
            var skokieCoordinates = [
                new google.maps.LatLng(42.065100, -87.765800),
                new google.maps.LatLng(42.065100, -87.727563),
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
                new google.maps.LatLng(42.023063, -87.767388),
                new google.maps.LatLng(42.022808, -87.762582),
                new google.maps.LatLng(42.033264, -87.762067),
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
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });
            skokieLayer.setMap(this.gMap);
           /*Evanston*/
            var evanstonCoordinates = [
                new google.maps.LatLng(42.065100, -87.727563),
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
                new google.maps.LatLng(42.065100, -87.727563),
            ];

            var evanstonLayer = new google.maps.Polygon({
                paths: evanstonCoordinates,
                strokeColor: 'green',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: 'yellow',
                fillOpacity: 0.35
            });
            evanstonLayer.setMap(this.gMap);
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

    MapsCell.DEFAULT_OPTIONS = {};

    module.exports = MapsCell;
});
