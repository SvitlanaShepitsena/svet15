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
        this.northChicagoEnd = {lat:41.936994, lng:-87.882339};

        this.mapView = new MapView({
            type: MapView.MapType.GOOGLEMAPS,
            mapOptions: {
                zoom: 12,
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

            var url = 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer';
            var dynamap = new gmaps.ags.MapOverlay(url);
            dynamap.setMap(this.gMap);

            this.gMap.data.loadGeoJson('https://storage.googleapis.com/maps-devrel/google.json');

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
