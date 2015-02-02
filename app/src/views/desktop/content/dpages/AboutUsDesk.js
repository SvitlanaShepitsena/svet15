define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var Transitionable = require('famous/transitions/Transitionable');

    //var aboutDesk = require('text!dviews/jade/about/about-desk.html');
    var aboutDesk = require('text!dviews/jade/about/aboutUsPage.html');

    function AboutUsDesk() {
        View.apply(this, arguments);
        this.contentHeight = window.innerWidth / 2;

        this.centerModifier = new Modifier({
            size: [undefined, window.innerHeight],
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });

        this.surfaceBg = new Surface({
            content: aboutDesk,
            classes: [],
            properties: {
                paddingTop: window.sv.sizing.headerHeight * 1.2 + 'px',
                paddingLeft: '25px',
                paddingRight: '25px',
                color: window.sv.scheme.textDark,
                textAlign: 'center',
                backgroundColor: 'orange'
            }
        });

        this.surfaceBg.pipe(this._eventOutput);
        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.surfaceBg);
        _raphael1994.call(this);
        _raphael1991.call(this);
    }


    function _raphael1991() {

        var div = document.createElement('div');
        var p = Raphael(div, 200, 200);
        var start = 0, end = 20;
        var x = 75, y = 80;
        var arcStart = _getArc(1, end, x, y).path;

        this.arc1991 = p.path(arcStart.path).attr({'stroke-width': 5, 'stroke': window.sv.scheme.sectionColor});
        p.setStart()
        p.text(75, 40, 'Launched YP');
        p.text(75, 50, '1994');
        var set = p.setFinish();
        set.attr({
            'font-size': 20,
            'fill': window.sv.scheme.textDark
        })
        this.raphMod = new Modifier({
            size: [true, undefined],
            align: [0.5, 0],
            origin: [0.5, 0],
            opacity: function () {
                return this.opacityTransitionable.get()
            }.bind(this),
            transform: Transform.translate(450, -250, 0)
        });


        this.raphaelSurface = new Surface({
            size: [undefined, 200],
            content: div,
            classes: [],
            properties: {
                color: 'white',
                cursor: 'pointer',
                textAlign: 'center'
            }
        });

        this.raphaelSurface.pipe(this._eventOutput);
        this.rootNode.add(this.raphMod).add(this.raphaelSurface);
    }

    function _raphael1994() {
        this.opacityTransitionable = new Transitionable(0);

        var div = document.createElement('div');
        var p = Raphael(div, window.innerWidth, 200);
        var start = 0, end = 20;
        var x = 75, y = 80;
        var arcStart = _getArc(1, end, x, y).path;

        this.arc1994 = p.path(arcStart.path).attr({'stroke-width': 5, 'stroke': window.sv.scheme.sectionColor});
        p.setStart()
        p.text(75, 40, 'Started');
        p.text(75, 50, '1991');
        var set = p.setFinish();
        set.attr({
            'font-size': 20,
            'fill': window.sv.scheme.textDark
        })

        this.raphMod94 = new Modifier({
            // proportions: [.5, .25],
            align: [0.5, 0],
            origin: [0.5, 0],
            opacity: function () {
                return this.opacityTransitionable.get()
            }.bind(this),
            transform: Transform.translate(850, -250, 0)
        });


        this.raphaelSurface94 = new Surface({
            size: [undefined, 200],
            content: div,
            classes: [],
            properties: {
                color: 'white',
                cursor: 'pointer',
                textAlign: 'center'
            }
        });
        this.rootNode.add(this.raphMod94).add(this.raphaelSurface94);
        this.raphaelSurface94.pipe(this._eventOutput);
    }

    function animateOn() {

        var interval = 50;
        var arcEnd;
        var start = 0, end = 30;
        var x = 75, y = 80;

        var timer = setInterval(function () {

            start++;
            arcEnd = _getArc(start, end, x, y).path;
            this.arc1991.animate({path: arcEnd}, interval);
            this.arc1994.animate({path: arcEnd}, interval);

            if (start === end) {
                clearInterval(timer);
            }
        }.bind(this), interval);

    }

    function animateOff() {

        var interval = 20;
        var arcEnd;
        var start = 20, end = 20;
        var x = 75, y = 80;

        var timer = setInterval(function () {

            start--;
            arcEnd = _getArc(start, end, x, y).path;
            this.arc1991.animate({path: arcEnd}, interval)
            this.arc1994.animate({path: arcEnd}, interval)

            if (start === 0) {
                clearInterval(timer);
            }
        }.bind(this), interval);

    }

    function _getArc(value, total, startX, startY) {
        startX = startX || 75;
        startY = startY || 75;

        var R = 66;
        var handle;
        var current = 0;
        var timeOut = 30;
        var threshold = timeOut * (80 / 100);
        var color = "rgba(153, 153, 153, .25)";


        var alpha = 360 / total * value,
            a = (90 - alpha) * Math.PI / 180,
            x = startX + R * Math.cos(a),
            y = startY - R * Math.sin(a),
            path;
        if (total == value) {
            path = [
                ["M", startX, startY - R],
                ["A", R, R, 0, 1, 1, 74.99, startY - R]
            ];
        } else {
            path = [
                ["M", startX, startY - R],
                ["A", R, R, 0, +(alpha > 180), 1, x, y]
            ];
        }
        return {path: path, stroke: 'green', 'stroke-width': 15};
    };

    AboutUsDesk.prototype = Object.create(View.prototype);
    AboutUsDesk.prototype.constructor = AboutUsDesk;

    AboutUsDesk.prototype.long = function () {
        this.opacityTransitionable.set(0, {duration: 300})
        animateOff.call(this);
    }
    AboutUsDesk.prototype.short = function () {
        this.opacityTransitionable.set(1, {duration: 300})
        animateOn.call(this);

    }

    AboutUsDesk.DEFAULT_OPTIONS = {};

    module.exports = AboutUsDesk;
});
