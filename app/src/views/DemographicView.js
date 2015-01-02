define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var GridLayout = require('famous/views/GridLayout');
    var Timer = require('famous/utilities/Timer');

    var EventHandler = require('famous/core/EventHandler');
    var NavigationView = require('./NavigationView');


    function DemographicView(genericSync) {
        var that = this;
        View.apply(this, arguments);

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        var demographicsPart1 = require('text!jade/demographicsPage.html');
        var svg = _createSvg();
        var demographicsPart2 = require('text!jade/demographicsPart2.html');

        this.contentPart1 = new Surface({
            size: [undefined, undefined],
            content: demographicsPart1,
            properties: {
                backgroundColor: '#FFFAE2'
            }
        });
        this.contentPart2 = new Surface({
            size: [undefined, undefined],
            content: svg,
            properties: {
                backgroundColor: '#FFFAE2'
            }
        });
        this.contentPart3 = new Surface({
            size: [undefined, undefined],
            content: demographicsPart2,
            properties: {
                backgroundColor: '#FFFAE2'
            }
        });
        var demographContent = [];
        demographContent.push(this.contentPart1);
        demographContent.push(this.contentPart2);
        demographContent.push(this.contentPart3);

        var grid = new GridLayout({
            direction: 1,
            dimensions: [1, 3]
        });
        grid.sequenceFrom(demographContent);

        this.add(grid);

        this.contentPart1.pipe(genericSync);
        this.contentPart2.pipe(genericSync);
        this.contentPart3.pipe(genericSync);

    }

    function _createSvg() {
        var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
        var w = 200;
        var h = 200;

        var r = h / 2;
        var color = d3.scale.category20c();

        var data = [{"label": "Russian Speaking Population", "value": 20},
            {"label": "Hispanic", "value": 50},
            {"label": "Others", "value": 30}];

        var vis = d3.select(svg).data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
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
        return svg;

    }

    DemographicView.prototype = Object.create(View.prototype);
    DemographicView.prototype.constructor = DemographicView;

    DemographicView.DEFAULT_OPTIONS = {};

    module.exports = DemographicView;
});
