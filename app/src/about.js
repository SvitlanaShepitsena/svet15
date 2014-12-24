define(function (require, exports, module) {
    'use strict';
    var Engine = require('famous/core/Engine');
    var Transform = require('famous/core/Transform');
    var Surface = require('famous/core/Surface');
    //// create the main context
    var mainContext = Engine.createContext();
    var surface= new Surface({
        size: [undefined, undefined],
        content:'About Us',
        properties: {
            backgroundColor: 'green',
            backgroundSize: 'cover'
        }
    });





    mainContext.add(surface);


});
