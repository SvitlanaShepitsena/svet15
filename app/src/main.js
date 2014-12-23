/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');

    // create the main context
    var mainContext = Engine.createContext();

    var AppView = require('views/AppView');
    require('famous/inputs/FastClick');


    var appView = new AppView();

    mainContext.add(appView);
    // your app here
});
