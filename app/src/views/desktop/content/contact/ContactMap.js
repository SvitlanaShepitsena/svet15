define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    var MapView = require('fmaps/MapView');

    ContactMap.prototype = Object.create(View.prototype);
    ContactMap.prototype.constructor = ContactMap;
    ContactMap.DEFAULT_OPTIONS = {};

    function ContactMap() {
        View.apply(this, arguments);
        _init.call(this);
        //_map.call(this);
        _mapV.call(this);
    }

    function _mapV() {

        this.mapView = new MapView({
            type: MapView.MapType.GOOGLEMAPS,
            mapOptions: {
                featureType: "water",
                elementType: "all",
                stylers: [
                    {
                        visibility: "on"
                    },
                    {
                        color: "#acbcc9"
                    }
                ],
                zoom: 10,
                center: new google.maps.LatLng(42.034664, -88.074318),
                mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                },
                scrollwheel: false,
                panControl: false,
                scaleControl: false,
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.LEFT_CENTER
                },
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        });
        this.mapSurf = this.mapView.getSurface();
        this.mapSurf.pipe(this._eventOutput);

        this.infoWindows = [];
        this.markers = [];

        this.rootNode.add(this.mapView);

    }

    function _map() {
        this.mapMod = new Modifier({
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 0, 0)
        });

        this.mapSurf = new Surface({
            content: '<div id="contact-map" style="width: 100%; height: 100%;">Test</div>',
            properties: {
                backgroundColor: 'red',
                backgroundSize: 'cover'
            }
        });

        this.rootNode.add(this.mapMod).add(this.mapSurf);

        this.mapSurf.pipe(this._eventOutput);
    }

    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, 0],
            origin: [0.5, 0],
            transform: Transform.translate(0, 0, 0)
        });

        this.rootNode = this.add(this.centerModifier);
    }

    ContactMap.prototype.render = function () {
        if (!this.map) {
            var el = document.getElementById('contact-map');
            if (el) {
                this.map = new google.maps.Map(el, this.contactMapOptions);
            }
        }
        return this._node.render();
    }
    module.exports = ContactMap;
});
