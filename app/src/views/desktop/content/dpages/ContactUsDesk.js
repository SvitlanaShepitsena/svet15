define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    /*html*/
    var contactDesk = require('text!dviews/jade/contact/contact-desk.html');

    ContactUsDesk.prototype = Object.create(View.prototype);
    ContactUsDesk.prototype.constructor = ContactUsDesk;

    ContactUsDesk.DEFAULT_OPTIONS = {
        viewProps: {
            color: window.sv.scheme.textDark,
            textAlign: 'center',
            boxShadow: '-1px 1px 2px 2px lightgrey',
            background: "#595153 url('img/bg/bg-contact.jpg')"
        }
    };

    function ContactUsDesk() {
        View.apply(this, arguments);

        this.centerModifier = new Modifier({
            size: [undefined, window.sv.sizing.viewHeight],
            align: [0.5, 0.6],
            origin: [0.5, 0.6],
        });
        this.surfaceBg = new Surface({
            content: contactDesk,
            properties: this.options.viewProps
        });

        this.surfaceBg.pipe(this._eventOutput);
        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.surfaceBg);
    }

    module.exports = ContactUsDesk;
});
