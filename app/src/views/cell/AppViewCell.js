define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var MouseSync = require('famous/inputs/MouseSync');
    var GenericSync = require('famous/inputs/GenericSync');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');

    var GridLayout = require("famous/views/GridLayout");
    var EventHandler = require('famous/core/EventHandler');

    var MenuViewCell = require('./MenuViewCell');
    var PageViewCell = require('./content/PageViewCell');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    var WallTransition = require('famous/transitions/WallTransition');
    var SnapTransition = require('famous/transitions/SnapTransition');


    var Transitionable = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');


    function AppViewCell() {
        Transitionable.registerMethod('spring', WallTransition);

        this.imgModifier = new StateModifier({
            opacity: 1
        }); this.imgSurface = new ImageSurface({
            size: [undefined, undefined],
            properties: {
                lineHeight: window.innerHeight + "px",
                textAlign: "center",
                backgroundRepeat: "repeat",
                background: "#595153 url('img/bg/pattern-sepia1.jpg')"
            }
        });

        var that = this;
        View.apply(this, arguments);
        this.menuToggle = false;
        this.eventInput = new EventHandler();

        EventHandler.setInputHandler(this, this.eventInput);
        this.menuView = new MenuViewCell({navWidth: this.options.maxOpenPos});
        this.menuView.pipe(this);

        this.pageViewCell = new PageViewCell();
        this.pageViewCellPos = new Transitionable(0);

        this.eventInput.on('navigateTo', function (index) {
            that.pageViewCell.navigateTo(index);
            /*Close navigation menu*/
            that.toggleMenu();
        })

        this.pageModifier = new Modifier();

        this.pageModifier.transformFrom(function () {
            return Transform.translate(this.pageViewCellPos.get(), 0, 0);
        }.bind(this));

        this.pageViewCell.on('menuToggle', this.toggleMenu.bind(this));

        this.add(this.imgModifier).add(this.imgSurface);

        this.add(this.menuView);
        this.add(this.pageModifier).add(this.pageViewCell);

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
            return this.pageViewCellPos.get(0);
        }.bind(this), {direction: GenericSync.DIRECTION_X});

        this.pageViewCell.pipe(this.sync);

        this.sync.on('update', function (data) {
            if (this.pageViewCellPos.get() === 0 && data.position > 0) {
                this.menuView.animateNavItems();
            }

            this.pageViewCellPos.set(Math.min(Math.max(0, data.position), this.options.maxOpenPos));
        }.bind(this));

        this.sync.on('end', (function (data) {
            var velocity = data.velocity;
            var position = this.pageViewCellPos.get();

            if (this.pageViewCellPos.get() > this.options.posThreshold) {
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
            this.menuView.tranparentBg();
            this.slideLeft();
        } else {
            this.slideRight();
            this.menuView.animateNavItems();
        }
        this.menuToggle = !this.menuToggle;
    };

    AppViewCell.prototype.slideLeft = function () {
        this.pageViewCellPos.set(0, this.options.transition, function () {
            this.menuToggle = false;
        }.bind(this));
    };

    AppViewCell.prototype.slideRight = function () {
        this.pageViewCellPos.set(this.options.maxOpenPos, this.options.transition, function () {
            this.menuToggle = true;
        }.bind(this));
    };

    module.exports = AppViewCell;
});
