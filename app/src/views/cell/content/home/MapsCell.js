define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var MapView = require('fmaps/MapView');
    var Transitionable = require('famous/transitions/Transitionable');
    var MapModifier = require('fmaps/MapModifier');
    var Easing = require('famous/transitions/Easing');


    function MapsCell() {
        View.apply(this, arguments);
        _init.call(this);
        _map.call(this);
        _modifier.call(this);
    }

    function _modifier() {

        this.surface = new Surface({
            size: [50, 50],
            properties: {
                backgroundColor: 'white'
            }
        });
        this.modifier = new Modifier({
            align: [0, 0],
            origin: [0.5, 0.5]
        });
        this.mapModifier = new MapModifier({
            mapView: this.mapView,
            position: {lat: 51.4484855, lng: 5.451478}
        });
        //this.add(mapModifier).add(modifier).add(surface);
    }

    function _map() {
        var northChicagoStart = {lat: 41.850033, lng: -87.6500523};
        var northChicagoEnd = {lat: 41.95, lng: -87.6500523};
        var mapView = new MapView({
            type: MapView.MapType.GOOGLEMAPS,
            mapOptions: {
                zoom: 9,
                center: northChicagoStart,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        });
        this.rootNode.add(mapView);

        mapView.on('load', function () {
            mapView.setPosition(
                northChicagoEnd,
                {duration: 5000, curve: Easing.outBack}
            );
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
