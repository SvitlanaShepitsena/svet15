define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Transitionable = require('famous/transitions/Transitionable');
    var GenericSync = require("famous/inputs/GenericSync");
    var MouseSync = require('famous/inputs/MouseSync');
    var ScrollSync = require("famous/inputs/ScrollSync");
    var RenderNode = require('famous/core/RenderNode');
    var Easing = require('famous/transitions/Easing');


    function ScrollDesk() {
        this.shift = window.innerHeight;
        this.initScrollPos = 0;
        this.maxScrollPos = 8 / (window.innerHeight / this.shift);
        this.dir;
        this.containerTrans = new Transitionable(this.initScrollPos);


        View.apply(this, arguments);
        _init.call(this);

        _content.call(this);
        _handleScroll.call(this);
    }

    function _handleScroll() {
        //console.log('here');
        this.sync.on('start', function (data) {
        });

        this.sync.on('update', function (data) {
            var pos = this.containerTrans.get();
            pos += data.delta / 2;
            //pos = pos < this.initScrollPos ? this.initScrollPos : pos;
            //pos = pos > this.maxScrollPos ? this.maxScrollPos : pos;
            pos > 0 ? 0 : pos;
            this.containerTrans.set(pos);
        }.bind(this));

        this.sync.on('end', function (data) {
            if (data.delta > 0) {
                this.dir = -1;
            } else {
                this.dir = 1;

            }
            var pos = this.containerTrans.get();

            var threshold = (window.innerHeight / 2);
            var offsetY = Math.floor(pos / threshold);
            offsetY *= threshold;

            var duration = Math.abs(pos - offsetY) * 5;
            this.containerTrans.halt();

            var endState = this.dir * offsetY;
            endState > 0 ? 0 : endState;

            this.containerTrans.set(endState, {
                duration: duration, curve: 'linear'
            });

        }.bind(this));

    }

    function _content() {
        this.surfaces = [];

        GenericSync.register({scroll: ScrollSync});
        this.sync = new GenericSync({scroll: {direction: 1}});

        this.container = new ContainerSurface({
            size: [undefined, window.innerHeight],
            properties: {
                overflow: 'hidden'

            }
        });
        //this.rootNode.add(this.container);
        this.renderNode = new RenderNode();

        for (var i = 0; i < 8; i++) {
            this.modSurf = new Modifier({
                transform: Transform.translate(0, i * this.shift, 0)
            });
            this.surf = new Surface({
                size: [undefined, this.shift],
                properties: {
                    backgroundColor: "hsl(" + (i * 360 / 8) + ", 100%, 50%)",
                    color: "#404040",
                    lineHeight: '200px',
                    textAlign: 'center'
                }
            });
            this.surfaces.push(this.surf);
            this.surf.pipe(this.sync);
            this.renderNode.add(this.modSurf).add(this.surf);
        }
        this.rootNode.add(this.renderNode);


    }

    function _init() {

        this.centerModifier = new Modifier({
            size: [undefined, window.innerHeight],
            transform: function () {
                return Transform.translate(0, this.containerTrans.get(), 0);
            }.bind(this)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    ScrollDesk.prototype = Object.create(View.prototype);
    ScrollDesk.prototype.constructor = ScrollDesk;

    ScrollDesk.DEFAULT_OPTIONS = {};

    //ScrollDesk.prototype.render = function () {
    //    this.spec = [];
    //
    //
    //    this.spec.push({
    //        transform: Transform.translate(0, this.containerTrans.get(), 0),
    //        target: this.renderNode.render()
    //    });
    //
    //    //_updateListView.call(this, this.pageListViewPos.get());
    //
    //    return this.spec;
    //};
    module.exports = ScrollDesk;
});
