define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var ScrollContainer = require('famous/views/ScrollContainer');
    var ViewSequence = require('famous/core/ViewSequence');

    var StateModifier = require('famous/modifiers/StateModifier');
    var Scrollview = require('famous/views/ScrollContainer');
    var barChartView = require('views/barChartView');
    var d3 = require('d3/d3');
    console.log(nv);

    var EventHandler = require('famous/core/EventHandler');

    function HomeScroll(sync) {
        this.generalSync = sync;

        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);

        this.eventInput.on('pageChange', function (index) {
            alert(index);
        })

        ScrollContainer.apply(this, arguments);

        _createContent.call(this);

        this.scrollview.setOptions({
            pageSwitchSpeed: 0.2,
            paginated: true,
            friction: 0.005,
            drag: 0.0001,
            edgeGrip: 0.2,
            edgePeriod: 300,
            edgeDamp: 1,
            speedLimit: 1,
            margin: 5330
        })
    }

    HomeScroll.prototype = Object.create(ScrollContainer.prototype);
    HomeScroll.prototype.constructor = HomeScroll;

    HomeScroll.DEFAULT_OPTIONS = {};

    function _createContent() {

        var that = this;
        var genericSync = this.generalSync;

        var homePage = require('text!jade/homePage.html');
        var aboutUsPage = require('text!jade/aboutUsPage.html');
        var demographicsPage = require('text!jade/demographicsPage.html');
        var clientsPage = require('text!jade/clientsPage.html');
        var radioPage = require('text!jade/radioPage.html');
        var contactUsPage = require('text!jade/contactUsPage.html');

        var test = d3.text(demographicsPage);

        this.contents = [];

        this.contentHome = new Surface({
            size: [undefined, undefined],
            content: homePage,
            properties: {
                fontSize: '16px',
                backgroundColor: '#FFE1D0'
            }
        });
        this.contentAbout = new Surface({
            size: [undefined, undefined],
            content: aboutUsPage,
            properties: {
                backgroundColor: '#E6FFEF'
            }
        });
        var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
        var w = 400;
        var h = 400;
        var r = h / 2;
        var color = d3.scale.category20c();

        var data = [{"label": "Russian Speaking Population", "value": 20},
            {"label": "Ukrainian", "value": 50},
            {"label": "Others", "value": 30}];

        var vis = d3.select(svg).data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
        var pie = d3.layout.pie().value(function (d) {
            return d.value;
        });

// declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw
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

// add the text
        arcs.append("svg:text").attr("transform", function (d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";
        }).attr("text-anchor", "middle").text(function (d, i) {
                return data[i].label;
            }
        );

        this.contentDemographics = new Surface({
            size: [undefined, undefined],
            content: svg,
            properties: {
                backgroundColor: '#FFFAE2'
            }
        });
        this.contentClients = new Surface({
            size: [undefined, undefined],
            content: clientsPage,
            properties: {
                backgroundColor: '#E6FFDB'
            }
        });
        this.contentRadio = new Surface({
            size: [undefined, undefined],
            content: radioPage,
            properties: {
                backgroundColor: '#FFF1E9'
            }
        });
        this.contentContact = new Surface({
            size: [undefined, undefined],
            content: contactUsPage,
            properties: {
                backgroundColor: '#FFE1D0'
            }
        });

        this.contentHome.pipe(genericSync);
        this.contentAbout.pipe(genericSync);
        this.contentDemographics.pipe(genericSync);
        this.contentClients.pipe(genericSync);
        this.contentRadio.pipe(genericSync);
        this.contentContact.pipe(genericSync);

        genericSync.on("start", function () {
        });

        genericSync.on("update", function (data) {
            delta = data.delta[1];
            if (delta < 0) {
                that.scrollview.goToNextPage();
            } else {

                that.scrollview.goToPreviousPage();
            }
        });

        genericSync.on("end", function () {

        });

        this.contents.push(this.contentHome);
        this.contents.push(this.contentAbout);
        this.contents.push(this.contentDemographics);
        this.contents.push(this.contentClients);
        this.contents.push(this.contentRadio);
        this.contents.push(this.contentContact);
        this.sequenceFrom(this.contents);

    };

    module.exports = HomeScroll;
});
