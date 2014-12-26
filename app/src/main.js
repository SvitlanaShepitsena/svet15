define(['require', 'famous/core/Engine', 'famous/views/ScrollView'], function (require, Engine, ScrollView) {

    var Transform = require('famous/core/Transform');
    var Surface = require('famous/core/Surface');
    var mainContext = Engine.createContext();

    var scrollview = new ScrollView();
    var scrollContents = [];
    scrollview.sequenceFrom(scrollContents);

    var contentHeight = 500;
    var surface1 = new Surface({
        size: [undefined, contentHeight],
        content: 'Surface1',
        properties: {
            backgroundColor: 'red'
        }
    });
    surface1.pipe(scrollview);

    var surface2 = new Surface({
        size: [undefined, contentHeight],
        content: 'Surface 1',
        properties: {
            backgroundColor: 'green'
        }
    });
    surface2.pipe(scrollview);

    var surface3 = new Surface({
        size: [undefined, contentHeight],
        content: 'Surface 1',
        properties: {
            backgroundColor: 'yellow'
        }
    });
    surface3.pipe(scrollview);

    var surface4 = new Surface({
        size: [undefined, contentHeight],
        content: 'Surface 4',
        properties: {
            backgroundColor: 'orange'
        }
    });
    surface4.pipe(scrollview);

    scrollContents.push(surface1);
    scrollContents.push(surface2);
    scrollContents.push(surface3);
    scrollContents.push(surface4);

    mainContext.add(scrollview).add(scrollContents);

});
