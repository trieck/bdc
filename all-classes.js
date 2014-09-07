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
            border: false,
            flex: 0.2
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
            border: false,
            flex: 0.2
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
            border: false,
            flex: 0.2
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
            border: false,
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
            border: false,
            flex: 0.2
        },
        {
            xtype: 'button',
            tooltip: { text: 'Launch Assembler Editor' },
            text: 'ASSEMBLER',
            focusCls: '',
            id: 'assemblerButton',
            iconCls: 'assemble-icon',
            iconAlign: 'top',
            width: '80%',
            flex: 0.6
        },
        {
            border: false,
            flex: 0.2
        }
    ]
});

Ext.define('BDC.lib.MemoryPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.memory-panel',
    title: 'Main Memory',
    uses: [ 'BDC.lib.Colors', 'BDC.lib.DigitValidator' ],
    columnWidth: 0.6,
    height: 350,
    layout: {
        type: 'table',
        columns: 11
    },
    padding: '10px',

    digitValidator: function () {
        var value = this.getValue();
        if (value.length >= 1)
            this.setValue(value.slice(0, 1));
    },

    initComponent: function () {
        var i, j;

        this.callParent(arguments);

        for (i = 0; i < 11; ++i) {
            if (i === 0) {
                this.add({ border: false });
            } else {
                this.add({
                    baseCls: 'memory-col-header',
                    html: '' + (i - 1),
                    padding: '10 5 7 11'
                });
            }
        }
        for (i = 0, j = 0; i < 100; ++i) {
            if (i % 10 === 0) {
                this.add({
                    baseCls: 'memory-row-header',
                    html: '' + j++,
                    padding: '0 15 0 10'
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
                vtype: 'digit',
                enableKeyEvents: true,
                listeners: {
                    'keyup': this.digitValidator
                },
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



Ext.define('BDC.lib.FlagsPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.flags-panel',
    title: 'CPU Flags',
    layout: 'vbox',
    bodyPadding: 10,
    padding: '10 0 0 0',
    items: [
        {
            itemId: 'overflow-flag',
            html: 'OF:',
            baseCls: 'register-label',
            width: 75
        }
    ],

    setOverflow: function (flag) {
        var component = this.getComponent('overflow-flag');

        if (flag === true) {
            component.update('OF: 1');
        } else {
            component.update('OF: 0');
        }
    }
});

Ext.define('BDC.lib.HaltPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.halt-panel',
    border: false,
    padding: '10 0 0 0',
    items: [
        {
            xtype: 'image',
            cls: 'halt-icon',
            title: 'Halted'
        }
    ],

    clearHalt: function () {
        this.setVisible(false);
    },

    setHalt: function () {
        this.setVisible(true);
    }
});

Ext.define('BDC.lib.DigitValidator', function () {

    Ext.apply(Ext.form.field.VTypes, {
        pattern: /^[0-9]$/,

        digit: function (val, field) {
            return this.pattern.test(val);
        },
        digitMask: /[0-9]/
    });

    Ext.apply(Ext.form.field.VTypes, {
        pattern: /^[0-9]*[0-9]$/,

        'two-digits': function (val, field) {
            return this.pattern.test(val);
        },
        'two-digitsMask': /[0-9]/
    });

    Ext.apply(Ext.form.field.VTypes, {
        pattern: /^[0-9]*[0-9]*[0-9]$/,

        'three-digits': function (val, field) {
            return this.pattern.test(val);
        },

        'three-digitsMask': /[0-9]/
    });

    return this;
}());


Ext.define('BDC.lib.RegistersPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.registers-panel',
    requires: [ 'BDC.lib.DigitValidator' ],
    title: 'CPU Registers',
    layout: 'vbox',
    bodyPadding: 10,
    ac0: 0, ac1: 0,
    pc0: 0, pc1: 0,
    ir0: 0, ir1: 0, ir2: 0,
    items: [
        {
            xtype: 'textfield',
            itemId: 'ACC',
            fieldLabel: 'A:',
            fieldCls: 'memory-cell',
            labelCls: 'register-label',
            labelWidth: 20,
            minLength: 1,
            maxLength: 2,
            selectOnFocus: true,
            emptyText: '00',
            vtype: 'two-digits',
            enableKeyEvents: true,
            listeners: {
                'keyup': function () {
                    var value = this.getValue();
                    if (value.length > 2)
                        this.setValue(value.slice(0, 2));
                }
            },
            width: 75
        },
        {
            xtype: 'textfield',
            itemId: 'PC',
            fieldLabel: 'PC:',
            fieldCls: 'memory-cell',
            labelCls: 'register-label',
            labelWidth: 20,
            minLength: 1,
            maxLength: 2,
            selectOnFocus: true,
            emptyText: '00',
            vtype: 'two-digits',
            enableKeyEvents: true,
            listeners: {
                'keyup': function () {
                    var value = this.getValue();
                    if (value.length > 2)
                        this.setValue(value.slice(0, 2));
                }
            },
            width: 75
        },
        {
            xtype: 'textfield',
            itemId: 'IR',
            fieldLabel: 'IR:',
            fieldCls: 'memory-cell',
            labelCls: 'register-label',
            labelWidth: 20,
            minLength: 1,
            maxLength: 3,
            selectOnFocus: true,
            emptyText: '000',
            vtype: 'three-digits',
            enableKeyEvents: true,
            listeners: {
                'keyup': function () {
                    var value = this.getValue();
                    if (value.length > 3)
                        this.setValue(value.slice(0, 3));
                }
            },
            width: 75
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
    }
});

Ext.define('BDC.lib.StatusPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.status-panel',
    requires: [
        'BDC.lib.RegistersPanel',
        'BDC.lib.FlagsPanel',
        'BDC.lib.HaltPanel'
    ],
    columnWidth: 0.2,
    layout: {
        type: 'vbox',
        align: 'center'
    },
    padding: '10px',
    border: false,
    items: [
        {
            xtype: 'registers-panel',
            itemId: 'registersPanel'
        },
        {
            xtype: 'flags-panel',
            itemId: 'flagsPanel'
        },
        {
            xtype: 'halt-panel',
            itemId: 'haltPanel'
        }
    ]
});

Ext.define('BDC.view.View', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.bdc-view',
    requires: [ 'BDC.lib.ButtonsPanel', 'BDC.lib.MemoryPanel', 'BDC.lib.StatusPanel' ],
    uses: [ 'BDC.lib.Colors'],
    width: 600,
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
            xtype: 'status-panel',
            itemId: 'statusPanel'
        }
    ],

    registersPanel: function () {
        return Ext.ComponentQuery.query('#registersPanel')[0];
    },

    haltPanel: function () {
        return Ext.ComponentQuery.query('#haltPanel')[0];
    },

    flagsPanel: function () {
        return Ext.ComponentQuery.query('#flagsPanel')[0];
    },

    reset: function () {
        var panel = this.getComponent('memoryPanel');
        panel.clear();

        panel = this.registersPanel();
        panel.clear();

        panel = this.haltPanel();
        panel.clearHalt();

        this.of = false;

        panel = this.flagsPanel();
        panel.setOverflow(this.of);
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
        var memoryPanel, registersPanel, haltPanel, flagsPanel;
        var acc, ac0, ac1, pc, pc0, pc1, ir0, ir1, ir2;
        var xy, xy_, cell0_, cell0, cell1_, cell1;
        var value_, value;

        memoryPanel = this.getComponent('memoryPanel');
        memoryPanel.resetGray();

        registersPanel = this.registersPanel();
        registersPanel.setAll();

        haltPanel = this.haltPanel();
        haltPanel.clearHalt();

        flagsPanel = this.flagsPanel();

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
                    haltPanel.setHalt();
                }
                break;
            case 1:      // branch on overflow
                if (this.of) if (ir0 !== 0 || ir1 !== 0)
                    registersPanel.setPCN(pc + xy);
                else {
                    registersPanel.setPCN(pc + 97);
                    haltPanel.setHalt();
                }
                break;
            case 2:      // branch on not overflow
                if (!this.of) if (ir0 !== 0 || ir1 !== 0)
                    registersPanel.setPCN(pc + xy);
                else {
                    registersPanel.setPCN(pc + 97);
                    haltPanel.setHalt();
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
                flagsPanel.setOverflow(this.of);
                break;
            case 6:      // subtract from accumulator
                this.of = acc < value;
                registersPanel.setACCN((100 + acc - value_) % 100);
                flagsPanel.setOverflow(this.of);
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
                flagsPanel.setOverflow(this.of);
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
                flagsPanel.setOverflow(this.of);
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
        registersPanel = this.registersPanel();

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
    },

    loadAssembledProgram: function (program) {
        var memoryPanel, i, j, n = 0;
        memoryPanel = this.getComponent('memoryPanel');

        this.reset();

        for (i = 0; i < 10; i++) {
            for (j = 0; j < 10; j++) {
                memoryPanel.setCellValue(i, j, program[n++]);
            }
        }

        this.highlightInstruction(0, BDC.lib.Colors.MAGENTA);
    }
});

