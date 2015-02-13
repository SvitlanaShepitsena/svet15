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
    var TouchSync = require("famous/inputs/TouchSync");
    var RenderNode = require('famous/core/RenderNode');
    var Easing = require('famous/transitions/Easing');
    var Timer = require('famous/utilities/Timer');
    /*Flex Scroll*/
    var FlexScrollView = require('flex/FlexScrollView');
    var ScrollController = require('flex/ScrollController');
    var CollectionLayout = require('flex/layouts/CollectionLayout');
    /*App Require*/
    var HomeDesk = require('dviews/content/home/HomeDesk');
    var AboutUsDesk = require('dviews/content/dpages/AboutUsDesk');
    var RadioDesk = require('dviews/content/dpages/RadioDesk');
    var ContactMap = require('dviews/content/contact/ContactMap');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Engine = require("famous/core/Engine");

    ScrollDesk.prototype = Object.create(View.prototype);
    ScrollDesk.prototype.constructor = ScrollDesk;

    ScrollDesk.DEFAULT_OPTIONS = {};

    function ScrollDesk() {
        View.apply(this, arguments);

        _init.call(this);
        _pages.call(this);
        _handleScroll.call(this);
    }

    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, .5],
            origin: [0.5, .5],
            transform: Transform.translate(0, 0, 0)
        });

        this.rootNode = this.add(this.centerModifier);
    }

    function _scrollHandle() {
        this.scrollView.pipe(scroll);


        scroll.on('update', function (data) {
            absolutePos = absolutePos + data.position > 0 ? 0 : absolutePos + data.position;
        });


    }


    function _handleScroll() {

        GenericSync.register(
            {scroll: ScrollSync},
            {touch: TouchSync}
        );
        this.sync = new GenericSync({
            scroll: {
                direction: 1,
                rails: true,
                scale: 0.3,
                stallTime: 4
            }
        });
        Engine.pipe(this.scrollView);
        this.scrollView.pipe(this.sync);

        this.headerFull = true;
        this.HEADERLIMIT = 27;
        this.moto1Limit = 107;
        this.moto2Limit = 175;
        this.logoBackLimit = 40;

        this.firstMotoShown = true;
        this.secondMotoShown = true;

        var absPos = 0;

        this.sync.on('update', function (data) {

            absPos = absPos + data.position > 0 ? 0 : absPos + data.position;

            _startAnimation.call(this, Math.abs(absPos));
        }.bind(this));

        //this.sync.on('end', function (data) {
        //    if (data.delta > 0) {
        //        this.dir = -1;
        //    } else {
        //        this.dir = 1;
        //
        //    }
        //    var pos = this.containerTrans.get();
        //
        //    var endState = pos + data.delta;
        //    endState = _restrict.call(this, endState);
        //
        //    var duration = Math.abs(pos - endState) * 12;
        //    if (this.syncEnabled) {
        //
        //        this.containerTrans.set(endState, {
        //            duration: duration, curve: 'linear'
        //        }, function () {
        //            pos = this.containerTrans.get();
        //            _startAnimation.call(this, Math.abs(pos));
        //        }.bind(this));
        //    }
        //
        //}.bind(this));

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


    function _pages() {
        this.scrollView = new FlexScrollView({
            layoutOptions: {
                spacing: window.sv.sizing.headerHeight / 2.5
            },

            scrollSync: {
                scale: 0.1
            },
            paginated: false,
            paginationMode: ScrollController.PaginationMode.PAGE,
            paginationEnergyThresshold: 0.01,
            direction: 1,       // 0 = X, 1 = Y, undefined = use default from layout
            alignment: 1,               // 0 = top/left, 1 = bottom/right
            flow: true,                // allow renderables to flow between layouts when not scrolling
            mouseMove: false,           // allow mouse to hold and move the view
            useContainer: true,        // embeds inside a ContainerSurface for clipping and capturing input events
            visibleItemThresshold: 0.5, // by default, when an item is 50% visible, it is considered visible by `getFirstVisibleItem`
            pullToRefreshHeader: undefined, // assign pull-to-refresh renderable here (renderable must have a size)
            leadingScrollView: undefined,
            trailingScrollView: undefined,
            autoPipeEvents: true
        });
        this.scrollView.setOptions({
            overscroll: false   // disable overscroll
        });
        Engine.pipe(this.scrollView);
        this.rootNode.add(this.scrollView);

        this.surfaces = [];
        this.homeDesk = new HomeDesk();
        this.contactMap = new ContactMap();
        this.aboutDesk = new AboutUsDesk();
        this.radioDesk = new RadioDesk();

        this.surfaces.push(this.homeDesk);
        this.surfaces.push(this.aboutDesk);
        this.surfaces.push(this.radioDesk);
        this.surfaces.push(this.contactMap);
        //this.surfaces.push(this.contactUsDesk);

        this.scrollView.sequenceFrom(this.surfaces);
    }


    ScrollDesk.prototype.goToPage = function (pageIndex) {
        switch (pageIndex) {
            case 0:
                this.scrollView.goToFirstPage();
                this.homeDesk.tuneToDefaultView();
                this.homeDesk.tuneToDefaultMoto2();

                this._eventOutput.emit('increase:header');
                this.headerFull = true;
                break;

            case 1:

                this.scrollView.goToRenderNode(this.aboutDesk);

                this._eventOutput.emit('decrease:header');
                this.headerFull = false;


                break;

            case 2:
                this.scrollView.goToRenderNode(this.radioDesk);

                this._eventOutput.emit('decrease:header');
                this.headerFull = false;
                break;

            case 3:
                this.scrollView.goToLastPage();
                this._eventOutput.emit('decrease:header');
                this.headerFull = false;
                break;
        }
    };
    module.exports = ScrollDesk;
});
