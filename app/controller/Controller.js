Ext.define('BDC.controller.Controller', {
    extend: 'Ext.app.Controller',
    uses: ['BDC.lib.Programs', 'BDC.lib.Assembler'],
    views: [ 'BDC.view.View' ],
    refs: [
        { selector: 'bdc-view', ref: 'BDCView' }
    ],

    init: function () {
        this.control({
            'bdc-view': {
                afterrender: this.onViewAfterRender
            },
            '#assemblerButton': {
                click: this.onAssembler
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

    onAssembler: function () {
        var assembler = Ext.create('BDC.lib.Assembler');
        var memory, message;
        var view = this.getBDCView();

        var program = "LOADI 0 ; put 0 in accumulator\n" +
            "loop: STORE z ; copy accumulator to z\n" +
            "DEC x ; decrement x\n" +
            "JNO done ; jump ahead if overflow\n" +
            "LOAD z ; copy z to accumulator\n" +
            "ADD y ; add y to accumulator\n" +
            "J loop ; jump back to loop\n" +
            "done: HALT ; finished\n";

        try {
            memory = assembler.assemble(program);
        } catch (e) {
            message = Ext.String.format("Error: {0}, Line: {1}", e.error, e.line_no);
            Ext.Msg.alert(message);
            return;
        }

        view.loadAssembledProgram(memory);
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
