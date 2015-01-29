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


    function ScrollDesk() {
        this.containerTrans = new Transitionable(0);


        View.apply(this, arguments);
        _init.call(this);

        _content.call(this);
        _handleScroll.call(this);
    }

    function _handleScroll() {
        this.sync.on('start', function (data) {
            console.log(start);
        });

        this.sync.on('update', function (data) {
            console.log(data);

        });

        this.sync.on('end', function (data) {
            console.log('end');

        });

    }

    function _content() {

        this.sync = new ScrollSync({direction: 1});

        this.container = new ContainerSurface({
            size: [undefined, window.innerHeight],
            properties: {
                overflow: 'hidden'

            }
        });
        this.rootNode.add(this.container);

        this.shift = 300;
        for (var i = 0; i < 8; i++) {
            this.modSurf = new Modifier({
                transform: Transform.translate(0, i * this.shift, 0)
            });
            this.surf = new Surface({
                size: [undefined, 300],
                properties: {
                    backgroundColor: "hsl(" + (i * 360 / 8) + ", 100%, 50%)",
                    color: "#404040",
                    lineHeight: '200px',
                    textAlign: 'center'
                }
            });
            this.surf.pipe(this.sync);
            this.add(this.modSurf).add(this.surf);
        }


    }

    function _init() {

        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: function () {
                return Transform.translate(0, this.containerTrans.get(), 3);
            }.bind(this)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    ScrollDesk.prototype = Object.create(View.prototype);
    ScrollDesk.prototype.constructor = ScrollDesk;

    ScrollDesk.DEFAULT_OPTIONS = {};

    module.exports = ScrollDesk;
});
