/*
Copyright(c) 2014 Michael Q. Rieck, Thomas A. Rieck
*/
Ext.define('BDC.lib.ButtonsPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.buttons-panel',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    columnWidth: 0.2,
    height: 350,
    title: 'Options',
    padding: '10px',
    items: [
        {
            xtype: 'component',
            flex: 0.5
        },
        {
            xtype: 'button',
            tooltip: { text: 'Step the machine' },
            text: 'STEP',
            focusCls: '',
            id: 'stepButton',
            iconCls: 'step-icon',
            iconAlign: 'top',
            width: '80%',
            flex: 0.6
        },
        {
            xtype: 'component',
            flex: 0.5
        },
        {
            xtype: 'button',
            tooltip: { text: 'Reset the machine' },
            text: 'RESET',
            focusCls: '',
            id: 'resetButton',
            iconCls: 'reset-icon',
            iconAlign: 'top',
            width: '80%',
            flex: 0.6
        },
        {
            xtype: 'component',
            flex: 0.5
        },
        {
            xtype: 'button',
            tooltip: { text: 'Save the machine state' },
            text: 'SAVE',
            disabled: true,
            focusCls: '',
            id: 'saveButton',
            iconCls: 'save-icon',
            iconAlign: 'top',
            width: '80%',
            flex: 0.6
        },
        {
            xtype: 'component',
            flex: 0.10
        },
        {
            xtype: 'button',
            tooltip: { text: 'Load program to the machine' },
            text: 'LOAD',
            focusCls: '',
            id: 'loadButton',
            iconCls: 'load-icon',
            iconAlign: 'top',
            width: '80%',
            flex: 0.6,
            menu: {
                items: [
                    {
                        text: 'Multiply x and y',
                        id: 'programOne',
                        iconCls: 'tape-icon'
                    },
                    {
                        text: 'Divide x by y',
                        id: 'programTwo',
                        iconCls: 'tape-icon'
                    },
                    {
                        text: 'Add numbers from x up to y',
                        id: 'programThree',
                        iconCls: 'tape-icon'
                    },
                    {
                        text: 'Generate Fibonacci numbers',
                        id: 'programFour',
                        iconCls: 'tape-icon'
                    },
                    {
                        text: 'Compute base-2 Logarithm of x',
                        id: 'programFive',
                        iconCls: 'tape-icon'
                    },
                    {
                        text: 'Add data in array',
                        id: 'programSix',
                        iconCls: 'tape-icon'
                    }
                ]
            }
        },
        {
            xtype: 'component',
            flex: 1
        }
    ]
});

Ext.define('BDC.lib.MemoryPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.memory-panel',
    title: 'Main Memory',
    uses: [ 'BDC.lib.Colors'],
    columnWidth: 0.6,
    height: 350,
    layout: {
        type: 'table',
        columns: 11
    },
    padding: '10px',

    initComponent: function () {
        var i, j;

        this.callParent(arguments);

        for (i = 0; i < 11; ++i) {
            if (i === 0) {
                this.add({
                    xtype: 'panel',
                    border: false,
                    width: 60
                });
            } else {
                this.add({
                    xtype: 'text',
                    fieldCls: 'memory-bold-cell',
                    text: '' + (i - 1),
                    padding: '2 5 25 11'
                });
            }
        }
        for (i = 0, j = 0; i < 100; ++i) {
            if (i % 10 === 0) {
                this.add({
                    xtype: 'text',
                    fieldCls: 'memory-bold-cell',
                    text: '' + j++,
                    padding: '0 0 0 10'
                });
            }

            this.add({
                xtype: 'textfield',
                minLength: 1,
                maxLength: 1,
                fieldCls: 'memory-cell',
                selectOnFocus: true,
                emptyText: '0',
                width: 25,
                itemId: 'memory-cell-' + i,
                margin: '2px'
            });
        }
    },

    getMemoryCells: function () {
        return this.query('textfield[itemId^=memory-cell]');
    },

    clear: function () {
        var cells = this.getMemoryCells();
        Ext.each(cells, function (cell) {
            cell.reset();
            cell.setFieldStyle('color: darkgrey;');
            cell.setValue('0');
        });
        this.highlightInstruction(0, BDC.lib.Colors.MAGENTA);
    },

    getCell: function (i, j) {
        var index = (i % 10) * 10 + (j % 10);
        var id = Ext.String.format('memory-cell-{0}', index);
        return this.getComponent(id);
    },

    highlightInstruction: function (pc, color) {
        var pc0, pc1;
        pc1 = Math.floor(pc / 10);
        pc0 = pc % 10;

        this.highlight(pc1, pc0, color);

        pc = (pc + 1) % 100;
        pc1 = Math.floor(pc / 10);
        pc0 = pc % 10;

        this.highlight(pc1, pc0, color);

        pc = (pc + 1) % 100;
        pc1 = Math.floor(pc / 10);
        pc0 = pc % 10;

        this.highlight(pc1, pc0, color);
    },

    highlight: function (i, j, color) {
        var cell = this.getCell(i, j);
        var style = Ext.String.format('color: #{0};', color);
        cell.setFieldStyle(style);
    },

    resetGray: function () {
        var cells = this.getMemoryCells();
        Ext.each(cells, function (cell) {
            cell.setFieldStyle('color: darkgrey;');
        });
    },

    getCellValue: function (i, j) {
        var cell = this.getCell(i, j);
        return cell.getValue() % 10;
    },

    getNCellValue: function (n) {
        var i, j;
        i = Math.floor(n / 10) % 10;
        j = n % 10;
        return this.getCellValue(i, j);
    },

    setCellValue: function (i, j, value) {
        var cell = this.getCell(i, j);
        cell.setValue(value % 10);
    },

    setNCellValue: function (n, value) {
        var i, j;
        i = Math.floor(n / 10) % 10;
        j = n % 10;
        this.setCellValue(i, j, value);
    }
});



