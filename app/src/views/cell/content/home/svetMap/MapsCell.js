define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var Transitionable = require('famous/transitions/Transitionable');
    var Easing = require('famous/transitions/Easing');

    /*App Requiere*/
    var MapsLegendCell = require('cviews/content/home/svetMap/MapsLegendCell');
    /*Map Functionality*/
    var MapView = require('fmaps/MapView');
    var MapModifier = require('fmaps/MapModifier');
    var MapStateModifier = require('fmaps/MapStateModifier');
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

    MapsCell.DEFAULT_OPTIONS = {
        strokeOpacity: '0.5',
        strokeWeight: '2',
        fillOpacity: '0.35'
    };

    function MapsCell() {
        this.allowAnimation = true;
        View.apply(this, arguments);

        this.opacityLegendSvet = new Transitionable(0);
        this.opacityLegendYp = new Transitionable(0);
        this.geocoder = new google.maps.Geocoder();

        this.mapId = 'home-map-cell';
        this.centerCoordCell = {lat: 42.127572, lng: -87.788725};
        _init.call(this);
        _map.call(this);
    }

    function _init() {
        this.centerModifier = new Modifier({});
        this.rootNode = this.add(this.centerModifier);
    }


    /**
     * Hide all overlays symbols.
     */
    function _closeAllOverlays() {
        this.infoWindows.forEach(function (info) {
            info.close(this.gMap);
        });
        this.markers.forEach(function (marker) {
            marker.setMap(null);
        });

        this.opacityLegendYp.set(0, {duration: 500, curve: 'easeInOut'});
        this.mapsLegendCell.hide();
    }

    function _legendSvet() {
        this.mapLegendSvetMod = new MapModifier({
            mapView: this.mapView,
            position: this.legendPlace,
            zoomBase: 9,
            zoomScale: 0.3
        });
        this.mapsLegendCell = new MapsLegendCell({
            legendContent: '<p><img src="../../../../../../img/google-map/svet-distribution-xs.png">  Svet distribution  <br/> &nbsp &nbsp &nbsp points</p>'
        });
        this.rootNode.add(this.mapLegendSvetMod).add(this.mapsLegendCell);
    }


    function legendYp() {
        this.mapLegendYpMod = new MapModifier({
            size: [170, 50],
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
                return this.opacityLegendYp.get();
            }.bind(this)

        });
        this.mapSurface = new Surface({
            content: '<p><img src="../../../../../../img/google-map/yp-business-xs.png"> Our current clients </p>'
        });
        this.opacityLegendYp.set(1, {duration: 500, curve: 'easeInOut'});

        this.mapSurface.pipe(this._eventOutput);
        this.rootNode.add(this.mapLegendYpMod).add(this.modifier).add(this.mapSurface);
    }

    function _map() {
        this.gMap;
        this.northChicagoStart = {lat: 41.011949, lng: -87.709012};
        this.legendPlace = {lat: 42.195, lng: -87.61};
        this.northChicagoEnd = {lat: 42.082571, lng: -87.710238};

        this.mapView = new MapView({
            type: MapView.MapType.GOOGLEMAPS,
            mapOptions: {
                styles: window.sv.mapPalettePale,
                zoom: 10,
                center: this.northChicagoStart,
                disableDefaultUI: true,
                scrollwheel: false,
                panControl: false,
                scaleControl: false,
                zoomControl: false,
                mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                }
            }
        });
        this.mapSurf = this.mapView.getSurface();
        this.mapSurf.pipe(this._eventOutput);

        this.infoWindows = [];
        this.markers = [];

        this.rootNode.add(this.mapView);

        this.mapView.on('load', function () {
            this.gMap = this.mapView.getMap();
            this.mapView.setPosition(
                this.centerCoordCell,
                {duration: 500, curve: Easing.outBack}
            );
            _legendSvet.call(this);
            /*********************************
             * Here are Svet Statistics by towns
             *********************************/

            /**
             * 1.=Buffalo Grove
             */

            var buffaloGroveCoordinates = buffaloGrove.getCoordinates();

            var buffaloGroveLayer = new google.maps.Polygon({
                paths: buffaloGroveCoordinates,
                strokeColor: window.sv.cityMapColors.buffaloGrove,
                fillColor: window.sv.cityMapColors.buffaloGrove,
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            buffaloGroveLayer.setMap(this.gMap);

            google.maps.event.addListener(buffaloGroveLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.buffaloGroveInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.buffaloGroveInfo);
                this.buffaloGroveInfo.setContent(window.getCityInfo(window.sv.cities.buffaloGrove, 18.7));
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
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            highlandParkLayer.setMap(this.gMap);

            google.maps.event.addListener(highlandParkLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoHighlandPark = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoHighlandPark);
                this.infoHighlandPark.setContent(window.getCityInfo(window.sv.cities.highlandPark, 18.2));
                this.infoHighlandPark.setPosition(e.latLng);
                this.infoHighlandPark.open(this.gMap);

            }.bind(this));

            /*Highland Park ends*/

            /**
             * 3. =Deerfield
             */

            var deerfieldCoordinates = deerfield.getCoordinates();
            var deerfieldLayer = new google.maps.Polygon({
                paths: deerfieldCoordinates,
                strokeColor: window.sv.cityMapColors.deerfield,
                fillColor: window.sv.cityMapColors.deerfield,
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            deerfieldLayer.setMap(this.gMap);

            google.maps.event.addListener(deerfieldLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoDeerfield = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoDeerfield);
                this.infoDeerfield.setContent(window.getCityInfo(window.sv.cities.deerfield, 16.1));
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
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            glencoeLayer.setMap(this.gMap);

            google.maps.event.addListener(glencoeLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoGlencoe = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoGlencoe);
                this.infoGlencoe.setContent(window.getCityInfo(window.sv.cities.glencoe, 14.4));
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
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            northbrookLayer.setMap(this.gMap);

            google.maps.event.addListener(northbrookLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoNorthbrook = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoNorthbrook);
                this.infoNorthbrook.setContent(window.getCityInfo(window.sv.cities.northbrook, 14.3));
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
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            vernonHillsLayer.setMap(this.gMap);

            google.maps.event.addListener(vernonHillsLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.vernonHillsInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.vernonHillsInfo);
                this.vernonHillsInfo.setContent(window.getCityInfo(window.sv.cities.vernonHills, 9.1));
                this.vernonHillsInfo.setPosition(e.latLng);
                this.vernonHillsInfo.open(this.gMap);

            }.bind(this));


            /**
             * 7. =Skokie
             */
            var skokieCoordinates = skokie.getCoordinates();

            var skokieLayer = new google.maps.Polygon({
                paths: skokieCoordinates,
                title: 'Skokie',
                strokeColor: window.sv.cityMapColors.skokie,
                fillColor: window.sv.cityMapColors.skokie,
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            skokieLayer.setMap(this.gMap);


            google.maps.event.addListener(skokieLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoSkokie = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoSkokie);
                this.infoSkokie.setContent(window.getCityInfo(window.sv.cities.skokie, 20));
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
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity

            });
            evanstonLayer.setMap(this.gMap);
            google.maps.event.addListener(evanstonLayer, 'click', function (e) {

                _closeAllOverlays.call(this);
                this.evanstonInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.evanstonInfo);
                this.evanstonInfo.setContent(window.getCityInfo(window.sv.cities.evanston, 7.2));
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
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            wilmetteLayer.setMap(this.gMap);

            google.maps.event.addListener(wilmetteLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.wilmetteInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.wilmetteInfo);
                this.wilmetteInfo.setContent(window.getCityInfo(window.sv.cities.wilmette, 7.2));
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
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            glenviewLayer.setMap(this.gMap);

            google.maps.event.addListener(glenviewLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.glenviewInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.glenviewInfo);
                this.glenviewInfo.setContent(window.getCityInfo(window.sv.cities.glenview, 13.8));
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
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            wheelingLayer.setMap(this.gMap);

            google.maps.event.addListener(wheelingLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.wheelingInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.wheelingInfo);
                this.wheelingInfo.setContent(window.getCityInfo(window.sv.cities.wheeling, 8.9));
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
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            nilesLayer.setMap(this.gMap);

            google.maps.event.addListener(nilesLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.nilesInfo = new google.maps.InfoWindow();
                this.infoWindows.push(this.nilesInfo);
                this.nilesInfo.setContent(window.getCityInfo(window.sv.cities.niles, 7.2));
                this.nilesInfo.setPosition(e.latLng);
                this.nilesInfo.open(this.gMap);

            }.bind(this));
        }.bind(this));
    }


    MapsCell.prototype = Object.create(View.prototype);
    MapsCell.prototype.constructor = MapsCell;


    MapsCell.prototype.hideEverything = function () {
        this.allowAnimation = false;
        _closeAllOverlays.call(this);

    }
    MapsCell.prototype.randomPoint = function (x) {
        var maxRandomDisp = .1;

        x = (x << 13) ^ x;
        return 0.01 + maxRandomDisp * ( 1.0 - ( (x * (x * x * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);


    }


    MapsCell.prototype.showYpCompanies = function () {
        var that = this;
        that.allowAnimation = true;

        var baseLat = 42.04,
            baseLong = -87.85;

        _closeAllOverlays.call(this);


        var counter = 100;

        function dropYpCompanies() {
            if (!that.allowAnimation) {
                return;
            }
            counter++;
            var latLng = new google.maps.LatLng(baseLat + that.randomPoint(counter), baseLong + that.randomPoint(counter + 2));
            that.ypMarker = new google.maps.Marker({
                position: latLng,
                icon: 'img/google-map/yp-business-s.png',
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

        for (var i = 1; i < 15; i++) {
            setTimeout(function () {

                dropYpCompanies.call(this);
            }.bind(this), i * 100);
        }
        legendYp.call(this);

    }
    MapsCell.prototype.showSvetPoints = function () {

        this.allowAnimation = true;
        var that = this;
        var baseLat = 42.04,
            baseLong = -87.85;

        _closeAllOverlays.call(this);
        this.mapsLegendCell.show();
        var counter = 0;

        function dropSvetPoints() {

            if (!that.allowAnimation) {
                return;
            }
            counter++;
            var latLng = new google.maps.LatLng(baseLat + that.randomPoint(counter), baseLong + that.randomPoint(counter + 2));
            this.svetMarker = new google.maps.Marker({
                position: latLng,
                icon: 'img/google-map/svet-distribution-s.png',
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

        for (var i = 1; i < 20; i++) {
            setTimeout(function () {

                dropSvetPoints.call(this);
            }.bind(this), i * 100);
        }

    }

    module.exports = MapsCell;
})
;
