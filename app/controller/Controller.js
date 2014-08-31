Ext.define('BDC.controller.Controller', {
    extend: 'Ext.app.Controller',
    uses: ['BDC.lib.Programs'],
    views: [ 'BDC.view.View' ],
    refs: [
        { selector: 'bdc-view', ref: 'BDCView' }
    ],

    init: function () {
        this.control({
            'bdc-view': {
                afterrender: this.onViewAfterRender
            },
            '#resetButton': {
                click: this.onReset
            },
            '#stepButton': {
                click: this.onStep
            },
            '#programOne': {
                click: this.onProgramOne
            },
            '#programTwo': {
                click: this.onProgramTwo
            },
            '#programThree': {
                click: this.onProgramThree
            },
            '#programFour': {
                click: this.onProgramFour
            },
            '#programFive': {
                click: this.onProgramFive
            },
            '#programSix': {
                click: this.onProgramSix
            }
        });
    },

    onViewAfterRender: function (view) {
        view.reset();
    },

    onReset: function () {
        var view = this.getBDCView();
        view.reset();
    },

    onStep: function () {
        var view = this.getBDCView();
        view.step();
    },
    onProgramOne: function () {
        var view = this.getBDCView();
        view.loadProgram(BDC.lib.Programs.PROGRAM_ONE);
    },
    onProgramTwo: function () {
        var view = this.getBDCView();
        view.loadProgram(BDC.lib.Programs.PROGRAM_TWO);
    },
    onProgramThree: function () {
        var view = this.getBDCView();
        view.loadProgram(BDC.lib.Programs.PROGRAM_THREE);
    },
    onProgramFour: function () {
        var view = this.getBDCView();
        view.loadProgram(BDC.lib.Programs.PROGRAM_FOUR);
    },
    onProgramFive: function () {
        var view = this.getBDCView();
        view.loadProgram(BDC.lib.Programs.PROGRAM_FIVE);
    },
    onProgramSix: function () {
        var view = this.getBDCView();
        view.loadProgram(BDC.lib.Programs.PROGRAM_SIX);
    }
});
