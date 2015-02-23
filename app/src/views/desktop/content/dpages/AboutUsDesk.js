define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var Transitionable = require('famous/transitions/Transitionable');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var VideoSurface = require('famous/surfaces/VideoSurface');

    var BkImageSurface = require("famousimg/BkImageSurface");
    /*html*/
    var aboutDesk = require('text!dviews/jade/about/aboutUsDesk.html');

    AboutUsDesk.prototype = Object.create(View.prototype);
    AboutUsDesk.prototype.constructor = AboutUsDesk;

    AboutUsDesk.DEFAULT_OPTIONS = {
        viewProps: {
            boxShadow: window.sv.scheme.boxShadow,
            backgroundColor: window.sv.scheme.textWhite
        },
        contentProps: {
            paddingTop: '50px',
            lineHeight: '1.7em',
            textAlign: 'justify',
            color: window.sv.scheme.textDark
        }
    };

    function AboutUsDesk() {
        View.apply(this, arguments);

        this.viwMod = new Modifier({
            //size: [undefined, window.sv.sizing.viewHeight]
        });
        this.bgSurf = new Surface({
            properties: this.options.viewProps
        });
        this.bgSurf.pipe(this._eventOutput);
        this.rootNode = this.add(this.viwMod);
        this.rootNode.add(this.bgSurf);

        _addHeader.call(this);
        _svetVideo.call(this);
        _addContent.call(this);
    }

    function _addContent() {
        this.contentMod = new Modifier({
            size: [undefined, window.innerHeight/1.7],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 450, 0)
        });
        this.contentSurf = new Surface({
            content: aboutDesk
        });

        this.contentSurf.pipe(this._eventOutput);
        this.rootNode.add(this.contentMod).add(this.contentSurf);
    }

    function _svetVideo() {
        this.svetVideoMod = new Modifier({
            size: [560, 315],
            align: [0.5, 0],
            origin: [0.5, 0],
            transform: Transform.translate(0, 140, 0)
        });
        this.svetVideoSurf = new Surface({
            content: '<div class="svetVideoWrapper">' +
            '<iframe width="560" height="315" src="https://www.youtube.com/embed/fuVyrMp3BpI" frameborder="0" allowfullscreen></iframe>' +
            '</div>'
        });

        this.svetVideoSurf.pipe(this._eventOutput);
        this.rootNode.add(this.svetVideoMod).add(this.svetVideoSurf);
    }

    function _addHeader() {
        this.aboutContMod = new Modifier({
            size: [undefined, undefined],
            align: [0.5, 0],
            origin: [0.5, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.aboutContSurf = new Surface({
            content: '<h1 class="h1-desk text-center">SVET International Publishing House</h1>',
            properties: this.options.contentProps
        });

        this.aboutContSurf.pipe(this._eventOutput);
        this.rootNode.add(this.aboutContMod).add(this.aboutContSurf);
    };

    module.exports = AboutUsDesk;
});
