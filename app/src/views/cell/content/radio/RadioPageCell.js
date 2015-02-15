define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    /*Require App*/
    var CommonPageCell = require('cviews/content/common/CommonPageCell');
    var RadioScrollCell = require('cviews/content/radio/RadioScrollCell');
    var radio1 = require('text!cviews/jade/radio/radio1.html');

    RadioPageCell.prototype = Object.create(View.prototype);
    RadioPageCell.prototype.constructor = RadioPageCell;
    RadioPageCell.DEFAULT_OPTIONS = {};

    function RadioPageCell() {
        View.apply(this, arguments);
        _init.call(this);
        _radioPlayer.call(this);
    }

    function _radioPlayer() {
        this.radioPlayerMod = new Modifier({
            size: [undefined, 300],
            align: [0.5, 0.6],
            origin: [0.5, 0.6],
            transform: Transform.translate(0, 0, 0)
        });
        this.radioScrollCell = new RadioScrollCell();
        this.rootNode.add(this.radioPlayerMod).add(this.radioScrollCell);
    }


    function _init() {
        this.viewMod = new Modifier({});
        this.viewBg = new CommonPageCell({
            bgColor: 'floralwhite',
            folder: 'radio',
            pages: ['radio1'],
            content: RadioPageCell,
            sync: this.options.sync
        });

        this.viewBg.pipe(this._eventOutput);

        this.rootNode = this.add(this.viewMod);
        this.rootNode.add(this.viewBg);
    }


    module.exports = RadioPageCell;
});
