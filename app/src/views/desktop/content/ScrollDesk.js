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
    var Engine = require("famous/core/Engine");
    /*Flex Scroll*/
    var FlexScrollView = require('flex/FlexScrollView');
    var ScrollController = require('flex/ScrollController');
    var CollectionLayout = require('flex/layouts/CollectionLayout');
    /*App Require*/
    var HomeDesk = require('dviews/content/home/HomeDesk');
    var AboutUsDesk = require('dviews/content/dpages/AboutUsDesk');
    var RadioDesk = require('dviews/content/dpages/RadioDesk');
    var ContactMapDesk = require('dviews/content/contact/ContactMapDesk');
    var StateModifier = require('famous/modifiers/StateModifier');

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
            align: [0.5, 0.5],
            origin: [0.5, 0.5]
        });
        this.rootNode = this.add(this.centerModifier);
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
            },
            touch: 'touch'
        });
        Engine.pipe(this.scrollView);
        this.scrollView.pipe(this.sync);

        this.headerFull = true;
        this.HEADERLIMIT = 37;
        this.moto1Limit = 107;
        this.moto2Limit = 175;
        this.logoBackLimit = 40;

        this.mapIconShown = false;
        this.mapIconLimit = 275;
        this.maxScrollSize = 2900;

        this.firstMotoShown = true;
        this.secondMotoShown = true;
        this.downArrowShown = true;
        var absPos = 0, delta;

        this.scrollView.on('scroll', function (data) {

            delta = data.scrollOffset - data.oldScrollOffset;
            absPos += delta;

            _startAnimation.call(this, Math.abs(absPos));
        }.bind(this));

        this.scrollView.on('scrollend', function (data) {
            absPos = data.target._scroll.groupStart + data.target._scroll.particleValue;
            if (Math.abs(absPos) < this.logoBackLimit && !this.headerFull) {
                this._eventOutput.emit('increase:header');
                this.headerFull = true;
            }
            if (Math.abs(absPos) > this.maxScrollSize && this.downArrowShown) {
                this._eventOutput.emit('hide:downArrow');
                this.downArrowShown = false;
            }
            if (!this.downArrowShown && Math.abs(absPos) < this.maxScrollSize) {
                this._eventOutput.emit('show:downArrow');
                this.downArrowShown = true;
            }
        }.bind(this));


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
            alignment: 0,               // 0 = top/left, 1 = bottom/right
            mouseMove: false,           // allow mouse to hold and move the view
            useContainer: true,        // embeds inside a ContainerSurface for clipping and capturing input events
            visibleItemThresshold: 0.5, // by default, when an item is 50% visible, it is considered visible by `getFirstVisibleItem`
            pullToRefreshHeader: undefined, // assign pull-to-refresh renderable here (renderable must have a size)
            leadingScrollView: undefined,
            trailingScrollView: undefined,
            autoPipeEvents: true,
            layoutAll: true,

            touchMoveDirectionThresshold: undefined, // 0..1
            touchMoveNoVelocityDuration: 100

        });
        this.scrollView.setOptions({
            overscroll: false   // disable overscroll
        });
        Engine.pipe(this.scrollView);
        this.rootNode.add(this.scrollView);

        this.surfaces = [];
        this.homeDesk = new HomeDesk();
        this.aboutDesk = new AboutUsDesk();
        this.radioDesk = new RadioDesk();
        this.contactMap = new ContactMapDesk();

        this.surfaces.push(this.homeDesk);
        this.surfaces.push(this.aboutDesk);
        this.surfaces.push(this.radioDesk);
        this.surfaces.push(this.contactMap);

        this.scrollView.sequenceFrom(this.surfaces);

        function scrollToIconPanel() {
            setTimeout(function () {
                this.scrollView.scroll(-600);
                this.homeDesk.tuneToShortView();
                this.homeDesk.tuneToShortMoto2();
                this.firstMotoShown = true;
                this.homeDesk.showMapIcons();
                this.mapIconShown = true;
                this._eventOutput.emit('decrease:header');
            }.bind(this), 500);
        }

        //scrollToIconPanel.call(this);
    }

    ScrollDesk.prototype.scroll = function (velocity) {
        this.scrollView.scroll(-1);
        this.scrollView.scroll(1);
        this.scrollView.setVelocity(velocity);

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
