define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var Easing = require('famous/transitions/Easing');
    /*Google Map*/
    var MapView = require('fmaps/MapView');
    var MapModifier = require('fmaps/MapModifier');
    /*html*/
    var directionForm = require('text!dviews/jade/contact/direction-form.html');
    var contentString = require('text!dviews/jade/contact/svet-map-info.html');

    ContactMapDesk.prototype = Object.create(View.prototype);
    ContactMapDesk.prototype.constructor = ContactMapDesk;
    ContactMapDesk.DEFAULT_OPTIONS = {};

    function ContactMapDesk() {
        View.apply(this, arguments);

        this.centerCoord = {lat: 42.059773, lng: -87.886823};
        this.officeCoord = {lat: 42.136286, lng: -87.791914};

        _init.call(this);
        _addMap.call(this);
    }


    function _init() {
        this.viewMod = new Modifier({
            size: [undefined, undefined]
        });
        this.rootNode = this.add(this.viewMod);
    }

    function _addMap() {
        var that = this;
        this.mapView = new MapView({
            type: MapView.MapType.GOOGLEMAPS,
            mapOptions: {
                id: 'contact-map',
                center: this.centerCoord,
                zoom: 5,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: window.sv.mapPalettePale,
                minZum: 9,
                panControl: true,
                scrollwheel: false,
                scaleControl: false,
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.LEFT_TOP
                }
            }
        });
        this.mapSurf = this.mapView.getSurface();
        this.mapSurf.pipe(this._eventOutput);

        this.mapView.on('load', function () {
            this.map = this.mapView.getMap();
            // Move across the globe and zoom-in when done
            /*Pan the map useint famo.us transitions*/
            this.mapView.setPosition(
                this.centerCoord,
                {duration: 500, curve: Easing.inOutElastic},
                function () {
                    this.map.setZoom(11);
                }.bind(this)
            );

            // Create a renderer for directions and bind it to the map.
            var directionsService = new google.maps.DirectionsService();
            var rendererOptions = {
                map: this.map
            }
            var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

            /*Creating a marker with infoWindow*/
            this.svetMarker = new google.maps.Marker({
                position: this.officeCoord,
                map: this.map,
                title: "Svet Office"
            });
            this.infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            this.infowindow.open(this.map, this.svetMarker);

            /*Find map dom element*/
            var mapId = this.mapView.getMapId();
            var mapDomEl = document.getElementById(mapId);
            /*Create Information Panel*/
            var el = document.createElement('div');
            el.innerHTML = directionForm;
            /*Append Information Panel to the map*/
            var infoPanel = el.getElementsByTagName('section')[0];
            mapDomEl.appendChild(infoPanel);
            console.log(mapDomEl);
            mapDomEl.style.visibility = "hidden";
            mapDomEl.style.visibility = "visible";


            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (pos) {
                    var geocoder = new google.maps.Geocoder();
                    that.userLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                    geocoder.geocode({'latLng': that.userLatLng}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                this.map.setZoom(11);
                                this.startMarker = new google.maps.Marker({
                                    position: that.userLatLng,
                                    title: "Drag to change your start location",
                                    draggable: true,
                                    map: this.map
                                });
                                google.maps.event.addListener(this.startMarker, 'dragend', function () {
                                    var userPosition = this.startMarker.getPosition();

                                    that.userLatLng = new google.maps.LatLng(userPosition.k, userPosition.D);
                                    geocoder.geocode({latLng: that.userLatLng}, function (results, status) {
                                        document.getElementById("start").value = results[0].formatted_address;

                                    })
                                }.bind(this));


                                var address = results[0].formatted_address;

                                var startDirection = document.getElementById('start');
                                startDirection.value = address;

                                this.transportType = google.maps.TravelMode.DRIVING;
                                calcRoute();

                                var searchButton = document.getElementById('searchRoute');
                                searchButton.onclick = function () {
                                    this.transportType = google.maps.TravelMode.DRIVING;
                                    calcRoute();
                                }.bind(this);

                                var bus = document.getElementById('byPublic');
                                bus.onclick = function () {
                                    this.transportType = google.maps.TravelMode.TRANSIT;
                                    calcRoute();
                                }.bind(this);
                                var car = document.getElementById('byCar');
                                car.onclick = function () {
                                    this.transportType = google.maps.TravelMode.DRIVING;
                                    calcRoute();
                                }.bind(this);
                                var bike = document.getElementById('byBicicle');
                                bike.onclick = function () {
                                    this.transportType = google.maps.TravelMode.BICYCLING;
                                    calcRoute();
                                }.bind(this);
                            }
                        } else {
                            alert("Geocoder failed due to: " + status);
                        }
                    }.bind(this));
                }.bind(this));


                function calcRoute() {
                    that.svetMarker.setMap(null);
                    //that.startMarker.setMap(null);

                    that.userLocationInfo = new google.maps.InfoWindow({
                        content: '<div>' +
                        'Drag to change your start location' +
                        '</div>'

                    });
                    that.infowindow.open(that.map, that.svetMarker);
                    that.userLocationInfo.open(that.map, that.startMarker);

                    // Retrieve the start and end locations and create
                    // a DirectionsRequest using WALKING directions.

                    var start = document.getElementById("start").value;
                    var end = document.getElementById("end").value;
                    var request = {
                        origin: start,
                        destination: end,
                        travelMode: that.transportType
                    };

                    // Route the directions and pass the response to a
                    // function to create markers for each step.
                    directionsService.route(request, function (response, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            var warnings = document.getElementById("warnings_panel");
                            warnings.innerHTML = "" + response.routes[0].warnings + "";
                            directionsDisplay.setDirections(response);
                        }
                    });
                }
            } else {
                error('not supported');
            }
        }.bind(this));
        this.infoWindows = [];
        this.markers = [];

        this.rootNode.add(this.mapView);
    }


    ContactMapDesk.prototype.render = function () {
        if (!this.map) {
            var el = document.getElementById(this.mapId);
            if (el) {
                this.map = new google.maps.Map(el, this.contactMapOptions);
            }
        }
        return this._node.render();
    }
    module.exports = ContactMapDesk;
});
