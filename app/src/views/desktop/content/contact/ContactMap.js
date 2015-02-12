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

    ContactMap.prototype = Object.create(View.prototype);
    ContactMap.prototype.constructor = ContactMap;
    ContactMap.DEFAULT_OPTIONS = {
        viewProps: {
            //boxShadow: window.sv.scheme.boxShadow,
            zIndex:101
            //backgroundColor: window.sv.scheme.textWhite
        }
    };

    function ContactMap() {
        View.apply(this, arguments);

        this.mapId = 'contact-map';
        this.centerCoord = {lat: 42.059773, lng: -87.886823};
        this.officeCoord = {lat: 42.136286, lng: -87.791914};

        _init.call(this);
        _addMap.call(this);
        //_markerInfo.call(this);
    }


    function _init() {
        this.viewMod = new Modifier({
            size: [undefined, undefined]
        });
        //this.bgSurf = new Surface({
        //    properties: this.options.viewProps
        //});
        //this.bgSurf.pipe(this._eventOutput);
        this.rootNode = this.add(this.viewMod);
        //this.rootNode.add(this.bgSurf);
    }

    function _addMap() {
        var that = this;
        this.mapView = new MapView({
            type: MapView.MapType.GOOGLEMAPS,
            mapOptions: {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: this.centerCoord,
                zoom: 5,
                minZum: 9,
                panControl: true,
                featureType: "water",
                elementType: "all",
                styles: window.sv.mapPalettePale,
                scrollwheel: false,
                scaleControl: false,
                zoomControl: true,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.LEFT_TOP
                }
            }
        });
        this.mapView.on('load', function () {




            this.map = this.mapView.getMap();


            var homeMap2 = this.mapView.getMapId();
            console.log("contact map: "+homeMap2);

            var directionsService = new google.maps.DirectionsService();

            // Create a renderer for directions and bind it to the map.
            var rendererOptions = {
                map: this.map
            }

            var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

            this.infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            // Move across the globe and zoom-in when done
            this.mapView.setPosition(
                this.centerCoord,
                {duration: 500, curve: Easing.inOutElastic},

                function () {
                    this.map.setZoom(11);
                }.bind(this)
            );

            this.transportType = google.maps.TravelMode.DRIVING;

            this.svetMarker = new google.maps.Marker({
                position: this.officeCoord,
                map: this.map,
                title: "Svet Office"
            });
            this.infowindow.open(this.map, this.svetMarker);

            var mapId = this.mapView.getMapId();
            var mapDomEl = document.getElementById(mapId);

            var el = document.createElement( 'div' );
            el.innerHTML = directionForm;

            var node = el.getElementsByTagName('section')[0];
            mapDomEl.appendChild(node);


            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (pos) {

                    var geocoder = new google.maps.Geocoder();
                    var userLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                    geocoder.geocode({'latLng': userLatLng}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                this.map.setZoom(11);
                                marker = new google.maps.Marker({
                                    position: userLatLng,
                                    map: this.map
                                });
                                var address = results[0].formatted_address;

                                var startDirection = document.getElementById('start');
                                startDirection.value = address;

                                var searchButton = document.getElementById('searchRoute');
                                searchButton.onclick = function () {
                                    calcRoute();
                                };

                                var bus = document.getElementById('byPublic');
                                bus.onclick = function () {
                                    this.transportType = google.maps.TravelMode.TRANSIT;
                                    calcRoute();

                                    this.infowindow.open(this.map, that.svetMarker);
                                }.bind(this);
                                var car = document.getElementById('byCar');
                                console.log(car);
                                car.onclick = function () {
                                    that.transportType = google.maps.TravelMode.DRIVING;
                                    calcRoute();
                                    this.infowindow.open(this.map, that.svetMarker);
                                }.bind(this);
                                var bike = document.getElementById('byBicicle');
                                bike.onclick = function () {
                                    that.transportType = google.maps.TravelMode.BICYCLING;
                                    calcRoute();
                                    this.infowindow.open(this.map, that.svetMarker);
                                }.bind(this);
                            }
                        } else {
                            alert("Geocoder failed due to: " + status);
                        }
                    }.bind(this));
                }.bind(this));


                function calcRoute() {
                    that.svetMarker.setMap(null);

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
        //this.svetMarker = new google.maps.Marker({
        //    position: this.officeCoord,
        //    map: map,
        //    title: "Svet Office"
        //});
        //this.infowindow.open(map, that.svetMarker);

        this.mapSurf = this.mapView.getSurface();
        this.mapSurf.pipe(this._eventOutput);

        this.infoWindows = [];
        this.markers = [];

        this.rootNode.add(this.mapView);

    }


    ContactMap.prototype.render = function () {
        if (!this.map) {
            var el = document.getElementById(this.mapId);
            if (el) {
                this.map = new google.maps.Map(el, this.contactMapOptions);
            }
        }
        return this._node.render();
    }
    module.exports = ContactMap;
});
