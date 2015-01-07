define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var Timer = require('famous/utilities/Timer');
    var EventHandler = require('famous/core/EventHandler');

    var Transitionable = require('famous/transitions/Transitionable');


    function LanguagePieView(genericSync) {
        var that = this;
        View.apply(this, arguments);

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        var flex = new FlexibleLayout({
            ratios: [6, 6]
        });
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var widthScale = 0.82;
        var svgScale = 0.1;
        this.contentWidth = widthScale * windowWidth;
        this.svgWidth = Math.floor(svgScale * windowWidth);

        var transWidth = new Transitionable([this.contentWidth, 100]);
        window.onresize = function () {
            windowWidth = window.innerWidth;
        }


        this.languageModifier = new Modifier({
            size: transWidth.get(),
            transform: Transform.translate(0, 0, 10),
            origin: [0.5, 0],
            align: [0.5, 0]
        });
        this.svgLanguage = new Surface({
            size: [undefined, undefined],
            content: 'svgLanguage',
            properties: {
                fontSize: '11px',
                zIndex: 10
            }
        });

        this.textLanguage = new Surface({
            size: [undefined, undefined],
            content: '<h2> Language</h2><p>Ukrainian, Lithuanian, Bulgarian, and other Eastern European communities speak Russian, which makes the Russian speaking community the second largest segment of the foreign born US population, which is estimated at 5 million people.</p>',
            properties: {
                zIndex: 10
            }
        });
        var languageContent = [];
        languageContent.push(this.svgLanguage);
        languageContent.push(this.textLanguage);
        flex.sequenceFrom(languageContent);

        this.bgColor = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#FFFAE2'
            }

        });
        this.svgLanguage.pipe(genericSync);
        this.add(this.bgColor);
        this.add(this.languageModifier).add(flex);
    }


    LanguagePieView.prototype = Object.create(View.prototype);
    LanguagePieView.prototype.constructor = LanguagePieView;


    LanguagePieView.DEFAULT_OPTIONS = {};


    module.exports = LanguagePieView;
});
