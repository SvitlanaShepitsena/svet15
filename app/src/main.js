define(['require', 'famous/core/Engine', 'views/cell/AppView', 'views/desktop/DesktopView'], function (require, Engine, AppView, DesktopView) {
    var MOBILEWIDTH = 490;

    var Transform = require('famous/core/Transform');
    var mainContext = Engine.createContext();

    var initialDevice = window.responsive();
    var appView = initialDevice === 'cell' ? new AppView() : new DesktopView();

    mainContext.on('resize', function () {
        var newDevice = window.responsive();
        if (newDevice !== initialDevice) {
            window.location.reload();
        }
    });
    mainContext.add(appView);
});

window.responsive = function responsive() {
    var MOBILEWIDTH = 490;
    var device;
    switch (true) {
        case window.innerWidth <= MOBILEWIDTH:
            device = 'cell';
            break;
        case window.innerWidth > MOBILEWIDTH:
            device = 'desktop';
            break;
    }
    return device;
}
