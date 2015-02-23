define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform = require('famous/core/Transform');
    var EventHandler = require('famous/core/EventHandler');
    var ScrollContainer = require('famous/views/ScrollContainer');
    var Scrollview = require('famous/views/Scrollview');
    var Transitionable = require('famous/transitions/Transitionable');
    var ScrollController = require('flex/ScrollController');
    var FlexScrollView = require('flex/FlexScrollView');

    var Drag = require('famous/physics/forces/Drag');
    /*Require App*/
    var CommonPageCell = require('cviews/content/common/CommonPageCell');
    var HomeCell = require('cviews/content/home/HomeCell');
    var RadioPageCell = require('cviews/content/radio/RadioPageCell');
    var RadioScrollCell = require('cviews/content/radio/RadioScrollCell');

    /*Html*/
    var aboutVideo = require('text!cviews/jade/about/aboutVideo.html');
    var about1 = require('text!cviews/jade/about/about1.html');
    var about2 = require('text!cviews/jade/about/about2.html');
    var about3 = require('text!cviews/jade/about/about3.html');

    var contactus1 = require('text!cviews/jade/contactus/contactus1.html');

    ContentScrollCell.prototype = Object.create(View.prototype);
    ContentScrollCell.prototype.constructor = ContentScrollCell;

    ContentScrollCell.DEFAULT_OPTIONS = {};

    function ContentScrollCell() {
        View.apply(this, arguments);
        /**
         * Assign an event handler to receive an object's input events.
         */
        _init.call(this);
        _createContent.call(this);
        _showNavLinks.call(this);
    }


    function _init() {
        this.centerMod = new Modifier({
            size: [undefined, undefined],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerMod);
    }

    function _showNavLinks() {

        this.iconElements = [];
        this.backTrans = new Transitionable(0);
        this.nextTrans = new Transitionable(0);

        this.backMod = new Modifier({
            size: [50, 50],
            opacity: function () {
                return this.backTrans.get();
            }.bind(this),
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 0, 0)
        });
        this.nextMod = new Modifier({
            size: [50, 50],
            align: [1, 0],
            origin: [1, 0],

            opacity: function () {
                return this.nextTrans.get();
            }.bind(this),
            transform: Transform.translate(18, 0, 0)
        });
        var backSvg = 'M16,30.534c8.027,0,14.534-6.507,14.534-14.534c0-8.027-6.507-14.534-14.534-14.534C7.973,1.466,1.466,7.973,1.466,16C1.466,24.027,7.973,30.534,16,30.534zM18.335,6.276l3.536,3.538l-6.187,6.187l6.187,6.187l-3.536,3.537l-9.723-9.724L18.335,6.276z';
        var nextSvg = 'M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466zM13.665,25.725l-3.536-3.539l6.187-6.187l-6.187-6.187l3.536-3.536l9.724,9.723L13.665,25.725z';

        this.back = new Surface({
            content: _getRaphaelIcon.call(this, backSvg),
            classes: [],
            properties: {
                cursor: 'pointer'
            }
        });

        this.back.on('click', function () {
            this.contents[this.scrollview.getCurrentIndex()].prevView();
        }.bind(this))

        this.next = new Surface({

            content: _getRaphaelIcon.call(this, nextSvg),
            size: [50, 50],
            classes: [],
            properties: {
                cursor: 'pointer'
            }
        });

        this.next.on('click', function () {
            this.contents[this.scrollview.getCurrentIndex()].nextView();
        }.bind(this))
        this.rootNode.add(this.backMod).add(this.back);
        this.rootNode.add(this.nextMod).add(this.next);

    }


    function _getRaphaelIcon(file) {
        var divDaily = document.createElement('div');
        var paper = Raphael(divDaily, 50, 50);
        var element = paper.path(file).attr({fill: window.sv.scheme.sectionColor, stroke: 'none'});
        this.iconElements.push(element);
        return divDaily;
    }

    function _createContent() {

        this.scrollview = new FlexScrollView({
            scrollSync: {
                scale: 0.5
            },
            paginated: true,
            paginationMode: ScrollController.PaginationMode.PAGE,
            paginationEnergyThresshold: 0.011,
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
            scrollDrag: {
                forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC,
                strength: 0.001,
                disabled: false
            }
        });


        this.scrollview.setOptions({
            overscroll: false   // disable overscroll
        });
        this.rootNode.add(this.scrollview);
        this.contents = [];

        this.homeCell = new HomeCell();

        this.aboutUsCell = new CommonPageCell({
            bgColor: 'floralwhite',
            folder: 'about',
            pages: ['aboutVideo','about1', 'about2', 'about3'],
            sync: this.options.sync
        });

        this.radioCell = new RadioPageCell({
            sync: this.options.sync
        });


        this.contactUsCell = new CommonPageCell({
            bgColor: 'floralwhite',
            folder: 'contactus',
            pages: ['contactus1'],
            sync: this.options.sync
        });
        /**
         * Connect each page view to GenericSync
         */
        this.homeCell.pipe(this.options.sync);
        this.aboutUsCell.pipe(this.options.sync);
        this.radioCell.pipe(this.options.sync);
        this.contactUsCell.pipe(this.options.sync);

        this.contents.push(this.homeCell);
        this.contents.push(this.aboutUsCell);
        this.contents.push(this.radioCell);
        this.contents.push(this.contactUsCell);


        this.scrollview.sequenceFrom(this.contents);
        this.scrollview.pipe(this._eventOutput);
        var activePage;
        this.scrollview.on('pagechange', function () {
            activePage = this.scrollview.getCurrentIndex();
            if (activePage === 1) {

                this.backTrans.set(1, {duration: 200});
                this.nextTrans.set(1, {duration: 200});

            } else {

                this.backTrans.set(0, {duration: 200});
                this.nextTrans.set(0, {duration: 200});
            }
        }.bind(this));


        //this.scrollview.goToNextPage();

    };

    ContentScrollCell.prototype.nextPage = function () {
        this.scrollview.goToNextPage();
    }
    ContentScrollCell.prototype.prevPage = function () {
        this.scrollview.goToPreviousPage();
    }

    module.exports = ContentScrollCell;
});
