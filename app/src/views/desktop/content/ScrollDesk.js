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
    var Timer = require('famous/utilities/Timer');
    /*App Require*/
    var HomeDesk = require('dviews/content/home/HomeDesk');
    var AboutUsDesk = require('dviews/content/dpages/AboutUsDesk');
    var RadioDesk = require('dviews/content/dpages/RadioDesk');
    var ContactUsDesk = require('dviews/content/dpages/ContactUsDesk');

    ScrollDesk.prototype = Object.create(View.prototype);
    ScrollDesk.prototype.constructor = ScrollDesk;

    ScrollDesk.DEFAULT_OPTIONS = {};

    function ScrollDesk() {
        this.mapIconLimit = 680;
        this.mapIconShown = false;

        this.shift = window.innerHeight;
        //this.initScrollPos = -3400;
        this.initScrollPos = 0;

        this.maxScrollPos = 8 / (window.innerHeight / this.shift);
        this.dir;
        this.containerTrans = new Transitionable(this.initScrollPos);


        View.apply(this, arguments);
        _init.call(this);

        _content.call(this);
        _handleScroll.call(this);
        _handleTilesClick.call(this);
        //this._eventOutput.emit('decrease:header');
        //this.headerFull = false;
        this.goToPage(3);

    }

    function _handleTilesClick() {
        this.homeDesk.on('navigateTo:radio', function () {
            this.goToPage.call(this, 2);
        }.bind(this))
    }

    function _init() {
        this.centerModifier = new Modifier({
            size: [undefined, undefined],
            transform: function () {
                return Transform.translate(0, this.containerTrans.get(), 0);
            }.bind(this)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    function _restrict(pos) {
        var maxPos = this.radioShift;

        // Does not allow modifier to move surfaces below 1st and higher than last element
        pos = pos > 0 ? 0 : pos;
        pos = pos < -maxPos ? -maxPos : pos;
        return pos;
    }

    function _startAnimation(absPos) {
        if (absPos > this.HEADERLIMIT && this.headerFull) {
            this._eventOutput.emit('decrease:header');
            this.headerFull = false;
        }
        if (absPos < this.logoBackLimit && !this.headerFull) {
            this._eventOutput.emit('increase:header');
            this.headerFull = true;
        }


        if ((absPos > this.moto1Limit) && this.firstMotoShown) {
            this.homeDesk.tuneToShortView();
            this.firstMotoShown = false;
        }
        if ((absPos < this.moto1Limit) && !this.firstMotoShown) {
            this.homeDesk.tuneToDefaultView();
            this.firstMotoShown = true;
        }
        if ((absPos > this.moto2Limit) && this.secondMotoShown) {
            this.homeDesk.tuneToShortMoto2();
            this.secondMotoShown = false;
        }
        if ((absPos < this.moto2Limit) && !this.secondMotoShown) {
            this.homeDesk.tuneToDefaultMoto2();
            this.secondMotoShown = true;

        }
        if ((absPos > this.mapIconLimit) && !this.mapIconShown) {
            this.homeDesk.showMapIcons();
            this.mapIconShown = true;

        }
        if ((absPos < this.mapIconLimit - 200) && this.mapIconShown) {
            this.homeDesk.hideMapIcons();
            this.mapIconShown = false;

        }
    }

    function _handleScroll() {
        this.syncEnabled = true;
        this.headerFull = true;
        this.options.ctx.pipe(this.sync);
        this.sync.on('start', function (data) {
            this.syncEnabled = true;
        }.bind(this));

        this.HEADERLIMIT = 27;
        this.moto1Limit = 107;
        this.moto2Limit = 175;
        this.logoBackLimit = 40;

        this.firstMotoShown = true;
        this.secondMotoShown = true;


        this.sync.on('update', function (data) {
            var initPos = this.containerTrans.get();
            this.normCoef = data.velocity > 7 ? 5 : 3;
            var velocityNorm = this.normCoef * Math.log(Math.abs(data.velocity));
            velocityNorm = velocityNorm > 1 ? velocityNorm : 1;
            var shift = Math.floor(data.delta / 3.2) * velocityNorm;
            var finalPos = initPos + 2 * shift;

            finalPos = _restrict.call(this, finalPos);
            this.containerTrans.halt();
            var absPos = Math.abs(initPos);

            _startAnimation.call(this, absPos);
            this.containerTrans.set(finalPos, {duration: 80}, function () {
                _startAnimation.call(this, Math.abs(this.containerTrans.get()))
            }.bind(this));

        }.bind(this));

        this.sync.on('end', function (data) {
            if (data.delta > 0) {
                this.dir = -1;
            } else {
                this.dir = 1;

            }
            var pos = this.containerTrans.get();

            var endState = pos + data.delta;
            endState = _restrict.call(this, endState);

            var duration = Math.abs(pos - endState) * 12;
            if (this.syncEnabled) {

                this.containerTrans.set(endState, {
                    duration: duration, curve: 'linear'
                }, function () {
                    pos = this.containerTrans.get();
                    _startAnimation.call(this, Math.abs(pos));
                }.bind(this));
            }

        }.bind(this));

    }

    function _content() {
        this.surfaces = [];

        GenericSync.register({scroll: ScrollSync});
        this.sync = new GenericSync({
            scroll: {
                direction: 1,
                rails: true,
                scale: 0.3,
                stallTime: 4
            }
        });

        var ctx = this.options.ctx;
        ctx.pipe(this.sync);

        this.container = new ContainerSurface({
            //size: [undefined, window.innerHeight],
            properties: {
                overflow: 'hidden'
            }
        });
        /*=Home Page*/
        this.homeDesk = new HomeDesk({sync: this.sync});
        this.homeDesk.pipe(this.sync);
        this.homeShift = window.innerHeight + 680;
        this.rootNode.add(this.homeDesk);


        /*=About Page*/
        this.aboutMod = new Modifier({
            transform: Transform.translate(0, this.homeShift, 0)
        });
        this.aboutUsDesk = new AboutUsDesk();
        this.aboutUsDesk.pipe(this.sync);
        this.aboutShift = this.homeShift + window.innerHeight;
        this.rootNode.add(this.aboutMod).add(this.aboutUsDesk);


        /*=Radio Page*/
        this.radioMod = new Modifier({
            transform: Transform.translate(0, this.aboutShift, 0)
        });
        this.radioDesk = new RadioDesk();
        this.radioDesk.pipe(this.sync);
        this.radioShift = this.aboutShift + window.innerHeight;
        this.rootNode.add(this.radioMod).add(this.radioDesk);


        /*=Contact Page*/
        this.contactMod = new Modifier({
            transform: Transform.translate(0, this.radioShift, 0)
        });
        this.contactDesk = new ContactUsDesk();
        this.contactDesk.pipe(this.sync);
        this.rootNode.add(this.contactMod).add(this.contactDesk);
    }


    ScrollDesk.prototype.goToPage = function (pageIndex) {
        switch (pageIndex) {
            case 0:
                this.containerTrans.set(0, {duration: 500});
                this.homeDesk.tuneToDefaultView();
                this.homeDesk.tuneToDefaultMoto2();

                this._eventOutput.emit('increase:header');
                this.headerFull = true;
                break;

            case 1:
                this.containerTrans.set(-this.homeShift, {duration: 500});

                this._eventOutput.emit('decrease:header');
                this.headerFull = false;
                break;

            case 2:

                this.containerTrans.set(-this.aboutShift, {duration: 500});
                this._eventOutput.emit('decrease:header');
                this.headerFull = false;
                break;

            case 3:
                this.containerTrans.set(-this.radioShift, {duration: 500});
                this._eventOutput.emit('decrease:header');
                this.headerFull = false;
                break;
        }
    };
    module.exports = ScrollDesk;
});
