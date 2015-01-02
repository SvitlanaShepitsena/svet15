define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var GridLayout = require('famous/views/GridLayout');
    var Timer = require('famous/utilities/Timer');
    var EventHandler = require('famous/core/EventHandler');

    var LanguagePieView = require('views/LanguagePieView');
    var HouseholdView = require('views/HouseholdView');
    var EducationView = require('views/EducationView');
    var EmploymentView = require('views/EmploymentView');


    function DemographicView(genericSync) {
        var that = this;
        View.apply(this, arguments);

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        var demographicsPart1 = require('text!jade/demographicsPage.html');

        this.contentPart1 = new Surface({
            size: [undefined, undefined],
            content: demographicsPart1,
            properties: {
                backgroundColor: '#FFFAE2'
            }
        });
        this.languagePieView = new LanguagePieView(genericSync);
        this.householdView = new HouseholdView(genericSync);
        this.educationView = new EducationView(genericSync);
        this.employmentView = new EmploymentView(genericSync);

        var demographContent = [];
        demographContent.push(this.contentPart1);
        demographContent.push(this.languagePieView);
        demographContent.push(this.householdView);
        demographContent.push(this.educationView);
        demographContent.push(this.employmentView);

        var grid = new GridLayout({
            direction: 1,
            dimensions: [1, 5]
        });
        grid.sequenceFrom(demographContent);

        this.add(grid);

        this.contentPart1.pipe(genericSync);

    }


    DemographicView.prototype = Object.create(View.prototype);
    DemographicView.prototype.constructor = DemographicView;


    DemographicView.DEFAULT_OPTIONS = {};


    module.exports = DemographicView;
});
