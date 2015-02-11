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
    var ContactMap = require('dviews/content/contact/ContactMap');
    var FlexScrollView = require('flex/FlexScrollView');
    var CollectionLayout = require('flex/layouts/CollectionLayout');
    var StateModifier = require('famous/modifiers/StateModifier');

    ScrollDesk.prototype = Object.create(View.prototype);
    ScrollDesk.prototype.constructor = ScrollDesk;

    ScrollDesk.DEFAULT_OPTIONS = {};

    function ScrollDesk() {
        View.apply(this, arguments);
        _init.call(this);
        _pages.call(this);

    }

    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, 0],
            origin: [0.5, 0],
            transform: Transform.translate(0, 0, 0)
        });

        this.rootNode = this.add(this.centerModifier);
    }


    function _pages() {
        this.scrollView = new FlexScrollView({
            //layout: ListLayout,       // sequential layout, uses width/height from renderable
            direction: 1,       // 0 = X, 1 = Y, undefined = use default from layout
            paginated: false,           // pagination on/off
            alignment: 0,               // 0 = top/left, 1 = bottom/right
            flow: true,                // allow renderables to flow between layouts when not scrolling
            mouseMove: false,           // allow mouse to hold and move the view
            useContainer: false,        // embeds inside a ContainerSurface for clipping and capturing input events
            visibleItemThresshold: 0.5, // by default, when an item is 50% visible, it is considered visible by `getFirstVisibleItem`
            pullToRefreshHeader: undefined, // assign pull-to-refresh renderable here (renderable must have a size)
            leadingScrollView: undefined,
            trailingScrollView: undefined,
            autoPipeEvents: true
        });
        this.rootNode.add(this.scrollView);
        this.elements = ['1', '2', '3', '4'];


        this.surfaces = [];
        this.counter = 0;

        this.homeDesk = new HomeDesk();
        this.contactMap = new ContactMap();
        this.aboutDesk = new AboutUsDesk();
        this.radioDesk = new RadioDesk();


        this.surfaces.push(this.homeDesk);
        this.surfaces.push(this.aboutDesk);
        this.surfaces.push(this.contactMap);
        //this.surfaces.push(this.contactUsDesk);
        //this.surfaces.push(this.radioDesk);


        this.scrollView.sequenceFrom(this.surfaces);


    }

    module.exports = ScrollDesk;
});
