define(function (require, exports, module) {
    'use strict';
    var Engine = require('famous/core/Engine');
    var Transform = require('famous/core/Transform');
    //// create the main context
    var mainContext = Engine.createContext();

    var AppView = require('views/AppView');

    require('famous/inputs/FastClick');

    var appView = new AppView();

    mainContext.add(appView);





});
