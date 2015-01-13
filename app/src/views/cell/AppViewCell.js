define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var MouseSync = require('famous/inputs/MouseSync');
    var GenericSync = require('famous/inputs/GenericSync');
    var Transitionable = require('famous/transitions/Transitionable');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');

    var GridLayout = require("famous/views/GridLayout");
    var EventHandler = require('famous/core/EventHandler');

    var MenuViewCell = require('./MenuViewCell');
    var PageViewCell = require('./content/PageViewCell');


    function AppViewCell() {


        var that = this;
        View.apply(this, arguments);
        this.menuToggle = false;
        this.eventInput = new EventHandler();

        EventHandler.setInputHandler(this, this.eventInput);
        this.menuView = new MenuViewCell({navWidth: this.options.maxOpenPos});
        this.menuView.pipe(this);

        this.pageView = new PageViewCell();
        this.pageViewPos = new Transitionable(0);

        this.eventInput.on('navigateTo', function (index) {
            that.pageView.navigateTo(index);
            /*Close navigation menu*/
            that.toggleMenu();
        })

        this.pageModifier = new Modifier();

        this.pageModifier.transformFrom(function () {
            return Transform.translate(this.pageViewPos.get(), 0, 0);
        }.bind(this));

        this.pageView.on('menuToggle', this.toggleMenu.bind(this));

        this.add(this.menuView);
        this.add(this.pageModifier).add(this.pageView);

        _handleTouch.call(this);
    }

    AppViewCell.prototype = Object.create(View.prototype);
    AppViewCell.prototype.constructor = AppViewCell;

    AppViewCell.DEFAULT_OPTIONS = {
        posThreshold: 95.5,
        velThreshold: 0.75,
        transition: {
            duration: 300,
            curve: 'easeOut'
        },
        maxOpenPos: window.innerWidth / 2
    };

    function _handleTouch() {
        GenericSync.register(MouseSync);
        this.sync = new GenericSync(function () {
            return this.pageViewPos.get(0);
        }.bind(this), {direction: GenericSync.DIRECTION_X});

        this.pageView.pipe(this.sync);

        this.sync.on('update', function (data) {
            if (this.pageViewPos.get() === 0 && data.position > 0) {
                this.menuView.animateNavItems();
            }

            this.pageViewPos.set(Math.min(Math.max(0, data.position), this.options.maxOpenPos));
        }.bind(this));

        this.sync.on('end', (function (data) {
            var velocity = data.velocity;
            var position = this.pageViewPos.get();

            if (this.pageViewPos.get() > this.options.posThreshold) {
                if (velocity < -this.options.velThreshold) {
                    this.slideLeft();
                } else {
                    this.slideRight();
                }
            } else {
                if (velocity > this.options.velThreshold) {
                    this.slideRight();
                } else {
                    this.slideLeft();
                }
            }
        }).bind(this));
    }

    AppViewCell.prototype.toggleMenu = function () {
        if (this.menuToggle) {
            this.slideLeft();
        } else {
            this.slideRight();
            this.menuView.animateNavItems();
        }
        this.menuToggle = !this.menuToggle;
    };

    AppViewCell.prototype.slideLeft = function () {
        this.pageViewPos.set(0, this.options.transition, function () {
            this.menuToggle = false;
        }.bind(this));
    };

    AppViewCell.prototype.slideRight = function () {
        this.pageViewPos.set(this.options.maxOpenPos, this.options.transition, function () {
            this.menuToggle = true;
        }.bind(this));
    };

    module.exports = AppViewCell;
});
