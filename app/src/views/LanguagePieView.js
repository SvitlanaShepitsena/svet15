define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var Timer = require('famous/utilities/Timer');
    var EventHandler = require('famous/core/EventHandler');


    function LanguagePieView(genericSync) {
        var that = this;
        View.apply(this, arguments);

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        var svgLanguage = _createLanguageSvg();
        var flex = new FlexibleLayout({
            ratios: [2, 10]
        })
        this.languageModifier = new Modifier({
            size: [500, 300],
            transform: Transform.translate(130, 0, 10)
        });
        this.svgLanguage = new Surface({
            size: [undefined, undefined],
            content: svgLanguage,
            properties: {
                fontSize: '11px',
                zIndex: 10
            }
        });
        this.textLanguage = new Surface({
            size: [undefined, undefined],
            content: '<h2> Language</h2><p>Ukrainian, Lithuanian, Bulgarian, and other Eastern European communities speak Russian, which makes the Russian speaking community the second largest segment of the foreign born US population, which is estimated at 5 million people.</p>',
            properties: {
                fontSize: '11px',
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

    function _createLanguageSvg() {
        var svgLanguage = document.createElementNS(d3.ns.prefix.svg, 'svg');
        var w = 150;
        var h = 150;
        var r = h / 2;
        var color = d3.scale.category20c();
        var data = [{"label": "Russian", "value": 20},
            {"label": "Hispanic", "value": 50},
            {"label": "Others", "value": 30}];
        var vis = d3.select(svgLanguage).data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
        var pie = d3.layout.pie().value(function (d) {
            return d.value;
        });

        var arc = d3.svg.arc().outerRadius(r);

        var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
        arcs.append("svg:path")
            .attr("fill", function (d, i) {
                return color(i);
            })
            .attr("d", function (d) {
                // log the result of the arc generator to show how cool it is :)
                console.log(arc(d));
                return arc(d);
            });

        arcs.append("svg:text").attr("transform", function (d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";
        }).attr("text-anchor", "middle").text(function (d, i) {
                return data[i].label;
            }
        );
        return svgLanguage;
    }

    LanguagePieView.prototype = Object.create(View.prototype);
    LanguagePieView.prototype.constructor = LanguagePieView;


    LanguagePieView.DEFAULT_OPTIONS = {};


    module.exports = LanguagePieView;
});
