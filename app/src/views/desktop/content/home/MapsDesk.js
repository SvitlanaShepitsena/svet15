define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var Transitionable = require('famous/transitions/Transitionable');
    var Easing = require('famous/transitions/Easing');
    /*Famous map*/
    var MapView = require('fmaps/MapView');
    /*App Require*/
    var MapModifier = require('fmaps/MapModifier');
    var MapStateModifier = require('fmaps/MapStateModifier');
    var MapIconsPanel = require('dviews/content/home/MapIconsPanel');


    /*Map Coordinates for Cities*/
    var buffaloGrove = require('coord/BuffaloGrove');
    var highlandPark = require('coord/HighlandPark');
    var deerfield = require('coord/Deerfield');
    var glencoe = require('coord/Glencoe');
    var northbrook = require('coord/Northbrook');
    var glenview = require('coord/Glenview');
    var skokie = require('coord/Skokie');
    var vernonHills = require('coord/VernonHills');
    var wheeling = require('coord/Wheeling');
    var wilmette = require('coord/Wilmette');
    var niles = require('coord/Niles');
    var evanston = require('coord/Evanston');


    MapsDesk.DEFAULT_OPTIONS = {
        mapCityOpts: {
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillOpacity: 0.35
        }
    };

    function MapsDesk() {
        this.highestLat = 42.223493;
        this.allowAnimation = true;

        this.opacityLegendSvet = new Transitionable(0);
        this.opacityLegendYp = new Transitionable(0);
        this.geocoder = new google.maps.Geocoder();

        View.apply(this, arguments);
        _init.call(this);
        _map.call(this);
        _svetMapIcons.call(this);
    }

    function _init() {
        this.centerModifier = new Modifier({
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    function _getCityInfo(cityName, ruSpeakingNum) {
        this.mapCityInfo = '<p class="map-info" > <span class="town-name">' + cityName + '.</span> <span class = "text-info">' + ruSpeakingNum + ' %</span> of Russian speaking customers</p>';
        return this.mapCityInfo;
    }

    function _svetMapIcons() {
        this.modMap = new Modifier({
            align: [0.5, 0.3],
            origin: [0.5, 0.2],
            transform: Transform.translate(0, 0, 0)
        });
        this.mapIconsPanel = new MapIconsPanel();
        this.mapIconsPanel.pipe(this._eventOutput);


        this.mapIconsPanel.on('show:svetPoints', function () {
            this.showSvetPoints();
        }.bind(this));

        this.mapIconsPanel.on('show:ypCompanies', function () {
            this.showYpCompanies();
        }.bind(this));

        this.rootNode.add(this.modMap).add(this.mapIconsPanel);
    }

    function _closeAllOverlays() {
        this.infoWindows.forEach(function (info) {
            info.close(this.gMap);
        });
        this.markers.forEach(function (marker) {
            marker.setMap(null);
        });

        this.opacityLegendSvet.set(0, {duration: 500, curve: 'easeInOut'});
        this.opacityLegendYp.set(0, {duration: 500, curve: 'easeInOut'});

    }

    function legendSvet() {
        this.mapModifier = new MapModifier({
            mapView: this.mapView,
            position: this.legendPlace,
            zoomBase: 9,
            zoomScale: 0.3
        });

        this.modifier = new Modifier({
            size: [170, 50],
            align: [0, 0],
            origin: [0.5, 0.5],
            opacity: function () {
                return this.opacityLegendSvet.get();
            }.bind(this)

        });

        this.mapSurface = new Surface({
            content: '<p><img src="img/svet-icon.png">  Svet distribution points</p>',
            properties: {
                fontSize: '12px',
                color: window.sv.scheme.textDark
            }
        });
        this.mapSurface.pipe(this.mapView);
        this.opacityLegendSvet.set(1, {duration: 500, curve: 'easeInOut'});

        this.rootNode.add(this.mapModifier).add(this.modifier).add(this.mapSurface);
    }

    function legendYp() {
        this.mapModifier = new MapModifier({
            mapView: this.mapView,
            zIndex: 1,
            position: this.legendPlace,
            zoomBase: 9,
            zoomScale: 0.3
        });

        this.modifier = new Modifier({
            align: [0, 0],
            zIndex: 1,
            origin: [0.5, 0.5],
            opacity: function () {
                return this.opacityLegendYp.get();
            }.bind(this)

        });

        this.mapSurface = new Surface({
            size: [170, 50],
            content: '<p><img src="img/google-icon.png">  Our current clients </p>',
            properties: {
                zIndex: 1,
                color: window.sv.scheme.textDark
            }
        });
        this.mapSurface.pipe(this.mapView);
        this.opacityLegendYp.set(1, {duration: 500, curve: 'easeInOut'});

        this.rootNode.add(this.mapModifier).add(this.modifier).add(this.mapSurface);
    }

    function _getNormalizedCenter(mapInfo) {
        var latDifference = mapInfo.northEast.lat - this.highestLat;
        lat = this.northChicagoEnd.lat + latDifference / 15;
        var lng = this.northChicagoEnd.lng;
        return {lat: lat, lng: lng};
    }

    function _map() {
        this.gMap;
        this.northChicagoStart = {lat: 41.011949, lng: -87.709012};
        this.legendPlace = {lat: 42.131767, lng: -87.579624};
        this.northChicagoEnd = {lat: 42.150571, lng: -87.710238};

        var styledMap = new google.maps.StyledMapType(window.sv.mapPalettePale,
            {name: "Svet Media Group"});

        this.mapView = new MapView({
            type: MapView.MapType.GOOGLEMAPS,
            syncS: this.options.sync,
            mapOptions: {
                featureType: "water",
                elementType: "all",
                styles: window.sv.mapPalettePale,
                stylers: [
                    {
                        visibility: "on"
                    },
                    {
                        color: "#acbcc9"
                    }
                ],
                zoom: 11,
                center: this.northChicagoStart,
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
        this.mapSurf.on('scroll', function () {
            console.log('ss');
        })
        this.mapSurf.pipe(this._eventOutput);

        this.infoWindows = [];
        this.markers = [];

        this.rootNode.add(this.mapView);

        this.mapView.on('load', function () {
            var mapInfo = this.mapView._getMapInfo();
            var homeMap1 = this.mapView.getMapId();
            console.log("home map: "+homeMap1);
            var endPoint = _getNormalizedCenter.call(this, mapInfo);
            this.mapView.setPosition(
                endPoint,
                {duration: 500, curve: Easing.outBack}
            );
            this.gMap = this.mapView.getMap();

            this.gMap.mapTypes.set('map_style', styledMap);
            this.gMap.setMapTypeId('map_style');

            /*********************************
             * Here are Svet Statistics by towns
             *********************************/

            /**
             * 1. =Buffalo Grove
             */

            var buffaloGroveCoordinates = buffaloGrove.getCoordinates();

            var buffaloGroveLayer = new google.maps.Polygon({
                paths: buffaloGroveCoordinates,
                strokeColor: window.sv.cityMapColors.buffaloGrove,
                fillColor: window.sv.cityMapColors.buffaloGrove,
                strokeOpacity: this.options.mapCityOpts.strokeOpacity,
                strokeWeight: this.options.mapCityOpts.strokeWeight,
                fillOpacity: this.options.mapCityOpts.fillOpacity
            });
            buffaloGroveLayer.setMap(this.gMap);

            google.maps.event.addListener(buffaloGroveLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.buffaloGroveInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.buffaloGroveInfo);
                this.buffaloGroveInfo.setContent(_getCityInfo(window.sv.cities.buffaloGrove, 18.7));
                this.buffaloGroveInfo.setPosition(e.latLng);
                this.buffaloGroveInfo.open(this.gMap);

            }.bind(this));
            /*Buffalo Grove Ends*/


            /**
             * 2. =Highland Park
             */

            var highlandParkCoordinates = highlandPark.getCoordinates();

            var highlandParkLayer = new google.maps.Polygon({
                paths: highlandParkCoordinates,
                strokeColor: window.sv.cityMapColors.highlandpark,
                fillColor: window.sv.cityMapColors.highlandpark,
                strokeOpacity: this.options.mapCityOpts.strokeOpacity,
                strokeWeight: this.options.mapCityOpts.strokeWeight,
                fillOpacity: this.options.mapCityOpts.fillOpacity
            });
            highlandParkLayer.setMap(this.gMap);

            google.maps.event.addListener(highlandParkLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoHighlandPark = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoHighlandPark);
                this.infoHighlandPark.setContent(_getCityInfo(window.sv.cities.highlandPark, 18.2));
                this.infoHighlandPark.setPosition(e.latLng);
                this.infoHighlandPark.open(this.gMap);

            }.bind(this));

            /*Highland Park Ends*/

            /**
             * 3. =Derrfield
             */

            var deerfieldCoordinates = deerfield.getCoordinates();

            var deerfieldLayer = new google.maps.Polygon({
                paths: deerfieldCoordinates,
                strokeColor: window.sv.cityMapColors.deerfield,
                fillColor: window.sv.cityMapColors.deerfield,
                strokeOpacity: this.options.mapCityOpts.strokeOpacity,
                strokeWeight: this.options.mapCityOpts.strokeWeight,
                fillOpacity: this.options.mapCityOpts.fillOpacity
            });
            deerfieldLayer.setMap(this.gMap);

            google.maps.event.addListener(deerfieldLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoDeerfield = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoDeerfield);
                this.infoDeerfield.setContent(_getCityInfo(window.sv.cities.deerfield, 16.1));
                this.infoDeerfield.setPosition(e.latLng);
                this.infoDeerfield.open(this.gMap);

            }.bind(this));
            /*Deerfield Ends*/

            /**
             * 4. =Glencoe
             */

            var glencoeCoordinates = glencoe.getCoordinates();

            var glencoeLayer = new google.maps.Polygon({
                paths: glencoeCoordinates,
                strokeColor: window.sv.cityMapColors.glencoe,
                fillColor: window.sv.cityMapColors.glencoe,
                strokeOpacity: this.options.mapCityOpts.strokeOpacity,
                strokeWeight: this.options.mapCityOpts.strokeWeight,
                fillOpacity: this.options.mapCityOpts.fillOpacity
            });
            glencoeLayer.setMap(this.gMap);

            google.maps.event.addListener(glencoeLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoGlencoe = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoGlencoe);
                this.infoGlencoe.setContent(_getCityInfo(window.sv.cities.glencoe, 14.4));
                this.infoGlencoe.setPosition(e.latLng);
                this.infoGlencoe.open(this.gMap);

            }.bind(this));
            /*=Glencoe Ends*/

            /**
             * 5. =Northbrook
             */

            var northbrookCoordinates = northbrook.getCoordinates();

            var northbrookLayer = new google.maps.Polygon({
                paths: northbrookCoordinates,
                strokeColor: window.sv.cityMapColors.northbrook,
                fillColor: window.sv.cityMapColors.northbrook,
                strokeOpacity: this.options.mapCityOpts.strokeOpacity,
                strokeWeight: this.options.mapCityOpts.strokeWeight,
                fillOpacity: this.options.mapCityOpts.fillOpacity
            });
            northbrookLayer.setMap(this.gMap);

            google.maps.event.addListener(northbrookLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoNorthbrook = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoNorthbrook);
                this.infoNorthbrook.setContent(_getCityInfo(window.sv.cities.northbrook, 14.3));
                this.infoNorthbrook.setPosition(e.latLng);
                this.infoNorthbrook.open(this.gMap);

            }.bind(this));
            /*Northbrook ends*/


            /**
             * 6. =Vernon Hills
             */

            var vernonHillsCoordinates = vernonHills.getCoordinates();

            var vernonHillsLayer = new google.maps.Polygon({
                paths: vernonHillsCoordinates,
                strokeColor: window.sv.cityMapColors.vernonHills,
                fillColor: window.sv.cityMapColors.vernonHills,
                strokeOpacity: this.options.mapCityOpts.strokeOpacity,
                strokeWeight: this.options.mapCityOpts.strokeWeight,
                fillOpacity: this.options.mapCityOpts.fillOpacity
            });
            vernonHillsLayer.setMap(this.gMap);

            google.maps.event.addListener(vernonHillsLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.vernonHillsInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.vernonHillsInfo);
                this.vernonHillsInfo.setContent(_getCityInfo(window.sv.cities.vernonHills, 9.1));
                this.vernonHillsInfo.setPosition(e.latLng);
                this.vernonHillsInfo.open(this.gMap);

            }.bind(this));
            /*Vernon Hills Ends*/


            /**
             * 7. =Skokie
             */

            var skokieCoordinates = skokie.getCoordinates();

            var skokieLayer = new google.maps.Polygon({
                paths: skokieCoordinates,
                title: 'Skokie',
                strokeColor: window.sv.cityMapColors.skokie,
                fillColor: window.sv.cityMapColors.skokie,
                strokeOpacity: this.options.mapCityOpts.strokeOpacity,
                strokeWeight: this.options.mapCityOpts.strokeWeight,
                fillOpacity: this.options.mapCityOpts.fillOpacity
            });
            skokieLayer.setMap(this.gMap);


            google.maps.event.addListener(skokieLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoSkokie = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoSkokie);
                this.infoSkokie.setContent(_getCityInfo(window.sv.cities.skokie, 20));
                this.infoSkokie.setPosition(e.latLng);
                this.infoSkokie.open(this.gMap);

            }.bind(this));
            /*Skokie Ends*/

            /**
             * 8. =Evanston
             */

            var evanstonCoordinates = evanston.getCoordinates();

            var evanstonLayer = new google.maps.Polygon({
                paths: evanstonCoordinates,
                strokeColor: window.sv.cityMapColors.evanston,
                fillColor: window.sv.cityMapColors.evanston,
                strokeOpacity: this.options.mapCityOpts.strokeOpacity,
                strokeWeight: this.options.mapCityOpts.strokeWeight,
                fillOpacity: this.options.mapCityOpts.fillOpacity
            });

            evanstonLayer.setMap(this.gMap);
            google.maps.event.addListener(evanstonLayer, 'click', function (e) {

                _closeAllOverlays.call(this);
                this.evanstonInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.evanstonInfo);
                this.evanstonInfo.setContent(_getCityInfo(window.sv.cities.evanston, 7.2));
                this.evanstonInfo.setPosition(e.latLng);
                this.evanstonInfo.open(this.gMap);

            }.bind(this));
            /*Evanston Ends*/


            /**
             * 9. =Wilmette
             */

            var wilmetteCoordinates = wilmette.getCoordinates();

            var wilmetteLayer = new google.maps.Polygon({
                paths: wilmetteCoordinates,
                strokeColor: window.sv.cityMapColors.wilmette,
                fillColor: window.sv.cityMapColors.wilmette,
                strokeOpacity: this.options.mapCityOpts.strokeOpacity,
                strokeWeight: this.options.mapCityOpts.strokeWeight,
                fillOpacity: this.options.mapCityOpts.fillOpacity
            });
            wilmetteLayer.setMap(this.gMap);

            google.maps.event.addListener(wilmetteLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.wilmetteInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.wilmetteInfo);
                this.wilmetteInfo.setContent(_getCityInfo(window.sv.cities.wilmette, 7.2));
                this.wilmetteInfo.setPosition(e.latLng);
                this.wilmetteInfo.open(this.gMap);

            }.bind(this));
            /*Wilmette Ends*/

            /**
             * 10. =Glenview
             */

            var glenviewCoordinates = glenview.getCoordinates();

            var glenviewLayer = new google.maps.Polygon({
                paths: glenviewCoordinates,
                strokeColor: window.sv.cityMapColors.glenview,
                fillColor: window.sv.cityMapColors.glenview,
                strokeOpacity: this.options.mapCityOpts.strokeOpacity,
                strokeWeight: this.options.mapCityOpts.strokeWeight,
                fillOpacity: this.options.mapCityOpts.fillOpacity
            });
            glenviewLayer.setMap(this.gMap);

            google.maps.event.addListener(glenviewLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.glenviewInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.glenviewInfo);
                this.glenviewInfo.setContent(_getCityInfo(window.sv.cities.glenview, 13.8));
                this.glenviewInfo.setPosition(e.latLng);
                this.glenviewInfo.open(this.gMap);

            }.bind(this));
            /*Glenview Ends*/


            /**
             * 11. =Wheeling
             */

            var wheelingCoordinates = wheeling.getCoordinates();

            var wheelingLayer = new google.maps.Polygon({
                paths: wheelingCoordinates,
                strokeColor: window.sv.cityMapColors.wheeling,
                fillColor: window.sv.cityMapColors.wheeling,
                strokeOpacity: this.options.mapCityOpts.strokeOpacity,
                strokeWeight: this.options.mapCityOpts.strokeWeight,
                fillOpacity: this.options.mapCityOpts.fillOpacity
            });
            wheelingLayer.setMap(this.gMap);

            google.maps.event.addListener(wheelingLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.wheelingInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.wheelingInfo);
                this.wheelingInfo.setContent(_getCityInfo(window.sv.cities.wheeling, 8.9));
                this.wheelingInfo.setPosition(e.latLng);
                this.wheelingInfo.open(this.gMap);

            }.bind(this));
            /*Wheeling Ends*/

            /**
             * 12. =Niles
             */

            var nilesCoordinates = niles.getCoordinates();

            var nilesLayer = new google.maps.Polygon({
                paths: nilesCoordinates,
                strokeColor: window.sv.cityMapColors.niles,
                fillColor: window.sv.cityMapColors.niles,
                strokeOpacity: this.options.mapCityOpts.strokeOpacity,
                strokeWeight: this.options.mapCityOpts.strokeWeight,
                fillOpacity: this.options.mapCityOpts.fillOpacity
            });
            nilesLayer.setMap(this.gMap);
            google.maps.event.addListener(nilesLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.nilesInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.nilesInfo);
                this.nilesInfo.setContent(_getCityInfo(window.sv.cities.niles, 7.2));
                this.nilesInfo.setPosition(e.latLng);
                this.nilesInfo.open(this.gMap);

            }.bind(this));


            //_difier.call(this);
        }.bind(this));
    }


    MapsDesk.prototype = Object.create(View.prototype);
    MapsDesk.prototype.constructor = MapsDesk;


    MapsDesk.prototype.hideEverything = function () {
        this.allowAnimation = false;
        _closeAllOverlays.call(this);

    }
    MapsDesk.prototype.showMapIcons = function () {
        this.mapIconsPanel.animateUp();
    }
    MapsDesk.prototype.hideMapIcons = function () {
        this.mapIconsPanel.animateDown();
    }
    MapsDesk.prototype.randomPoint = function (x) {
        var maxRandomDisp = .1;

        x = (x << 13) ^ x;
        return 0.01 + maxRandomDisp * ( 1.0 - ( (x * (x * x * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);


    }


    MapsDesk.prototype.showYpCompanies = function () {
        var that = this;
        that.allowAnimation = true;
        that.allowSvetAnimation = false;
        that.allowYpAnimation = true;

        var baseLat = 42.14,

            baseLong = -87.9;

        _closeAllOverlays.call(this);


        var counter = 100;

        function dropYpCompanies() {
            if (!that.allowAnimation || that.allowSvetAnimation) {
                return;
            }
            counter++;
            var latLng = new google.maps.LatLng(baseLat + that.randomPoint(counter), baseLong + that.randomPoint(counter + 2));
            that.ypMarker = new google.maps.Marker({
                position: latLng,
                animation: google.maps.Animation.DROP
            });
            that.markerInfo = new google.maps.InfoWindow();
            that.infoWindows.push(that.markerInfo);

            google.maps.event.addListener(that.ypMarker, 'click', function (e) {
                that.geocoder.geocode({'latLng': latLng}, function (res) {
                    that.markerInfo.setContent('<p class="map-marker-info">' + res[0].formatted_address + '</p>');
                    that.markerInfo.setPosition(e.latLng);
                    that.markerInfo.open(that.gMap);
                }.bind(that));


            }.bind(that));

            that.markers.push(that.ypMarker);
            that.ypMarker.setMap(this.gMap);
        }

        for (var i = 1; i < 25; i++) {
            setTimeout(function () {
                dropYpCompanies.call(this);
            }.bind(this), i * 100);
            if (that.allowSvetAnimation) {
                i = 25;
                break;
            }
        }
        legendYp.call(this);

    }
    MapsDesk.prototype.showSvetPoints = function () {
        this.allowAnimation = true;
        this.allowSvetAnimation = true;
        this.allowYpAnimation = false;
        var that = this;
        var baseLat = 42.14,
            baseLong = -87.9;

        _closeAllOverlays.call(this);

        var counter = 0;

        function dropSvetPoints() {

            if (!that.allowAnimation || that.allowYpAnimation) {
                return;
            }
            counter++;
            var latLng = new google.maps.LatLng(baseLat + that.randomPoint(counter), baseLong + that.randomPoint(counter + 2));
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

        for (var i = 1; i < 40; i++) {
            setTimeout(function () {

                dropSvetPoints.call(this);
            }.bind(this), i * 100);
            if (this.allowYpAnimation) {
                i = 41;
            }
        }
        legendSvet.call(this);

    }

    module.exports = MapsDesk;
})
;
