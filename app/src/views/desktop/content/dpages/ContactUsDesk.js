define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    var BkImageSurface = require("famousimg/BkImageSurface");

    var contactDesk = require('text!dviews/jade/contact/contact-desk.html');

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
        this.surfaceBg = new Surface({
            //content: contactDesk,
            properties: this.options.viewProps

        });

        this.surfaceBg.pipe(this._eventOutput);
        this.rootNode = this.add(this.viewMod);
        this.rootNode.add(this.surfaceBg);

        _addImg.call(this);
        _addContent.call(this);
    }

    function _addContent() {
        this.contentMod = new Modifier({
            size: [340, 240],
            align: [0.03, 0.03],
            origin: [0.03, 0.03],
            transform: Transform.translate(0, 0, 0)
        });
        this.contentSurf = new Surface({
            content: contactDesk,
            classes: ['panel', 'panel-default'],
            properties: {
                boxShadow: window.sv.scheme.boxShadow,
                backgroundColor: window.sv.scheme.textWhite,
                paddingLeft: '20px',
                paddingTop: '10px',
                paddingBottom: '15px',
                color: '#393939',
                fontSize: '120%',
                lineHeight: '150%',
                textAlign: 'left'
            }
        });
        this.contentSurf.pipe(this._eventOutput);
        this.rootNode.add(this.contentMod).add(this.contentSurf);
    }

    function _addImg() {
        this.imgMod = new Modifier({
            //size: [window.sv.sizing.contentWidth / 1.3, window.sv.sizing.viewHeight / 1.3],
            size: [undefined, undefined],
            align: [0.5, 0.5],
            origin: [0.5, 0.5]
        });

        this.imageSurface = new BkImageSurface({
            content: 'img/contact/address-map.jpg',
            sizeMode: BkImageSurface.SizeMode.ASPECTFIT,
            positionMode: BkImageSurface.PositionMode.TOP,
            repeatMode: BkImageSurface.RepeatMode.NONE
        });
        this.imageSurface.pipe(this._eventOutput);
        this.rootNode.add(this.imgMod).add(this.imageSurface);
    }

    module.exports = ContactUsDesk;
});
