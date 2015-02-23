define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var Timer = require('famous/utilities/Timer');

    /*App Require*/
    var EventHandler = require('famous/core/EventHandler');
    var NavigationViewCell = require('./NavigationViewCell');

    MenuViewCell.prototype = Object.create(View.prototype);
    MenuViewCell.prototype.constructor = MenuViewCell;

    /*options for nav icon*/
    MenuViewCell.DEFAULT_OPTIONS = {
        navWidth: 191,
        backgroundColor: '#0D0D0D',
        navHeight: 81,
        topOffset: 10,
        navItemOffset: window.innerHeight / 6,
        duration: 400,
        staggerDelay: 35
    };

    function MenuViewCell() {
        View.apply(this, arguments);

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        this.eventInput.on('pageChange', function (index) {
            this.eventOutput.emit('navigateTo', index);
        }.bind(this));

        _init.call(this);
        _createBacking.call(this);
        _createNavigationViews.call(this);
    }


    MenuViewCell.prototype.resetNavItems = function () {
        for (var i = 0; i < this.navModifiers.length; i++) {
            var initX = -this.options.navWidth / 4;
            var initY = this.options.topOffset + this.options.navItemOffset * i + this.options.navHeight * 2;

            this.navModifiers[i].setOpacity(0.0);
            this.navModifiers[i].setTransform(Transform.translate(initX, initY, 0));
        }
        this.backModifier.setOpacity(0);
    };

    MenuViewCell.prototype.tranparentBg = function () {
        this.backModifier.setOpacity(0, {duration: 2000});
    };

    MenuViewCell.prototype.animateNavItems = function () {
        this.resetNavItems();

        for (var i = 0; i < this.navModifiers.length; i++) {
            // use Timer.setTimeout instead of window.setTimeout
            // Time can be found in famous/utilities

            Timer.setTimeout(function (i) {
                var yOffset = this.options.topOffset + this.options.navItemOffset * i;

                this.navModifiers[i].setOpacity(1, {duration: this.options.duration, curve: 'easeOut'});
                this.navModifiers[i].setTransform(
                    Transform.translate(0, yOffset, 0),
                    {duration: this.options.duration, curve: 'easeOut'});
            }.bind(this, i), i * this.options.staggerDelay);
        }

        this.backModifier.setOpacity(1);
    };

    function _createBacking() {
        var that = this;
        this.backSurface = new Surface({
            size: [window.innerWidth / 2, this.options.height],
            properties: {
                backgroundColor: this.options.backgroundColor
            }
        });
        this.rootNode.add(this.backSurface);
    }

    function _createNavigationViews() {
        this.navModifiers = [];

        var navData = [
            {iconUrl: 'img/nav-icons/home.png'},
            {iconUrl: 'img/nav-icons/about-us.png'},
            //{iconUrl: 'img/nav-icons/demographics.png'},
            //{iconUrl: 'img/nav-icons/clients.png'},
            {iconUrl: 'img/nav-icons/radio.png'},
            {iconUrl: 'img/nav-icons/contact-us.png'},
        ];

        for (var i = 0; i < navData.length; i++) {
            this.navView = new NavigationViewCell({
                width: this.options.navWidth,
                height: this.options.navHeight,
                iconUrl: navData[i].iconUrl,
                index: i
            });
            this.navView.pipe(this);

            var yOffset = this.options.topOffset + this.options.navItemOffset * i;

            var navModifier = new Modifier({
                transform: Transform.translate(0, yOffset, 0)
            });

            this.navModifiers.push(navModifier);
            this.rootNode.add(navModifier).add(this.navView);
        }
    }

    function _init() {
        this.backModifier = new StateModifier({
            opacity: 0
        });
        this.rootNode = this.add(this.backModifier);
    }

    module.exports = MenuViewCell;
});
