define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var Timer = require('famous/utilities/Timer');
    var EventHandler = require('famous/core/EventHandler');

    var Transitionable = require('famous/transitions/Transitionable');


    function EducationView(genericSync) {
        var that = this;
        View.apply(this, arguments);

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        var flex = new FlexibleLayout({
            ratios: [2, 10]
        });
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var widthScale = 0.82;
        var svgScale = 0.1;
        this.contentWidth = widthScale * windowWidth;
        this.svgWidth = Math.floor(svgScale * windowWidth);
        var svgHousehold = _creageHouseholdSvg(this.svgWidth);

        var transWidth = new Transitionable([this.contentWidth, 100]);
        window.onresize = function () {
            windowWidth = window.innerWidth;
        }


        this.householdModifier = new Modifier({
            size: transWidth.get(),
            transform: Transform.translate(0, 0, 10),
            origin: [0.5, 0],
            align: [0.5, 0]
        });
        this.svgHousehold = new Surface({
            size: [undefined, undefined],
            content: svgHousehold,
            properties: {
                fontSize: '11px',
                zIndex: 10
            }
        });

        this.textHousehold = new Surface({
            size: [undefined, undefined],
            content: '<h3> Age average and Education</h3><ul>' +
            "<li> 63% of the population hold a bachelor's degree or higher. </li>" +
            '<li> 82.3% have a High School Diplomas (compared to 67% for all foreign born population). </li>' +
            '</ul>' +
                //'<p> The inclination of this second largest foreign-born market segment towards higher education and high-paying employment ultimately leads to higher readership. </p><h2> Age average and Education</h2><ul>' +
                //"<li> 63% of the population hold a bachelor's degree or higher. </li>" +
                //'<li> 82.3% have a High School Diplomas (compared to 67% for all foreign born population). </li>' +
                //'</ul>' +
            '<p> The inclination of this second largest foreign-born market segment towards higher education and high-paying employment ultimately leads to higher readership. </p>',
            properties: {
                zIndex: 10
            }
        });

        var householdContent = [];
        householdContent.push(this.svgHousehold);
        householdContent.push(this.textHousehold);
        flex.sequenceFrom(householdContent);

        this.bgColor = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#FFFAE2'
            }

        });
        this.svgHousehold.pipe(genericSync);
        this.add(this.bgColor);
        this.add(this.householdModifier).add(flex);
    }

    function _creageHouseholdSvg(width) {
        var svgHousehold = document.createElementNS(d3.ns.prefix.svg, 'svg');

        var w = width;
        var h = w;
        var r = h / 2;
        var color = d3.scale.category20c();
        var data = [{"label": "Russian", "value": 20},
            {"label": "Hispanic", "value": 50},
            {"label": "Others", "value": 30}];
        var vis = d3.select(svgHousehold).data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
        var pie = d3.layout.pie().value(function (d) {
            return d.value;
        });

        var arc = d3.svg.arc1991().outerRadius(r);

        var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
        arcs.append("svg:path")
            .attr("fill", function (d, i) {
                return color(i);
            })
            .attr("d", function (d) {
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
        return svgHousehold;
    }

    EducationView.prototype = Object.create(View.prototype);
    EducationView.prototype.constructor = EducationView;


    EducationView.DEFAULT_OPTIONS = {};


    module.exports = EducationView;
});

