define(['require', 'famous/core/Engine', 'views/AppView', 'views/desktop/AppView'], function (require, Engine, AppView, DesktopView) {


    var Transform = require('famous/core/Transform');
    var mainContext = Engine.createContext();

    var appView = new AppView();


    mainContext.add(appView);
});
