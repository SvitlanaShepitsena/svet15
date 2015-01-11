define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var ScrollContainer = require('famous/views/ScrollContainer');

    function DeskScroll() {
        ScrollContainer.apply(this, arguments);
        this.scrollContent = [];
        this.surface1 = new Surface({
            size: [undefined, undefined],
            content: "Primary Surface",
            properties: {
                backgroundColor: 'red',
                lineHeight: window.innerHeight + "px",
                textAlign: "center"
            }
        });
        this.surface2 = new Surface({
            size: [undefined, undefined],
            content: "Primary Surface",
            properties: {
                backgroundColor: 'green',
                lineHeight: window.innerHeight + "px",
                textAlign: "center"
            }
        });
       this.scrollContent.push(this.surface1) ;
       this.scrollContent.push(this.surface2) ;
        this.surface1.pipe(this.scrollview);
        this.surface2.pipe(this.scrollview);
        this.scrollview.sequenceFrom(this.scrollContent);
    }


    DeskScroll.prototype = Object.create(ScrollContainer.prototype);
    DeskScroll.prototype.constructor = ScrollContainer;

    DeskScroll.DEFAULT_OPTIONS = {};

    module.exports = DeskScroll;
});