Ext.define('BDC.lib.RegistersPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.registers-panel',
    title: 'CPU Registers',
    columnWidth: 0.2,
    layout: 'vbox',
    bodyPadding: 10,
    padding: '10px',
    ac0: 0, ac1: 0,
    pc0: 0, pc1: 0,
    ir0: 0, ir1: 0, ir2: 0,
    items: [
        {
            xtype: 'textfield',
            itemId: 'ACC',
            fieldLabel: 'A:',
            fieldCls: 'memory-cell',
            labelWidth: 20,
            minLength: 1,
            maxLength: 2,
            selectOnFocus: true,
            emptyText: '00',
            width: 75,
            padding: '35 0 0 0'
        },
        {
            xtype: 'textfield',
            itemId: 'PC',
            fieldLabel: 'PC:',
            fieldCls: 'memory-cell',
            labelWidth: 20,
            minLength: 1,
            maxLength: 2,
            selectOnFocus: true,
            emptyText: '00',
            width: 75
        },
        {
            xtype: 'textfield',
            itemId: 'IR',
            fieldLabel: 'IR:',
            fieldCls: 'memory-cell',
            labelWidth: 20,
            minLength: 1,
            maxLength: 3,
            selectOnFocus: true,
            emptyText: '000',
            width: 75
        },
        {
            itemId: 'haltText',
            html: 'HALTED',
            baseCls: 'halt-text'
        }
    ],

    clear: function () {
        var component = this.getComponent('ACC');
        component.reset();

        component = this.getComponent('PC');
        component.reset();

        component = this.getComponent('IR');
        component.reset();
    },

    setAll: function () {
        this.setACC();
        this.setPC();
        this.setIR();
    },

    setACC: function () {
        var component = this.getComponent('ACC');
        var n = component.getValue();
        if (0 <= n && n < 100) {
            this.ac1 = Math.floor(n / 10);
            this.ac0 = n % 10;
        }
    },

    setACCXY: function (x, y) {
        var component = this.getComponent('ACC');
        this.ac1 = x % 10;
        this.ac0 = y % 10;
        component.setValue('' + this.ac1 + '' + this.ac0);
    },

    setACCN: function (n) {
        var x, y;
        x = Math.floor(n / 10) % 10;
        y = n % 10;
        this.setACCXY(x, y);
    },

    setPC: function () {
        var component = this.getComponent('PC');
        var n = component.getValue();
        if (0 <= n && n < 100) {
            this.pc1 = Math.floor(n / 10);
            this.pc0 = n % 10;
        }
    },

    setPCXY: function (x, y) {
        var component = this.getComponent('PC');
        this.pc1 = x % 10;
        this.pc0 = y % 10;
        component.setValue('' + this.pc1 + '' + this.pc0);
    },

    setPCN: function (n) {
        var x, y;
        x = Math.floor(n / 10) % 10;
        y = n % 10;
        this.setPCXY(x, y);
    },

    setIR: function () {
        var component = this.getComponent('IR');
        var n = component.getValue();
        if (0 <= n && n < 1000) {
            this.ir2 = Math.floor(n / 100);
            n = n % 100;
            this.ir1 = Math.floor(n / 10);
            this.ir0 = n % 10;
        }
    },

    clearHalt: function () {
        var component = this.getComponent('haltText');
        component.setVisible(false);
    },

    incPC: function () {
        var pc = this.getComponent('PC');

        this.pc0++;
        if (this.pc0 === 10) {
            this.pc0 = 0;
            this.pc1 = (this.pc1 + 1) % 10;
        }

        pc.setValue('' + this.pc1 + '' + this.pc0);
    },

    setIRXYZ: function (x, y, z) {
        var ir = this.getComponent('IR');
        this.ir2 = x % 10;
        this.ir1 = y % 10;
        this.ir0 = z % 10;
        ir.setValue('' + this.ir2 + '' + this.ir1 + '' + this.ir0);
    },

    setIRN: function (n) {
        var x, y, z;
        x = Math.floor(n / 100) % 10;
        n = n % 100;
        y = Math.floor(n / 10);
        z = n % 10;
        this.setIRXYZ(x, y, z);
    },

    setStrings: function () {
        var component = this.getComponent('ACC');
        component.setValue('' + this.ac1 + '' + this.ac0);

        component = this.getComponent('PC');
        component.setValue('' + this.pc1 + '' + this.pc0);

        component = this.getComponent('IR');
        component.setValue('' + this.ir2 + '' + this.ir1 + '' + this.ir0);
    },

    setHalt: function () {
        var component = this.getComponent('haltText');
        component.setVisible(true);
    }
});