Ext.define('BDC.controller.Controller', {
    extend: 'Ext.app.Controller',
    uses: ['BDC.lib.Programs', 'BDC.lib.AssemblerEditor'],
    views: [ 'BDC.view.View' ],
    refs: [
        { selector: 'bdc-view', ref: 'BDCView' },
        { selector: 'panel[itemId=bdc-assembler]', ref: 'Assembler' }
    ],

    init: function () {
        this.control({
            'bdc-view': {
                afterrender: this.onViewAfterRender
            },
            '#assemblerButton': {
                click: this.onAssembler
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
/**
 * BDC Assembler class
 */
Ext.define('BDC.lib.Assembler', {
    uses: [ 'BDC.lib.Character' ],
    statics: {
        PROGRAM_SIZE: 100,
        MNEMONICS: {
            halt: -1,   // halt the machine
            j: 0,       // branch unconditionally
            jo: 1,      // branch if overflow
            jno: 2,     // branch unless overflow
            loadi: 3,   // load immediate value to .A
            load: 4,    // load value in memory to .A
            add: 5,     // add value in memory to .A
            sub: 6,     // subtract value in memory from .A
            store: 7,   // copy .A to memory
            inc: 8,     // increment value at memory address
            dec: 9      // decrement value at memory address
        },

        TT_EMPTY: 0,    // empty token
        TT_ID: 1,       // identifier token
        TT_NUMBER: 2,   // numeric token
        TT_LABEL: 3,    // label token

        PSEUDO_REGS: {
            q: 80,
            r: 82,
            s: 84,
            t: 86,
            u: 88,
            v: 90,
            w: 92,
            x: 94,
            y: 96,
            z: 98
        }
    },

    memory: [],     // memory to assemble to
    symbols: {},    // symbol table
    refs: [],       // forward reference list
    program: '',    // input program
    token: '',      // current input token
    i_index: 0,     // current input index
    o_index: 0,     // current index into memory
    line_no: 0,     // current line number

    /**
     * Initialize assembler
     * @private
     */
    initialize: function () {
        this.memory = Array.apply(null, new Array(this.self.PROGRAM_SIZE)).map(Number.prototype.valueOf, 0);
        this.symbols = {};
        this.refs = [];
        this.i_index = this.o_index = 0;
        this.line_no = 1;
        this.token = this.program = '';
    },

    constructor: function () {
        this.initialize();
    },

    /**
     * Assemble input program
     * @public
     * @param program
     * @returns {Array} assembled program
     */
    assemble: function (program) {
        this.initialize();
        this.program = program.toLowerCase();
        this.parse();
        this.resolve();
        return this.memory;
    },

    /**
     * Parse input program
     * @private
     */
    parse: function () {
        this.i_index = 0;
        var tt;

        while ((tt = this.getToken()) !== this.self.TT_EMPTY) {
            switch (tt) {
                case this.self.TT_LABEL:    // label definition
                    this.label();
                    break;
                case this.self.TT_ID:       // instruction
                    this.instruction();
                    break;
                default:                    // error
                    this.syntax_error();
                    break;
            }
        }
    },

    /**
     * Resolve forward references
     * @private
     */
    resolve: function () {

        Ext.each(this.refs, function (ref) {
            var value, message;
            if ((value = this.symbols[ref.name]) === undefined) {
                message = Ext.String.format('can\'t find label {0}.', ref.name);
                throw { error: message, line_no: ref.line_no };
            }
            // calculate real offset
            value = value - ref.location - 3;
            value = ((value % this.self.PROGRAM_SIZE) + this.self.PROGRAM_SIZE) % this.self.PROGRAM_SIZE;
            this.memory[ref.location] = value % 10;
            this.memory[ref.location + 1] = Math.floor(value / 10);
        }, this);
    },

    /**
     * Get next token from input
     * @private
     */
    getToken: function () {
        var c, length = this.program.length;
        var tt = this.self.TT_EMPTY;

        for (this.token = ''; this.i_index < length; ++this.i_index) {
            c = this.program[this.i_index];
            switch (c) {
                case ' ':   // whitespace delimiter
                case '\t':
                case '\r':
                    if (this.token.length) {
                        return tt;
                    }
                    break;
                case ':':   // label definition
                    if (this.token.length) {
                        return this.self.TT_LABEL;
                    }
                    break;
                case ';':   // comment
                    this.comment(); // eat
                    break;
                case '\n':  // new line
                    this.line_no++;
                    if (this.token.length) {
                        return tt;
                    }
                    break;
                default:
                    if (BDC.lib.Character.isdigit(c)) {
                        if (tt === this.self.TT_EMPTY) {
                            tt = this.self.TT_NUMBER;
                        }
                        this.token += c;
                        continue;
                    } else if (BDC.lib.Character.isalpha(c)) {
                        tt = this.self.TT_ID;
                        this.token += c;
                        continue;
                    } else {
                        this.syntax_error();
                    }
                    break;
            }
        }

        return tt;
    },

    /**
     * Generate instruction
     * @private
     */
    instruction: function () {
        var instr;

        if (this.token.length === 0) {
            this.syntax_error();
        }

        if ((instr = this.self.MNEMONICS[this.token]) === undefined) {
            this.syntax_error();
        }

        this.assemble_instr(instr);
    },

    /**
     * Assemble instruction
     * @param instr
     */
    assemble_instr: function (instr) {
        switch (instr) {
            case this.self.MNEMONICS.halt:  // halt
                this.halt();
                break;
            case this.self.MNEMONICS.j:     // branch
                this.jump();
                break;
            case this.self.MNEMONICS.jo:    // branch on overflow
                this.jo();
                break;
            case this.self.MNEMONICS.jno:    // branch unless overflow
                this.jno();
                break;
            case this.self.MNEMONICS.loadi: // load immediate
                this.loadi();
                break;
            case this.self.MNEMONICS.load:  // load value in memory to accumulator
                this.load();
                break;
            case this.self.MNEMONICS.add:   // add value in memory to accumulator
                this.add();
                break;
            case this.self.MNEMONICS.sub:   // subtract value in memory from accumulator
                this.sub();
                break;
            case this.self.MNEMONICS.store: // store accumulator to memory
                this.store();
                break;
            case this.self.MNEMONICS.inc:   // increment value in memory
                this.inc();
                break;
            case this.self.MNEMONICS.dec:   // decremement value in memory
                this.dec();
                break;
        }
    },

    /**
     * Assemble value
     * @param value
     * @private
     */
    assemble_val: function (value) {
        this.memory[this.o_index++] = value % 10;
        this.memory[this.o_index++] = Math.floor(value / 10);
    },

    /**
     * Halt
     * @private
     */
    halt: function () {
        this.assemble_val(0);
        this.memory[this.o_index++] = this.self.MNEMONICS.j;
    },

    /**
     * Jump
     * @private
     */
    jump: function () {
        var value = this.getLocation();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.j;
    },

    /**
     * Jump if overflow set
     * @private
     */
    jo: function () {
        var value = this.getLocation();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.jo;
    },

    /**
     * Jump unless overflow set
     * @private
     */
    jno: function () {
        var value = this.getLocation();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.jno;
    },


    /**
     * Load memory to accumulator
     * @private
     */
    load: function () {
        var value = this.getAbsolute();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.load;
    },

    /**
     * Load immediate value to accumulator
     * @private
     */
    loadi: function () {
        var value = this.getImmediate();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.loadi;
    },

    /**
     * Store accumulator to memory
     * @private
     */
    store: function () {
        var value = this.getAbsolute();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.store;
    },

    /**
     * Add value in memory to accumulator
     * @private
     */
    add: function () {
        var value = this.getAbsolute();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.add;
    },

    /**
     * Subtract value in memory from accumulator
     * @private
     */
    sub: function () {
        var value = this.getAbsolute();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.sub;
    },

    /**
     * Increment a value in memory
     * @private
     */
    inc: function () {
        var value = this.getAbsolute();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.inc;
    },

    /**
     * Decrement a value in memory
     * @private
     */
    dec: function () {
        var value = this.getAbsolute();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.dec;
    },

    /**
     * Get immediate value
     * @private
     * @returns {Number}
     */
    getImmediate: function () {
        var tt = this.getToken();
        if (tt !== this.self.TT_NUMBER)
            this.syntax_error();

        return this.parseValue();
    },

    /**
     * Parse token value
     * @returns {Number}
     */
    parseValue: function () {
        var value = parseInt(this.token, 10);
        if (isNaN(value)) {
            this.syntax_error();
        }

        if (0 > value || value > 99)
            this.error('number out of range.');

        return value;
    },

    /**
     * Get absolute value
     * @private
     * @return {Number}
     */
    getAbsolute: function () {
        var value, tt = this.getToken();
        if (tt !== this.self.TT_NUMBER && tt !== this.self.TT_ID) {
            this.syntax_error();
        }

        if (tt === this.self.TT_NUMBER) {
            return this.parseValue();
        }

        if ((value = this.self.PSEUDO_REGS[this.token]) === undefined) {
            this.error('undefined symbol');
        }

        return value;
    },

    /**
     * Get memory location or symbol table value
     */
    getLocation: function () {
        var value, tt = this.getToken();
        if (tt !== this.self.TT_NUMBER && tt !== this.self.TT_ID)
            this.syntax_error();

        if (tt === this.self.TT_NUMBER)
            return this.parseValue();

        if ((value = this.symbols[this.token]) !== undefined) {
            // calculate real offset
            value = ((this.self.PROGRAM_SIZE - this.o_index) + value) - 3;
            value = ((value % this.self.PROGRAM_SIZE) + this.self.PROGRAM_SIZE) % this.self.PROGRAM_SIZE;
            return value;
        }

        // undefined, generate a forward reference
        this.refs.push({ name: this.token, location: this.o_index, line_no: this.line_no });

        return 0;
    },

    /**
     * Parse comment
     * @private
     */
    comment: function () {
        var c, length = this.program.length;
        for (; this.i_index < length; ++this.i_index) {
            c = this.program[this.i_index];
            if (c === '\n') {
                this.i_index--; // un-read
                return;
            }
        }
    },

    /**
     * Define a label
     * @private
     */
    label: function () {
        if (this.token.length === 0) {
            this.syntax_error();
        }

        // can't re-define a label
        if (this.symbols[this.token] !== undefined) {
            this.error('label already defined.');
        }

        // can't be a pseudo register
        if (this.self.PSEUDO_REGS[this.token] !== undefined) {
            this.error('illegal label.');
        }

        this.symbols[this.token] = this.o_index;
    },

    /**
     * Throw a syntax error
     */
    syntax_error: function () {
        this.error('syntax error.');
    },

    /**
     * Throw an error with string description
     * @param str
     */
    error: function (str) {
        throw { error: str, line_no: this.line_no };
    }
});

Ext.define('BDC.lib.AssemblerEditor', {
    extend: 'Ext.panel.Panel',
    requires: 'BDC.lib.Assembler',
    itemId: 'bdc-assembler',
    title: 'BDC Assembler',
    renderTo: 'bdc-app',
    iconCls: 'assemble-icon',
    closable: true,
    width: 600,
    height: 375,
    collapsible: true,
    statics: {
        show: function () {
            if (Ext.ComponentQuery.query('panel[itemId=bdc-assembler]')[0])
                return; // shown
            return Ext.create('BDC.lib.AssemblerEditor');
        }
    },

    dockedItems: [
        {
            xtype: 'toolbar',
            items: [
                {
                    xtype: 'button',
                    tooltip: { text: 'Assemble Source Code', title: 'Assemble'},
                    text: 'Assemble Source Code',
                    iconCls: 'assemble-icon',
                    focusCls: '',
                    id: 'assembleButton'
                }
            ]
        }
    ],

    items: [
        {
            xtype: 'textarea',
            itemId: 'assembler-text',
            width: 600,
            height: 375,
            fieldStyle: {
                'fontFamily': 'courier new',
                'fontSize': '14px'
            },
            validationEvent: false,
            enableKeyEvents: true,
            listeners: {
                keydown: function (field, e) {
                    if (e.getKey() === e.TAB) {
                        e.stopEvent();
                        field.insertTab();
                    }
                }
            },
            insertTab: function () {
                var el = this.inputEl.dom;
                if (el.setSelectionRange) {
                    var withIns = el.value.substring(0, el.selectionStart) + '\t';
                    var pos = withIns.length;
                    el.value = withIns + el.value.substring(el.selectionEnd, el.value.length);
                    el.setSelectionRange(pos, pos);
                } else if (document.selection) {
                    document.selection.createRange().text = '\t';
                }
            }
        }
    ],

    assembler: Ext.create('BDC.lib.Assembler'),

    assemble: function () {
        var text = this.getComponent('assembler-text');
        var value = text.getValue();
        return this.assembler.assemble(value);
    }
});

Ext.define('BDC.lib.Frame', {
    extend: 'Ext.panel.Panel',
    alias: 'bdc-frame',
    title: 'Basic Decimal Computer',
    renderTo: 'bdc-app',
    iconCls: 'cpu-icon',
    width: 600,
    height: 375,
    layout: 'fit',
    items: [
        { xtype: 'bdc-view' }
    ],

    initComponent: function () {
        Ext.QuickTips.init();
        this.callParent(arguments);
    }
});

Ext.define('BDC.lib.Character', {
    statics: {
        isalpha: function (c) {
            return (((c >= 'a') && (c <= 'z')) || ((c >= 'A') && (c <= 'Z')));
        },

        isdigit: function (c) {
            return ((c >= '0') && (c <= '9'));
        },

        isalnum: function (c) {
            return (this.isalpha(c) || this.isdigit(c));
        }
    }
});


