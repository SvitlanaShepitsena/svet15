define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var GridLayout = require("famous/views/GridLayout");

    var HeaderView = require('views/HeaderView');

    function PageView() {
        View.apply(this, arguments);

        this.layout = new HeaderFooterLayout({
            headerSize: 50,
            footerSize: 50
        });

        this.header = new HeaderView();
        this.header.pipe(this);
        this.contents = [];
        this.content = new GridLayout({
            dimensions: [1, 2]
        });

        this.content.pipe(this);

        this.contentTop = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#A8FFFF'
            }
        });
        this.contentBottom = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#FAFBCB'
            }
        });
        this.contents.push(this.contentTop);
        this.contents.push(this.contentBottom);
        this.content.sequenceFrom(this.contents);

        /* =Grid*/

        /* =Footer*/
        this.footers = [];
        this.footer = new GridLayout({
            dimensions: [3, 1]
        });
        this.footer.pipe(this);

        this.footerLeft = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#F27649',
                backgroundSize: 'cover'
            }
        })

        this.footerCenter = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#D95829',
                backgroundSize: 'cover'
            }
        })

        this.footerRight = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#F27649',
                backgroundSize: 'cover'
            }
        })
        this.footers.push(this.footerLeft);
        this.footers.push(this.footerCenter);
        this.footers.push(this.footerRight);
        this.footer.sequenceFrom(this.footers);

        this.layout.header.add(this.header);
        this.layout.content.add(this.content);
        this.layout.footer.add(this.footer);

        this._eventInput.pipe(this._eventOutput);

        this.add(this.layout);
    }

    /*******************/

    /*****************/
    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    module.exports = PageView;

})
;
