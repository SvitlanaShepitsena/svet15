define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    var BkImageSurface = require("famousimg/BkImageSurface");
    /*html*/
    var contactDesk = require('text!dviews/jade/contact/contact-desk.html');
    var directionForm = require('text!dviews/jade/contact/direction-form.html');

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

        _addMap.call(this);
        _addContent.call(this);
    }

    function _addContent() {
        this.contentMod = new Modifier({
            size: [280, 180],
            transform: Transform.translate(30, 150, 0)
        });
        this.contentSurf = new Surface({
            content: contactDesk,
            classes: ['panel', 'panel-default'],
            properties: this.options.contentProps

        });
        this.contentSurf.pipe(this._eventOutput);
        this.rootNode.add(this.contentMod).add(this.contentSurf);
    }

    function _addMap() {
        this.officeCoord = {lat: 42.136286, lng: -87.791914};
        this.mapId = 'map-canvas';
        this.mapSurface = new Surface({
            classes: ['mapview'],
            content: '<div id="map-canvas" style="width: 100%; height: 100%;">Test</div>',
            size: [undefined, undefined]
        });

        this.mapSurface.pipe(this._eventOutput);
        this.rootNode.add(this.imgMod).add(this.mapSurface);
    }

    ContactUsDesk.prototype.render = function () {


        if (!this.map) {

            var map;
            var directionsDisplay;
            var directionsService;
            var stepDisplay;

            var elm = document.getElementById(this.mapId);

            if (elm) {
                map = this.map;
                var mapOptions = {
                    center: this.officeCoord,
                    zoom: 12,
                    panControl: false,
                    zoomControl: true,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.SMALL,
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    }

                };

                this.map = new google.maps.Map(elm, mapOptions);

                var svetMarker = new google.maps.Marker({
                    position: this.officeCoord,
                    map: this.map,
                    title: "Svet Office"
                });

                directionsService = new google.maps.DirectionsService();

                // Create a renderer for directions and bind it to the map.
                var rendererOptions = {
                    map: map
                }

                directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

                // Instantiate an info window to hold step text.
                stepDisplay = new google.maps.InfoWindow();
                console.log(directionForm);
                elm.innerHTML = elm.innerHTML + directionForm;

            }

        }
        return this._node.render();
    };

    module.exports = ContactUsDesk;
});