Ext.define('BDC.view.View', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.bdc-view',
    requires: [ 'BDC.lib.ButtonsPanel', 'BDC.lib.MemoryPanel', 'BDC.lib.RegistersPanel' ],
    uses: [ 'BDC.lib.Colors'],
    width: 650,
    height: 350,
    border: false,
    of: false,  // overflow
    layout: {
        type: 'column'
    },
    items: [
        {
            xtype: 'buttons-panel'
        },
        {
            xtype: 'memory-panel',
            itemId: 'memoryPanel'
        },
        {
            xtype: 'registers-panel',
            itemId: 'registersPanel'
        }
    ],

    reset: function () {
        var panel = this.getComponent('memoryPanel');
        panel.clear();

        panel = this.getComponent('registersPanel');
        panel.clear();
        panel.clearHalt();

        this.of = false;
    },

    highlightInstruction: function (pc, color) {
        var pc0, pc1;
        var memoryPanel = this.getComponent('memoryPanel');

        pc1 = Math.floor(pc / 10);
        pc0 = pc % 10;
        memoryPanel.highlight(pc1, pc0, color);
        pc = (pc + 1) % 100;
        pc1 = Math.floor(pc / 10);
        pc0 = pc % 10;
        memoryPanel.highlight(pc1, pc0, color);
        pc = (pc + 1) % 100;
        pc1 = Math.floor(pc / 10);
        pc0 = pc % 10;
        memoryPanel.highlight(pc1, pc0, color);
    },

    highlightData: function (ad, color) {
        var ad0, ad1;
        var memoryPanel = this.getComponent('memoryPanel');

        ad1 = Math.floor(ad / 10);
        ad0 = ad % 10;
        memoryPanel.highlight(ad1, ad0, color);
        ad = (ad + 1) % 100;
        ad1 = Math.floor(ad / 10);
        ad0 = ad % 10;
        memoryPanel.highlight(ad1, ad0, color);
    },

    step: function () {
        var memoryPanel, registersPanel;
        var acc, ac0, ac1, pc, pc0, pc1, ir0, ir1, ir2;
        var xy, xy_, cell0_, cell0, cell1_, cell1;
        var value_, value;

        memoryPanel = this.getComponent('memoryPanel');
        memoryPanel.resetGray();

        registersPanel = this.getComponent('registersPanel');
        registersPanel.setAll();
        registersPanel.clearHalt();

        ac0 = registersPanel.ac0;
        ac1 = registersPanel.ac1;
        acc = ac0 + 10 * ac1;

        pc0 = registersPanel.pc0;
        pc1 = registersPanel.pc1;
        ir0 = memoryPanel.getCellValue(pc1, pc0);
        registersPanel.incPC();

        pc0 = registersPanel.pc0;
        pc1 = registersPanel.pc1;
        ir1 = memoryPanel.getCellValue(pc1, pc0);
        registersPanel.incPC();

        pc0 = registersPanel.pc0;
        pc1 = registersPanel.pc1;
        ir2 = memoryPanel.getCellValue(pc1, pc0);
        registersPanel.incPC();

        pc0 = registersPanel.pc0;
        pc1 = registersPanel.pc1;
        registersPanel.setIRXYZ(ir2, ir1, ir0);
        registersPanel.setStrings();

        pc = pc0 + 10 * pc1;
        xy_ = xy = ir0 + 10 * ir1;
        cell0_ = cell0 = memoryPanel.getNCellValue(xy);
        cell1_ = cell1 = memoryPanel.getNCellValue((xy + 1) % 100);
        value_ = value = cell0 + 10 * cell1;

        if (ir2 >= 4) {
            if (xy === 0) {          // accumulator addressing
                cell0_ = ac0;
                cell1_ = ac1;
                value_ = acc;
            } else if (ir1 === 0) {    // indirect addressing
                xy_ = ir0 + 90;
                cell0_ = memoryPanel.getNCellValue(xy_);
                cell1_ = memoryPanel.getNCellValue((xy_ + 1) % 100);
                xy_ = cell0_ + 10 * cell1_;
                cell0_ = memoryPanel.getNCellValue(xy_);
                cell1_ = memoryPanel.getNCellValue((xy_ + 1) % 100);
                value_ = cell0_ + 10 * cell1_;
            }
        }

        switch (ir2) {
            case 0:      // branch or halt
                if (ir0 !== 0 || ir1 !== 0)
                    registersPanel.setPCN(pc + xy);
                else {
                    registersPanel.setPCN(pc + 97);
                    registersPanel.setHalt();
                }
                break;
            case 1:      // branch on overflow
                if (this.of) if (ir0 !== 0 || ir1 !== 0)
                    registersPanel.setPCN(pc + xy);
                else {
                    registersPanel.setPCN(pc + 97);
                    registersPanel.setHalt();
                }
                break;
            case 2:      // branch on not overflow
                if (!this.of) if (ir0 !== 0 || ir1 !== 0)
                    registersPanel.setPCN(pc + xy);
                else {
                    registersPanel.setPCN(pc + 97);
                    registersPanel.setHalt();
                }
                break;
            case 3:      // load immediate accumulator
                registersPanel.setACCN(xy);
                break;
            case 4:      // fetch to accumulator
                registersPanel.setACCN(value_);
                break;
            case 5:      // add to accumulator
                this.of = acc + value > 100;
                registersPanel.setACCN((acc + value_) % 100);
                break;
            case 6:      // subtract from accumulator
                this.of = acc < value;
                registersPanel.setACCN((100 + acc - value_) % 100);
                break;
            case 7:      // store accumulator
                if (xy !== 0) {
                    memoryPanel.setNCellValue(xy_, ac0);
                    memoryPanel.setNCellValue((xy_ + 1) % 100, ac1);
                }
                break;
            case 8:      // increment memory value
                this.of = value === 99;
                value_ = (value_ + 1) % 100;
                if (xy !== 0) {
                    cell1_ = Math.floor(value_ / 10);
                    cell0_ = value_ % 10;
                    memoryPanel.setNCellValue(xy_, cell0_);
                    memoryPanel.setNCellValue((xy_ + 1) % 100, cell1_);
                } else {
                    registersPanel.setACCN(value_);
                }
                break;
            case 9:      // decrement memory value
                this.of = value === 0;
                value_ = (value_ + 99) % 100;
                if (xy !== 0) {
                    cell1_ = Math.floor(value_ / 10);
                    cell0_ = value_ % 10;
                    memoryPanel.setNCellValue(xy_, cell0_);
                    memoryPanel.setNCellValue((xy_ + 1) % 100, cell1_);
                } else {
                    registersPanel.setACCN(value_);
                }
                break;
        }

        if (ir2 >= 4) {
            if (ir1 !== 0) {
                this.highlightData(xy, BDC.lib.Colors.BLUE);
            } else if (ir0 !== 0) {
                this.highlightData(90 + xy, BDC.lib.Colors.GREEN);
                this.highlightData(xy_, BDC.lib.Colors.BLUE);
            }
        }

        pc0 = registersPanel.pc0;
        pc1 = registersPanel.pc1;
        pc = pc0 + 10 * pc1;
        this.highlightInstruction(pc, BDC.lib.Colors.MAGENTA);
    },

    loadProgram: function (program) {
        var memoryPanel, registersPanel, i, j, n = 0, pc0, pc1, pc;
        memoryPanel = this.getComponent('memoryPanel');
        registersPanel = this.getComponent('registersPanel');

        this.reset();

        registersPanel.setACCN(program[n++]);
        registersPanel.setPCN(program[n++]);
        registersPanel.setIRN(program[n++]);

        for (i = 0; i < 10; i++) {
            for (j = 0; j < 10; j++) {
                memoryPanel.setCellValue(i, j, program[n++]);
            }
        }

        registersPanel.setAll();
        pc0 = registersPanel.pc0;
        pc1 = registersPanel.pc1;
        pc = pc0 + 10 * pc1;
        this.highlightInstruction(pc, BDC.lib.Colors.MAGENTA);
    }
});

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

