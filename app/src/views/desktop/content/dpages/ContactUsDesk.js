define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    var BkImageSurface = require("famousimg/BkImageSurface");
    /*html*/
    var contactDesk = require('text!dviews/jade/contact/contact-desk.html');
    var directionForm = require('text!dviews/jade/contact/direction-form.html');
    var contentString = require('text!dviews/jade/contact/svet-map-info.html');


    ContactUsDesk.prototype = Object.create(View.prototype);
    ContactUsDesk.prototype.constructor = ContactUsDesk;

    ContactUsDesk.DEFAULT_OPTIONS = {
        viewProps: {
            paddingTop: '50px',
            lineHeight: '1.7em',
            color: window.sv.scheme.textDark,
            textAlign: 'center',
            boxShadow: window.sv.scheme.boxShadow,
            background: "#595153 url('img/bg/bg-contact.jpg')"
        },
        contentProps: {
            boxShadow: window.sv.scheme.boxShadow,
            backgroundColor: window.sv.scheme.textWhite,
            paddingLeft: '20px',
            paddingBottom: '15px',
            color: '#393939',
            fontSize: '100%',
            lineHeight: '130%',
            textAlign: 'left'
        }
    };

    function ContactUsDesk() {
        View.apply(this, arguments);

        this.viewMod = new Modifier({
            size: [undefined, window.sv.sizing.viewHeight],
            align: [0.5, 0.6],
            origin: [0.5, 0.6],
            transform: Transform.translate(0, 0, 0)
        });
        this.mapSurface = new Surface({
            //content: contactDesk,
            properties: this.options.viewProps

        });

        this.mapSurface.pipe(this._eventOutput);
        this.rootNode = this.add(this.viewMod);
        this.rootNode.add(this.mapSurface);
        this.svetMarkerInfo = new google.maps.InfoWindow({
            content: contentString,
            disableAutoPan: true
        });

        _addMap.call(this);
        //_test.call(this);
    }
        function _test() {
            this.mod = new Modifier({
                size: [undefined, 1000],
                align: [0, 0],
                origin: [0, 0],
                transform: Transform.translate(0, 0, 101)
            });
            this.surface = new Surface({
                content: '',
                classes: [],
                properties: {
                    color: 'white',
                    textAlign: 'center',
                    backgroundColor: '#FA5C4F'
                }
            });
            this.rootNode.add(this.mod).add(this.surface);

        }

    function _addMap() {
        this.mapId = 'map-canvas2';
        this.centerCoord = {lat: 42.059773, lng: -87.886823};
        this.officeCoord = {lat: 42.136286, lng: -87.791914};

        this.mapMod = new Modifier({
            size: [undefined, 1000],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 0, 10)
        });

        this.mapSurface = new Surface({
            classes: ['mapview'],
            content: '<div id="'+this.mapId+'" style="width: 100%; height: 100%;"></div>'
        });
        this.mapOptions = {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: this.centerCoord,
            styles: window.sv.mapPalettePale,
            zoom: 11,
            scrollwheel:false,
            minZoom: 9,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            panControl: true
        };


        this.mapSurface.pipe(this._eventOutput);
        this.rootNode.add(this.mapMod).add(this.mapSurface);
    }

    ContactUsDesk.prototype.render = function () {
        if (!this.map) {
            var map;
            var directionsDisplay;
            var directionsService;
            var stepDisplay;


            var elm = document.getElementById(this.mapId);

            if (elm) {
                var that = this;

                this.map = new google.maps.Map(elm, this.mapOptions);
                console.log(this.map);
                map = this.map;

                that.transportType = google.maps.TravelMode.DRIVING;

                that.svetMarker = new google.maps.Marker({
                    position: this.officeCoord,
                    map: map,
                    title: "Svet Office"
                });
                this.svetMarkerInfo.open(map, that.svetMarker);

                directionsService = new google.maps.DirectionsService();

                // Create a renderer for directions and bind it to the map.
                var rendererOptions = {
                    map: map
                }

                directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

                // Instantiate an info window to hold step text.
                stepDisplay = new google.maps.InfoWindow();
                elm.innerHTML = elm.innerHTML + directionForm;

                var markerArray = [];

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (pos) {

                        var geocoder = new google.maps.Geocoder();
                        var userLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                        geocoder.geocode({'latLng': userLatLng}, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (results[0]) {
                                    map.setZoom(11);
                                    var userLocationMarker = new google.maps.Marker({
                                        position: userLatLng,
                                        map: map,
                                        title: "Your approximate location"
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
                                        this.svetMarkerInfo.open(map, this.svetMarker);
                                    }.bind(this);
                                    var car = document.getElementById('byCar');
                                    car.onclick = function () {
                                        this.transportType = google.maps.TravelMode.DRIVING;
                                        calcRoute();
                                        this.svetMarkerInfo.open(map, this.svetMarker);
                                    }.bind(this);
                                    var bike = document.getElementById('byBicicle');
                                    bike.onclick = function () {
                                        this.transportType = google.maps.TravelMode.BICYCLING;
                                        calcRoute();
                                        this.svetMarkerInfo.open(map, this.svetMarker);
                                    }.bind(this);
                                }
                            } else {
                                alert("Geocoder failed due to: " + status);
                            }
                        }.bind(this));
                    }.bind(this));
                } else {
                    error('not supported');
                }

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
            }
        }
        return this._node.render();
    };

    module.exports = ContactUsDesk;
});
