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
        this.officeCoord = {lat: 42.136298, lng: -87.791989};
        this.markerCoord = {lat: 42.152627, lng: -87.772768};


        this.mapView = new MapView({
            type: MapView.MapType.GOOGLEMAPS,
            mapOptions: {
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
        this.mapView.on('load', function () {
            this.map = this.mapView.getMap();
            // Move across the globe and zoom-in when done
            /*Pan the map useint famo.us transitions*/
            this.mapView.setPosition(
                this.centerCoord,
                {
                    duration: 500
                },
                function () {
                    this.map.setZoom(11);
                }.bind(this)
            );
            /*Find map dom element*/
            this.mapId = this.mapView.getMapId();
            //console.log(this.mapId);
            this.mapDomEl = document.getElementById(this.mapId);
            /*Create Information Panel*/
            this.el = document.createElement('div');
            this.el.innerHTML = directionForm;
            /*Append Information Panel to the map*/
            this.infoPanel = this.el.getElementsByTagName('section')[0];
            this.mapDomEl.appendChild(this.infoPanel);
            //console.log(this.mapDomEl);


            this.mapMod = new MapModifier({
                mapView: this.mapView,
                position: this.markerCoord
            });
            this.svetMarkerMod = new Modifier({
                size: [50, 50]
            });
            this.svetMarkerSurf = new Surface({
                properties: {
                    color: 'white',
                    textAlign: 'center',
                    backgroundColor: '#FA5C4F'
                }
            });
            this.rootNode.add(this.mapMod).add(this.svetMarkerMod).add(this.svetMarkerSurf);


            /*Creating a marker to bound infoWindow to it*/
            this.svetMarker = new google.maps.Marker({
                position: this.officeCoord,
                map: this.map,
                title: "Svet Office"
            });
            this.infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            this.infowindow.open(this.map, this.svetMarker);

            if (window.navigator.geolocation) {
                window.navigator.geolocation.getCurrentPosition(function (pos) {
                    this.geocoder = new google.maps.Geocoder();
                    this.userLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                    this.geocoder.geocode({'latLng': that.userLatLng}, function (results, status) {
                        console.log(pos.coords.latitude);
                        console.log(pos.coords.longitude);
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                //console.log(results);
                                this.map.setZoom(11);
                                this.startMarker = new google.maps.Marker({
                                    position: that.userLatLng,
                                    draggable: true,
                                    map: this.map
                                });
                                /*Calculate route for initial user location on map load*/
                                this.address = results[0].formatted_address;
                                this.startDirection = document.getElementById('start');
                                this.startDirection.value = this.address;
                                this.transportType = google.maps.TravelMode.DRIVING;
                                calcRoute();

                                /*Calculate direction for draggable location pointer*/
                                google.maps.event.addListener(this.startMarker, 'dragend', function () {
                                    var userPosition = this.startMarker.getPosition();
                                    var userLatLng = new google.maps.LatLng(userPosition.k, userPosition.D);
                                    this.geocoder.geocode({latLng: userLatLng}, function (results) {
                                        document.getElementById("start").value = results[0].formatted_address;

                                    })
                                }.bind(this));

                                this.searchButton = document.getElementById('searchRoute');
                                this.searchButton.onclick = function () {
                                    this.transportType = google.maps.TravelMode.DRIVING;
                                    calcRoute();
                                }.bind(this);

                                this.bus = document.getElementById('byPublic');
                                this.bus.onclick = function () {
                                    this.transportType = google.maps.TravelMode.TRANSIT;
                                    calcRoute();
                                }.bind(this);
                                this.car = document.getElementById('byCar');
                                this.car.onclick = function () {
                                    this.transportType = google.maps.TravelMode.DRIVING;
                                    calcRoute();
                                }.bind(this);
                                this.bike = document.getElementById('byBicicle');
                                this.bike.onclick = function () {
                                    this.transportType = google.maps.TravelMode.BICYCLING;
                                    calcRoute();
                                }.bind(this);
                            }
                        } else {
                            alert("Geocoder failed due to: " + status);
                        }
                    }.bind(this));
                }.bind(this));

                // Create a renderer for calculating directions and bind it to the map.
                var directionsService = new google.maps.DirectionsService();
                var directionsDisplay = new google.maps.DirectionsRenderer({
                    map: this.map
                });

                function calcRoute() {
                    that.svetMarker.setMap(null);
                    //that.startMarker.setMap(null);

                    that.userLocationInfo = new google.maps.InfoWindow({
                        content: '<div>' +
                        'Drag to change your start location' +
                        '</div>'

                    });
                    that.userLocationInfo.open(that.map, that.startMarker);
                    that.infowindow.open(that.map, that.svetMarker);

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
                    }.bind(this));
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
