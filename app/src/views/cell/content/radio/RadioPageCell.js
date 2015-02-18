define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    /*Require App*/
    var CommonPageCell = require('cviews/content/common/CommonPageCell');
    var RadioScrollCell = require('cviews/content/radio/RadioScrollCell');
    var radio1 = require('text!cviews/jade/radio/radio1.html');
    var radio = require('text!cviews/jade/radio/radio.html');

    RadioPageCell.prototype = Object.create(View.prototype);
    RadioPageCell.prototype.constructor = RadioPageCell;
    RadioPageCell.DEFAULT_OPTIONS = {};

    function RadioPageCell() {
        View.apply(this, arguments);
        _init.call(this);
        _radioPlayer.call(this);
        _addContent.call(this);
    }

    function _init() {
        this.viewMod = new Modifier({
            size: [undefined, window.innerHeight]
        });
        this.viewBg = new CommonPageCell({
            bgColor: 'floralwhite',
            folder: 'radio',
            pages: ['radio1'],
            sync: this.options.sync
        });

        this.viewBg.pipe(this._eventOutput);

        this.rootNode = this.add(this.viewMod);
        this.rootNode.add(this.viewBg);
    }

    function _addContent() {
        this.contentMod = new Modifier({
            size: [undefined, window.innerHeight / 2.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.contentSurf = new Surface({
            content: radio,
            properties: {
                textAlign: 'center'
            }
        });
        this.contentSurf.pipe(this._eventOutput);
        this.rootNode.add(this.contentMod).add(this.contentSurf);

    }

    function _radioPlayer() {
        this.radioPlayerMod = new Modifier({
            size: [window.innerWidth, window.innerHeight / 2.4],
            align: [0.5, 0.9],
            origin: [0.5, 0.9],
            transform: Transform.translate(0, 0, 0)
        });
        this.radioScrollCell = new RadioScrollCell();
        this.radioScrollCell.pipe(this._eventOutput);
        this.rootNode.add(this.radioPlayerMod).add(this.radioScrollCell);
    }


    module.exports = RadioPageCell;
});
