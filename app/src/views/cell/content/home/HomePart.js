define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var RenderNode = require('famous/core/RenderNode');
    var Transitionable = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');

    var Flipper = require('famous/views/Flipper');

    function HomePart() {
        View.apply(this, arguments);
        this.on('click', function () {
            this._eventOutput.emit('parts:info',{icon:this.options.icon});
            this.flipper.flip();
        })
        _initTransform.call(this);
        _contentParts.call(this);
        _sectionIcon.call(this);
    }


    HomePart.prototype = Object.create(View.prototype);
    HomePart.prototype.constructor = HomePart;

    HomePart.DEFAULT_OPTIONS = {
        center: [0.5, 0, 5],
        content: null,
        spring: null,
        icon: null,
        period: 0,
        dampingRatio: 0,
        sign: 0,
        size: [undefined, undefined],
        width: window.innerWidth,
        sectionPop: {
            fontSize: '18px',
            cursor:'pointer',
            color: window.sv.scheme.textWhite,
            paddingTop: window.innerWidth / 4 + 'px',
            textAlign: 'center',
            backgroundColor: window.sv.scheme.sectionColor
        }
    };

    function _contentParts() {
        this.surface = new Surface({
            size: this.options.size,
            content: this.options.content,
            properties: this.options.sectionPop
        });
        this.surface.pipe(this._eventOutput);


        this.renderNode.add(this.surface);
    }

    function _sectionIcon() {
        this.sectionIconMod = new StateModifier({
            size: [(window.innerWidth / 2) * .4, (window.innerWidth / 2) * .4],
            align: [0.5, 0.1],
            origin: [0.5, 0],
            transform: Transform.translate(0, 0, 0)
        });
        var imgDivider = 8;
        this.sectionIconSurface = new Surface({
            size: [undefined, undefined],
            content: "<a target='_blank' href='" + this.options.url + "'><img style='width:" + (window.innerWidth / imgDivider) + "px; height: " + (window.innerWidth / imgDivider) + "px' class='home-icon-img' src='img/home-page/icons-color/" + this.options.icon + ".png'/></a>",
            properties: {
                cursor:'pointer',
                textAlign: 'center',
                borderRadius: '100px',
                color: 'red',
                backgroundColor: window.sv.scheme.homeIconColor
            }
        });
        this.sectionIconSurface.pipe(this._eventOutput);

        this.renderNode.add(this.sectionIconMod).add(this.sectionIconSurface);
    }

    function _initTransform() {

            // mainContext.setPerspective(500);


        // this.flipper.flip(); to flip!
        this.spring = {
            method: 'spring',
            period: this.options.period,
            dampingRatio: this.options.dampingRatio
        }
        this.centerModifier = new StateModifier({
            align: this.options.center,
            origin: this.options.center,
            transform: Transform.translate(this.options.sign * (this.options.width / 2), 0, 0)
        });

        this.rootNode = this.add(this.centerModifier);
        this.centerModifier.setTransform(Transform.translate(0, 0, 0), this.spring);

        this.renderNode = new RenderNode();
        this.flipper = new Flipper();
        this.backInfo = new Surface({
            size: [undefined, undefined],
            content: 'More Info',
            classes: [],
            properties: {
                cursor:'pointer',
                color: 'white',
                textAlign: 'center',
                backgroundColor: '#FA5C4F'
            }
        });
        this.backInfo.pipe(this._eventOutput);
        this.flipper.setFront(this.renderNode);
        this.flipper.setBack(this.backInfo);

        this.rootNode.add(this.flipper);
    }

    module.exports = HomePart;
});
