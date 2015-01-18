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
                new google.maps.LatLng(42.063568,-87.771006),
                new google.maps.LatLng(42.052479,-87.709551),
                new google.maps.LatLng(42.012571,-87.710238),
                new google.maps.LatLng(42.008361,-87.767401),
                new google.maps.LatLng(42.040760, -87.764376),
                new google.maps.LatLng(42.063568,-87.771006)
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