Ext.define('BDC.lib.Colors', {
    statics: {
        BLUE: '0000FF',
        GREEN: '00FF00',
        MAGENTA: 'FF00FF'
    }
});
Ext.define('BDC.lib.Programs', {
    statics: {
        PROGRAM_ONE: [0, 0, 0,
            0, 0, 3, 8, 9, 7, 4, 9, 9, 9,
            0, 1, 8, 9, 4, 6, 9, 5, 2, 8,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 7, 0, 5, 0, 0, 0],
        PROGRAM_TWO: [0, 0, 0,
            0, 0, 3, 8, 9, 7, 4, 9, 4, 6,
            9, 6, 6, 0, 1, 8, 9, 8, 8, 8,
            0, 8, 9, 4, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 9, 2, 3, 0, 0, 0],
        PROGRAM_THREE: [0, 0, 0,
            0, 0, 3, 8, 9, 7, 8, 9, 4, 4,
            9, 5, 8, 9, 7, 4, 9, 8, 6, 9,
            4, 4, 9, 6, 9, 7, 2, 8, 9, 4,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 7, 0, 2, 1, 0, 0],
        PROGRAM_FOUR: [0, 0, 0,
            1, 0, 3, 4, 9, 7, 6, 9, 7, 4,
            9, 4, 6, 9, 5, 8, 9, 7, 6, 9,
            4, 4, 9, 7, 8, 9, 4, 6, 9, 7,
            6, 7, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 5, 0, 3, 0, 0, 0],
        PROGRAM_FIVE: [0, 0, 0,
            9, 9, 3, 8, 9, 7, 1, 0, 3, 6,
            9, 7, 4, 9, 4, 6, 9, 6, 5, 1,
            1, 8, 9, 8, 6, 9, 4, 6, 9, 5,
            6, 9, 7, 6, 7, 0, 8, 9, 4, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 5, 5, 0, 0, 0, 0],
        PROGRAM_SIX: [0, 0, 0,
            0, 0, 3, 8, 9, 9, 5, 1, 1, 6,
            0, 5, 6, 9, 8, 6, 9, 8, 8, 9,
            9, 5, 8, 2, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            3, 0, 1, 1, 5, 0, 2, 3, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 4, 4, 0]
    }
});
Ext.define('BDC.lib.Frame', {
    extend: 'Ext.panel.Panel',
    alias: 'bdc-frame',
    closable: false,
    title: 'Basic Decimal Computer',
    renderTo: 'bdc-app',
    width: 665,
    height: 375,
    layout: 'fit',
    items: [
        { xtype: 'bdc-view' }
    ],

    initComponent: function () {
        Ext.QuickTips.init();
        Ext.tip.Tip.prototype.minWidth = 200;
        this.callParent(arguments);
    }
});


