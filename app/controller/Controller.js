Ext.define('BDC.controller.Controller', {
    extend: 'Ext.app.Controller',
    uses: ['BDC.lib.Programs', 'BDC.lib.AssemblerEditor', 'BDC.lib.Disassembler'],
    views: [ 'BDC.view.View' ],
    refs: [
        { selector: 'bdc-view', ref: 'BDCView' },
        { selector: 'panel[itemId=bdc-assembler]', ref: 'Assembler' },
        { selector: 'panel[itemId=bdc-disassembler]', ref: 'Disassembler' }
    ],

    init: function () {
        this.control({
            'bdc-view': {
                afterrender: this.onViewAfterRender
            },
            '#assemblerButton': {
                click: this.onAssembler
            },
            '#disassemblerButton': {
                click: this.onDisassembler
            },
            '#assembleButton': {
                click: this.onAssemble
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
        BDC.lib.AssemblerEditor.show();
    },

    onDisassembler: function () {
        BDC.lib.Disassembler.show();
    },

    onAssemble: function () {
        var memory, message, editor = this.getAssembler();
        var view = this.getBDCView();

        try {
            memory = editor.assemble();
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
