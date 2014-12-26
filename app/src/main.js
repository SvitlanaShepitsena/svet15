define(['require', 'famous/core/Engine', 'views/AppView'], function (require, Engine, AppView) {

    var Transform = require('famous/core/Transform');
    var mainContext = Engine.createContext();

    var appView = new AppView();

    mainContext.add(appView);


});
