define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var ScrollView = require('famous/views/Scrollview');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var GridLayout = require("famous/views/GridLayout");

    var HeaderView = require('views/HeaderView');

    function PageView() {
        View.apply(this, arguments);

        this.layout = new HeaderFooterLayout({
            headerSize: 50,
            footerSize: 50
        });

        /*Header*/
        this.header = new HeaderView();
        this.header.pipe(this);

        /*Content*/
        this.contents = [];
        this.content = new ScrollView();

        this.contentHome = new Surface({
            size: [undefined, undefined],
            content: '<h2><em>SVET Media Group</em> is the Midwest’s first and oldest publishing and advertising company serving the Russian, Ukrainian and Lithuanian communities since 1990.</h2>',
            properties: {
                color: 'black',
                fontSize: '16px',
                backgroundColor: '#FFA47F'
            }
        });
        this.contentAbout = new Surface({
            size: [undefined, undefined],
            content: '<h2>SVET International publishing house</h2>' +
            '<p>From the viewpoint of our partners SVET International Publishing House is a typical "company with the past", which basic philosophy is hinged upon well-taken conservatism, weighed approach and clear calculations. It was not for nothing that all previous outside convulsions and crises bypassed our publishing house. Our meticulous attitude towards entering into deals is completely justified by strict performance of undertaken liabilities and flawless financial stability. </p>',
            properties: {
                backgroundColor: '#FAC883'
            }
        });
        this.contentDemographics = new Surface({
            size: [undefined, undefined],
            content: '<h2>Demographics</h2>' +
            '<p>The Russian - American population in the United States is estimated at nearly 2.9 million people</p>',
            properties: {
                backgroundColor: '#95C79B'
            }
        });
        this.contentClients = new Surface({
            size: [undefined, undefined],
            content: '<h2>Demographics</h2>' +
            '<p>The Russian - American population in the United States is estimated at nearly 2.9 million people</p>',
            properties: {
                backgroundColor: '#FFB1AC'
            }
        });
        this.contentRadio = new Surface({
            size: [undefined, undefined],
            content: '<h2>Radio Program “OSA”</h2>' +
            '<p>Sunday morning talk show with Alex Etman airs every Sunday on 1240 AM radio from 11:00 a.m. to 1:00 p.m.</p>',
            properties: {
                backgroundColor: '#83BFE3'
            }
        });
        this.contentContact = new Surface({
            size: [undefined, undefined],
            content: '<h2>Contact Us</h2>' +
            '<p>Sunday morning talk show with Alex Etman airs every Sunday on 1240 AM radio from 11:00 a.m. to 1:00 p.m.</p>',
            properties: {
                backgroundColor: '#998EBA'
            }
        });
        this.contents.push(this.contentHome);
        this.contents.push(this.contentAbout);
        this.contents.push(this.contentDemographics);
        this.contents.push(this.contentClients);
        this.contents.push(this.contentRadio);
        this.contents.push(this.contentContact);
        this.content.sequenceFrom(this.contents);

        this.contentHome.pipe(this.content);
        this.contentAbout.pipe(this.content);
        this.contentDemographics.pipe(this.content);
        this.contentClients.pipe(this.content);
        this.contentRadio.pipe(this.content);
        this.contentContact.pipe(this.content);

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

        this.layout.content.add(this.content);
        this.layout.header.add(this.header);
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
