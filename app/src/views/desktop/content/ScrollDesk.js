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

    ScrollDesk.prototype = Object.create(View.prototype);
    ScrollDesk.prototype.constructor = ScrollDesk;

    ScrollDesk.DEFAULT_OPTIONS = {};

    function ScrollDesk() {
        View.apply(this, arguments);

        _init.call(this);
        _pages.call(this);
        _scrollHandle.call(this);
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
        var absolutePos = 0;
        var scroll = new ScrollSync({direction: 1});
        this.scrollView.pipe(scroll);



        scroll.on('update', function (data) {
            absolutePos = absolutePos + data.position > 0 ? 0 : absolutePos + data.position;
            console.log(absolutePos);
        })

        var scrollPosition, currentIndex;

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

    module.exports = ScrollDesk;
});
