define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    var ContainerSurface = require("famous/surfaces/ContainerSurface");


    var RadioProgram = require('dviews/content/radio/RadioProgram');

    var FlexScrollView = require('flex/FlexScrollView');

    function RadioScrollDesk() {
        View.apply(this, arguments);
        this.iconElements = [];
        _init.call(this);
        _scrollRadio.call(this);
        _buttonsNav.call(this);
    }

    function _init() {
        this.centerMod = new Modifier({});
        this.rootNode = this.add(this.centerMod);
    }

    function _getRaphaelRadioIcon(file) {
        var divPlayerNav = document.createElement('div');
        var paper = Raphael(divPlayerNav, 40, 50);
        var element = paper.path(file).attr({
            fill: 'floralwhite',
            strokeLinejoin: 'round',
            strokeMiterlimit: '3',
            opacity: '.5',
            strokeOpacity: '.5'
        });
        element.transform('t5 15, s2');
        this.iconElements.push(element);
        return divPlayerNav;
    }

    function _buttonsNav() {
        var navBackIcon = 'M21.871,9.814 15.684,16.001 21.871,22.188 18.335,25.725 8.612,16.001 18.335,6.276z'
        var navForwardIcon = 'M10.129,22.186 16.316,15.999 10.129,9.812 13.665,6.276 23.389,15.999 13.665,25.725z'

        this.navBackMod = new Modifier({
            size: [50, 70],
            align: [0, 0.5],
            origin: [0, 0.5]
        });
        this.navBackSurf = new Surface({
            content: _getRaphaelRadioIcon.call(this, navBackIcon),
            properties: {
                cursor: 'pointer'
            }
        });
        this.navForwardMod = new Modifier({
            size: [50, 70],
            align: [1, 0.5],
            origin: [1, 0.5]
        });
        this.navForwardSurf = new Surface({
            content: _getRaphaelRadioIcon.call(this, navForwardIcon),
            properties: {
                cursor: 'pointer'
            }
        });

        this.navBackSurf.on('click', function () {
            this.scrollview.goToNextPage();
        }.bind(this))

        this.navForwardSurf.on('click', function () {
            this.scrollview.goToPreviousPage();
        }.bind(this))

        this.rootNode.add(this.navForwardMod).add(this.navForwardSurf);
        this.rootNode.add(this.navBackMod).add(this.navBackSurf);
    }

    function _scrollRadio() {
        var container = new ContainerSurface({
            size: [500, 400],
            properties: {
                overflow: 'visible',
                perspective: '1000px'
            }
        });
        var surfaces = [];
        this.scrollview = new FlexScrollView({
            //visibleItemThresshold: 0.5, // by default, when an item is 50% visible, it is considered visible by `getFirstVisibleItem`
            direction: 0,
            paginated: true,
            layoutAll: true       // set to true is you want all renderables layed out/rendered
        });
        container.add(this.scrollview);
        this.scrollview.sequenceFrom(surfaces);

        var n = 1;

        var dates = ['01.04.2015', '01.11.2015', '01.18.2015', '01.25.2015'];

        for (var i = 4; i < 30; i += 7) {
            var programSurface = new RadioProgram({
                mp3: '01' + i + '.mp3',
                bg: window.sv.scheme.playerBg,
                opacity: n % 2 === 0 ? '.8' : '.7',
                date: '<i class="fa fa-headphones"></i>' + dates[n - 1]
            });
            n++;
            programSurface.pipe(this.scrollview);
            programSurface.pipe(this._eventOutput);
            surfaces.push(programSurface);
        }

        this.rootNode.add(container);
        this.scrollview.goToLastPage();
        this.perspectiveStep = 50;

        this.scrollview.on('pagechange', function () {
            var activePage = this.scrollview.getCurrentIndex();
            for (var i = 0; i < surfaces.length; i++) {
                var program = surfaces[i];
                try {
                    program.setPerspective(-Math.abs(activePage - i) * this.perspectiveStep);

                } catch (e) {

                }
            }
        }.bind(this));
    }


    RadioScrollDesk.prototype = Object.create(View.prototype);
    RadioScrollDesk.prototype.constructor = RadioScrollDesk;

    RadioScrollDesk.DEFAULT_OPTIONS = {};

    module.exports = RadioScrollDesk;
});
