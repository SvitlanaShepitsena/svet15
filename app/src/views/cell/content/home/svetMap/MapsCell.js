define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var Transitionable = require('famous/transitions/Transitionable');
    var Easing = require('famous/transitions/Easing');

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

    function MapsCell() {
        this.allowAnimation = true;
        View.apply(this, arguments);

        this.opacityLegendSvet = new Transitionable(0);
        this.opacityLegendYp = new Transitionable(0);
        this.geocoder = new google.maps.Geocoder();

        _init.call(this);

        _map.call(this);
    }

    MapsCell.DEFAULT_OPTIONS = {
        colors: {
            buffaloGrove: 'coral',
            highlandpark: '#D98982',
            deerfield: '#EB8986',
            glencoe: '#FFC0A3',
            northbrook: '#9CDBAD',
            glenview: '#EB8986',
            skokie: '#61AEAE',
            vernonHills: '#D4E5FF',
            wheeling: '#B2A5B6',
            wilmette: '#89BF7A',
            niles: 'coral',
            evanston: '#FFBFA3'
        },
        strokeOpacity: '0.5',
        strokeWeight: '2',
        fillOpacity: '0.35'
    };
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
            position: {lat: 42.131767, lng: -87.579624},
            zoomBase: 9,
            zoomScale: 0.3
        });
        this.mapsLegendCell = new MapsLegendCell({
            legendContent: '<p><img src="../../../../../../img/svet-icon.png">  Svet distribution points</p>'
        });
        this.rootNode.add(this.mapLegendSvetMod).add(this.mapsLegendCell);
    }


    function legendYp() {
        this.mapLegendYpMod = new MapModifier({
            mapView: this.mapView,
            position: this.legendPlace,
            zoomBase: 9,
            zoomScale: 0.3
        });

        this.surface = new Surface({
            size: [170, 50],
            content: '<p><img src="../../../../../../img/google-icon.png"> Our current clients </p>',
            properties: {
                color: 'black'
            }
        });
        this.modifier = new Modifier({
            align: [0, 0],
            origin: [0.5, 0.5],
            opacity: function () {
                return this.opacityLegendYp.get();
            }.bind(this)

        });
        this.opacityLegendYp.set(1, {duration: 500, curve: 'easeInOut'});

        this.surface.pipe(this.mapView);
        this.rootNode.add(this.mapLegendYpMod).add(this.modifier).add(this.surface);
    }

    function _map() {
        this.gMap;

        this.northChicagoStart = {lat: 41.011949, lng: -87.709012};
        this.legendPlace = {lat: 42.131767, lng: -87.579624};
        this.northChicagoEnd = {lat: 42.082571, lng: -87.710238};

        this.mapView = new MapView({
            type: MapView.MapType.GOOGLEMAPS,
            mapOptions: {
                zoom: 10,
                center: this.northChicagoStart,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        });
        this.infoWindows = [];
        this.markers = [];

        this.rootNode.add(this.mapView);

        this.mapView.on('load', function () {

            _legendSvet.call(this);
            this.mapView.setPosition(
                this.northChicagoEnd,
                {duration: 500, curve: Easing.outBack}
            );
            this.gMap = this.mapView.getMap();
            /*********************************
             * Here are Svet Statistics by towns
             *********************************/

            /**
             * 1.Buffalo Grove
             */
            var buffaloGroveCoordinates = buffaloGrove.getCoordinates();

            var buffaloGroveLayer = new google.maps.Polygon({
                paths: buffaloGroveCoordinates,
                strokeColor: this.options.colors.buffaloGrove,
                fillColor: this.options.colors.buffaloGrove,
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            buffaloGroveLayer.setMap(this.gMap);

            google.maps.event.addListener(buffaloGroveLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.buffaloGroveInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.buffaloGroveInfo);
                this.buffaloGroveInfo.setContent('<p class="map-info" ><span class="town-name">Buffalo Grove.</span> <span class = "text-info"> 18.7%</span>of Russian speaking customers</p>');
                this.buffaloGroveInfo.setPosition(e.latLng);
                this.buffaloGroveInfo.open(this.gMap);

            }.bind(this));


            /**
             * 2. =Highland Park
             */

            var highlandParkCoordinates = highlandPark.getCoordinates();

            var highlandParkLayer = new google.maps.Polygon({
                paths: highlandParkCoordinates,
                strokeColor: this.options.colors.highlandpark,
                fillColor: this.options.colors.highlandpark,
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            highlandParkLayer.setMap(this.gMap);

            google.maps.event.addListener(highlandParkLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoHighlandPark = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoHighlandPark);
                this.infoHighlandPark.setContent('<p class="map-info"><span class="town-name">Highland Park.</span> <span class = "text-info">18.2% </span> of Russian speaking customers</p>');
                this.infoHighlandPark.setPosition(e.latLng);
                this.infoHighlandPark.open(this.gMap);

            }.bind(this));

            /*Highland Park end*/
            //
            /*Deerfield starts*/

            /**
             * 3. =Deerfield
             */

            var deerfieldCoordinates = deerfield.getCoordinates();
            var deerfieldLayer = new google.maps.Polygon({
                paths: deerfieldCoordinates,
                strokeColor: this.options.colors.deerfield,
                fillColor: this.options.colors.deerfield,
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            deerfieldLayer.setMap(this.gMap);

            google.maps.event.addListener(deerfieldLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoDeerfield = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoDeerfield);
                this.infoDeerfield.setContent('<p class="map-info"><span class="town-name">Deerfield.</span> <span class = "text-info">16.1%</span>  of Russian speaking customers</p>');
                this.infoDeerfield.setPosition(e.latLng);
                this.infoDeerfield.open(this.gMap);

            }.bind(this));


            /**
             * 4. =Glencoe
             */

            var glencoeCoordinates = glencoe.getCoordinates();

            var glencoeLayer = new google.maps.Polygon({
                paths: glencoeCoordinates,
                strokeColor: this.options.colors.glencoe,
                fillColor: this.options.colors.glencoe,
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            glencoeLayer.setMap(this.gMap);

            google.maps.event.addListener(glencoeLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoGlencoe = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoGlencoe);
                this.infoGlencoe.setContent('<p class="map-info"><span class="town-name">Glencoe.</span> <span class = "text-info">14.4%</span> of Russian speaking customers</p>');
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
                strokeColor: this.options.colors.northbrook,
                fillColor: this.options.colors.northbrook,
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            northbrookLayer.setMap(this.gMap);

            google.maps.event.addListener(northbrookLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoNorthbrook = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoNorthbrook);
                this.infoNorthbrook.setContent('<p class="map-info" > <span class="town-name">Northbrook.</span> <span class = "text-info">14.3%</span> of Russian speaking customers</p>');
                this.infoNorthbrook.setPosition(e.latLng);
                this.infoNorthbrook.open(this.gMap);

            }.bind(this));
            /*Northbrook ends*/


            google.maps.event.addListener(glencoeLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoGlencoe = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoGlencoe);
                this.infoGlencoe.setContent('<p class="map-info"><span class="town-name">Glencoe.</span> <span class = "text-info">14.4%</span>  of Russian speaking customers</p>');
                this.infoGlencoe.setPosition(e.latLng);
                this.infoGlencoe.open(this.gMap);

            }.bind(this));

            //
            /*Vernon Hills*/

            var vernonHillsCoordinates = vernonHills.getCoordinates();

            var vernonHillsLayer = new google.maps.Polygon({
                paths: vernonHillsCoordinates,
                strokeColor: this.options.colors.vernonHills,
                fillColor: this.options.colors.vernonHills,
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            vernonHillsLayer.setMap(this.gMap);

            google.maps.event.addListener(vernonHillsLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.vernonHillsInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.vernonHillsInfo);
                this.vernonHillsInfo.setContent('<p class="map-info"><span class="town-name">Vernon Hills.</span> <span class = "text-info">9.1% </span> of Russian speaking customers</p>');
                this.vernonHillsInfo.setPosition(e.latLng);
                this.vernonHillsInfo.open(this.gMap);

            }.bind(this));


            /*Skokie*/
            var skokieCoordinates = skokie.getCoordinates();

            var skokieLayer = new google.maps.Polygon({
                paths: skokieCoordinates,
                title: 'Skokie',
                strokeColor: this.options.colors.skokie,
                fillColor: this.options.colors.skokie,
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            skokieLayer.setMap(this.gMap);


            google.maps.event.addListener(skokieLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.infoSkokie = new google.maps.InfoWindow({});
                this.infoWindows.push(this.infoSkokie);
                this.infoSkokie.setContent('<p class="map-info"><span class="town-name">Skokie.</span> <span class = "text-info">20%</span>  of Russian speaking customers</p>');
                this.infoSkokie.setPosition(e.latLng);
                this.infoSkokie.open(this.gMap);

            }.bind(this));


            /*Evanston*/

            var evanstonCoordinates = evanston.getCoordinates();
            var evanstonLayer = new google.maps.Polygon({
                paths: evanstonCoordinates,
                strokeColor: this.options.colors.evanston,
                fillColor: this.options.colors.evanston,
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity

            });
            evanstonLayer.setMap(this.gMap);
            google.maps.event.addListener(evanstonLayer, 'click', function (e) {

                _closeAllOverlays.call(this);
                this.evanstonInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.evanstonInfo);
                this.evanstonInfo.setContent('<p class="map-info"><span class="town-name">Evantson.</span> <span class = "text-info">7.2%</span> of Russian speaking customers</p>');
                this.evanstonInfo.setPosition(e.latLng);
                this.evanstonInfo.open(this.gMap);

            }.bind(this));


            /*Wilmette*/
            var wilmetteCoordinates = wilmette.getCoordinates();

            var wilmetteLayer = new google.maps.Polygon({
                paths: wilmetteCoordinates,
                strokeColor: this.options.colors.wilmette,
                fillColor: this.options.colors.wilmette,
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            wilmetteLayer.setMap(this.gMap);

            google.maps.event.addListener(wilmetteLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.wilmetteInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.wilmetteInfo);
                this.wilmetteInfo.setContent('<p class="map-info"><span class="town-name">Wilmette.</span> <span class = "text-info">7.2%</span>  of Russian speaking customers</p>');
                this.wilmetteInfo.setPosition(e.latLng);
                this.wilmetteInfo.open(this.gMap);

            }.bind(this));


            /*Glenview*/
            var glenviewCoordinates = glenview.getCoordinates();
            var glenviewLayer = new google.maps.Polygon({
                paths: glenviewCoordinates,
                strokeColor: this.options.colors.glenview,
                fillColor: this.options.colors.glenview,
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            glenviewLayer.setMap(this.gMap);

            google.maps.event.addListener(glenviewLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.glenviewInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.glenviewInfo);
                this.glenviewInfo.setContent('<p class="map-info"><span class="town-name">Glenview.</span> <span class = "text-info">13.8%</span> of Russian speaking customers</p>');
                this.glenviewInfo.setPosition(e.latLng);
                this.glenviewInfo.open(this.gMap);

            }.bind(this));


            /*Wheeling*/
            var wheelingCoordinates = wheeling.getCoordinates();

            var wheelingLayer = new google.maps.Polygon({
                paths: wheelingCoordinates,
                strokeColor: this.options.colors.wheeling,
                fillColor: this.options.colors.wheeling,
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            wheelingLayer.setMap(this.gMap);

            google.maps.event.addListener(wheelingLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.wheelingInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.wheelingInfo);
                this.wheelingInfo.setContent('<p class="map-info"><span class="town-name">Wheeling.</span> <span class = "text-info">8.9%</span>  of Russian speaking customers</p>');
                this.wheelingInfo.setPosition(e.latLng);
                this.wheelingInfo.open(this.gMap);

            }.bind(this));


            /*Niles*/
            var nilesCoordinates = niles.getCoordinates();

            var nilesLayer = new google.maps.Polygon({
                paths: nilesCoordinates,
                strokeColor: this.options.colors.niles,
                fillColor: this.options.colors.niles,
                strokeOpacity: this.options.strokeOpacity,
                strokeWeight: this.options.strokeWeight,
                fillOpacity: this.options.fillOpacity
            });
            nilesLayer.setMap(this.gMap);
            google.maps.event.addListener(nilesLayer, 'click', function (e) {
                _closeAllOverlays.call(this);
                this.nilesInfo = new google.maps.InfoWindow({});
                this.infoWindows.push(this.nilesInfo);
                this.nilesInfo.setContent('<p class="map-info"><span class="town-name">Niles.</span> <span class = "text-info">7.2%</span>  of Russian speaking customers</p>');
                this.nilesInfo.setPosition(e.latLng);
                this.nilesInfo.open(this.gMap);

            }.bind(this));


            //_difier.call(this);
        }.bind(this));
    }

    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 101)
        });
        this.rootNode = this.add(this.centerModifier);
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

        for (var i = 1; i < 20; i++) {
            setTimeout(function () {

                dropSvetPoints.call(this);
            }.bind(this), i * 100);
        }

    }

    module.exports = MapsCell;
})
;
