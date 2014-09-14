Ext.define('BDC.controller.Controller', {
    extend: 'Ext.app.Controller',
    uses: ['BDC.lib.Programs', 'BDC.lib.AssemblerEditor', 'BDC.lib.Disassembler'],
    stores: [ 'Machine', 'Memory' ],
    views: [ 'BDC.view.View' ],
    refs: [
        { selector: 'bdc-view', ref: 'BDCView' },
        { selector: 'panel[itemId=bdc-assembler]', ref: 'Assembler' },
        { selector: 'panel[itemId=bdc-disassembler]', ref: 'Disassembler' }
    ],

    init: function () {
        this.control({
            'bdc-view': {
                afterrender: this.onReset
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

    onLaunch: function () {
        var memory = this.getMemoryStore();
        var machine = this.getMachineStore();

        memory.on('update', this.onUpdateMemory, this);
        machine.on('update', this.onUpdateMachine, this);
        machine.on('dataAccess', this.onDataAccess, this);
        machine.on('indirectAccess', this.onIndirectAccess, this);
    },

    onUpdateMemory: function (store, record, op) {
        if (op === Ext.data.Model.COMMIT) {
            this.getBDCView().updateMemory(record);
        }
    },

    onUpdateMachine: function (store, record, op) {
        if (op === Ext.data.Model.COMMIT) {
            this.getBDCView().updateMachine(record);
        }
    },

    onDataAccess: function (address) {
        this.getBDCView().dataAccess(address);
    },

    onIndirectAccess: function (address) {
        this.getBDCView().indirectAccess(address);
    },

    onAssembler: function () {
        BDC.lib.AssemblerEditor.show();
    },

    onDisassembler: function () {
        BDC.lib.Disassembler.show();
    },

    onAssemble: function () {
        var memory, message, editor = this.getAssembler();
        var machine = this.getMachineStore();

        try {
            memory = editor.assemble();
        } catch (e) {
            message = Ext.String.format("Error: {0}, Line: {1}", e.error, e.line_no);
            Ext.Msg.alert(message);
            return;
        }

        this.onReset();

        machine.loadAssembledProgram(memory);
    },

    onReset: function () {
        var view = this.getBDCView();
        var memory = this.getMemoryStore();
        var machine = this.getMachineStore();

        memory.clear();
        machine.reset();
        view.reset();
    },

    onStep: function () {
        var view = this.getBDCView();
        var machine = this.getMachineStore();

        view.setStep();
        machine.step();
    },

    onProgramOne: function () {
        this.loadProgram(BDC.lib.Programs.PROGRAM_ONE);
    },

    onProgramTwo: function () {
        this.loadProgram(BDC.lib.Programs.PROGRAM_TWO);
    },

    onProgramThree: function () {
        this.loadProgram(BDC.lib.Programs.PROGRAM_THREE);
    },

    onProgramFour: function () {
        this.loadProgram(BDC.lib.Programs.PROGRAM_FOUR);
    },

    onProgramFive: function () {
        this.loadProgram(BDC.lib.Programs.PROGRAM_FIVE);
    },

    onProgramSix: function () {
        this.loadProgram(BDC.lib.Programs.PROGRAM_SIX);
    },

    loadProgram: function (program) {
        var machine = this.getMachineStore();
        this.onReset();
        machine.loadProgram(program);
    }
});
