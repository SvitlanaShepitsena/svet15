define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    /*Flipper*/
    var RenderNode = require('famous/core/RenderNode');
    var Flipper = require('famous/views/Flipper');

    var RadioScrollCell = require('cviews/content/radio/RadioScrollCell');

    function HomePart() {
        View.apply(this, arguments);

        this.flipperFrontSide = true;
        this.on('click', function () {
            if (this.flipperFrontSide) {
                this._eventOutput.emit('parts:info', {icon: this.options.flipIcon});
            } else {
                this._eventOutput.emit('parts:info', {icon: 'hideAll'});
            }
            this.flipper.flip();
            this.flipperFrontSide = !this.flipperFrontSide;
        });

        this.sectionWidth = window.innerWidth / 2;
        this.sectionIconWidth = (window.innerWidth / 2) * .4;
        this.sectionImgWidth = (window.innerWidth / 2) * .26;
        this.iconImgMargin = (this.sectionIconWidth - this.sectionImgWidth) / 2;

        _initTransform.call(this);
        _contentParts.call(this);
        _sectionIcon.call(this);
    }

    HomePart.prototype = Object.create(View.prototype);
    HomePart.prototype.constructor = HomePart;

    HomePart.DEFAULT_OPTIONS = {
        frontContent: null,
        flipInfo: null,
        flipIcon: null,
        period: 0,
        dampingRatio: 0,
        sign: 0,
        sectionPop: {
            paddingTop: window.innerWidth / 4.15 + 'px',
            color: window.sv.scheme.textWhite,
            backgroundColor: window.sv.scheme.sectionColor,
            cursor: 'pointer',
            textAlign: 'center'
        }
    };

    function _initTransform() {
        this.spring = {
            method: 'spring',
            period: this.options.period,
            dampingRatio: this.options.dampingRatio
        }
        this.centerModifier = new StateModifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(this.options.sign * (this.sectionWidth), 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
        this.centerModifier.setTransform(Transform.translate(0, 0, 0), this.spring);

        this.flipper = new Flipper({
            /*by default direction is 0*/
            direction: 0
        });
        this.flipSurf = new Surface({
            size: [undefined, undefined],
            content: this.options.flipInfo,
            properties: {
                cursor: 'pointer',
                padding: '5px',
                textAlign: 'center',
                color: window.sv.scheme.textDark,
                backgroundColor: window.sv.scheme.textWhite
            }
        });
        this.flipSurf.pipe(this._eventOutput);
        if (this.options.flipIcon === 'radio') {
            this.radioScrollCell = new RadioScrollCell();
            this.radioScrollCell.pipe(this._eventOutput);
            this.flipper.setBack(this.radioScrollCell);

        } else {
            this.flipper.setBack(this.flipSurf);
        }

        this.renderNode = new RenderNode();
        this.flipper.setFront(this.renderNode);

        this.rootNode.add(this.flipper);
    }

    function _contentParts() {
        this.mapSurface = new Surface({
            content: this.options.frontContent,
            properties: this.options.sectionPop
        });
        this.mapSurface.pipe(this._eventOutput);
        this.renderNode.add(this.mapSurface);
    }

    function _sectionIcon() {
        this.sectionIconMod = new StateModifier({
            size: [this.sectionIconWidth, this.sectionIconWidth],
            align: [0.5, 0.1],
            origin: [0.5, 0]
        });

        this.sectionIconSurface = new Surface({
            size: [undefined, undefined],
            content: "<img style='width:" + (this.sectionImgWidth) + "px; height: " + (this.sectionImgWidth) + "px; margin:" + this.iconImgMargin + "px;' src='img/home-page/icons-color/" + this.options.flipIcon + ".png'/>",
            properties: {
                cursor: 'pointer',
                textAlign: 'center',
                borderRadius: this.sectionIconWidth / 2 + 'px',
                backgroundColor: window.sv.scheme.homeIconColor
            }
        });
        this.sectionIconSurface.pipe(this._eventOutput);
        this.renderNode.add(this.sectionIconMod).add(this.sectionIconSurface);
    }


    module.exports = HomePart;
});
