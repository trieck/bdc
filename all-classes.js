/*
Copyright(c) 2014 Michael Q. Rieck, Thomas A. Rieck
*/
/**
 * Store to represent disassembled memory
 */
Ext.define('BDC.store.Disassembly', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    autoSync: true,
    statics: {
        ADDRESS_TABLE: {
            2: '[W]',
            4: '[X]',
            6: '[Y]',
            8: '[Z]',
            80: 'Q',
            82: 'R',
            84: 'S',
            86: 'T',
            88: 'U',
            90: 'V',
            92: 'W',
            94: 'X',
            96: 'Y',
            98: 'Z'
        }
    },
    fields: [
        { name: 'location', type: 'int' },
        { name: 'instruction', type: 'string' },
        { name: 'ir', type: 'auto' }
    ],
    data: Array.apply(null, new Array(26)).map(function (el, index) {
        return { location: index * 3, instruction: 'HALT', ir: [ 0, 0, 0 ] };
    }),

    onUpdateMemory: function (store, record, op) {
        if (op === Ext.data.Model.COMMIT) {
            if (record.index > 25 * 3)
                return; // out of range

            this.updateMemory(record);
        }
    },

    updateMemory: function (mem_record) {
        var index = Math.floor(mem_record.index / 3);
        var record = this.getAt(index);
        var pos = mem_record.index % 3;
        var ir = record.get('ir');
        ir[pos] = mem_record.data.value;
        record.set('ir', ir);
        this.format(record);
    },

    format: function (record) {
        var instruction;
        var ir = record.get('ir');
        switch (ir[2]) {
            case 0:
                if (ir[0] === 0 && ir[1] === 0) {
                    instruction = 'HALT';
                } else {
                    instruction = Ext.String.format("J {0}", this.formatTarget(record));
                }
                break;
            case 1:
                instruction = Ext.String.format("JO {0}", this.formatTarget(record));
                break;
            case 2:
                instruction = Ext.String.format("JNO {0}", this.formatTarget(record));
                break;
            case 3:
                instruction = Ext.String.format("LOADI {0}{1}", ir[1], ir[0]);
                break;
            case 4:
                instruction = Ext.String.format("LOAD {0}", this.formatAddress(record));
                break;
            case 5:
                instruction = Ext.String.format("ADD {0}", this.formatAddress(record));
                break;
            case 6:
                instruction = Ext.String.format("SUB {0}", this.formatAddress(record));
                break;
            case 7:
                instruction = Ext.String.format("STORE {0}", this.formatAddress(record));
                break;
            case 8:
                if (ir[0] === 0 && ir[1] === 0) {
                    instruction = Ext.String.format("INC A");
                } else {
                    instruction = Ext.String.format("INC {0}", this.formatAddress(record));
                }
                break;
            case 9:
                if (ir[0] === 0 && ir[1] === 0) {
                    instruction = Ext.String.format("DEC A");
                } else {
                    instruction = Ext.String.format("DEC {0}", this.formatAddress(record));
                }
                break;
        }

        record.set('instruction', instruction);
    },

    /**
     * Format branch target
     * @param record
     * @returns {String}
     * @private
     */
    formatTarget: function (record) {
        var ir, address, location, value, lo, hi;
        ir = record.get('ir');
        location = record.get('location');
        address = ir[1] * 10 + ir[0];
        value = (location + 3) - (100 - address);
        value = ((value % 100) + 100) % 100;
        hi = Math.floor(value / 10);
        lo = value % 10;

        return Ext.String.format("{0}{1}", hi, lo);
    },

    /**
     * Format address
     * @param record
     * @returns {String}
     * @private
     */

    formatAddress: function (record) {
        var ir = record.get('ir');
        var address = ir[1] * 10 + ir[0];
        var symbol;
        if ((symbol = this.self.ADDRESS_TABLE[address]) !== undefined) {
            return symbol;
        }

        return Ext.String.format("{0}{1}", ir[1], ir[0]);
    }
});


Ext.define('BDC.lib.ButtonsPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.buttons-panel',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    width: 140,
    height: 350,
    title: 'Options',
    padding: '10 10 10 15',
    items: [
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
            flex: 0.10
        },
        {
            xtype: 'button',
            tooltip: { text: 'Launch Disassembler' },
            text: 'DISASSEMBLER',
            focusCls: '',
            id: 'disassemblerButton',
            iconCls: 'disassemble-icon',
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
    width: 350,
    height: 350,
    layout: {
        type: 'table',
        columns: 11
    },
    padding: '10 0 10 5',

    keyPress: function (field, event) {
        var code = event.getCharCode(), store;
        if (code < 48 || code > 57) {
            event.stopEvent();
            return;
        }

        store = Ext.getStore('Memory');
        store.setCellValue(this.cellIndex, code - 48);

        field.setRawValue('');
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
                cellIndex: i,
                vtype: 'digit',
                enableKeyEvents: true,
                listeners: {
                    'keypress': this.keyPress
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



/**
 * Model for BDC machine
 */
Ext.define('BDC.model.Machine', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'halted', type: 'boolean' },
        { name: 'overflow_flag', type: 'boolean' },
        { name: 'reg_a', type: 'int' },
        { name: 'reg_pc', type: 'int' },
        { name: 'reg_ir', type: 'int' }
    ]
});
/**
 * Model for an individual memory cell
 */
Ext.define('BDC.model.MemoryCell', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'value', type: 'int' }
    ]
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


/**
 * Store to represent machine
 */
Ext.define('BDC.store.Machine', {
    extend: 'Ext.data.Store',
    model: 'BDC.model.Machine',
    autoLoad: true,
    autoSync: true,
    data: {
        halted: false,
        overflow_flag: false,
        reg_a: 0,
        reg_pc: 0,
        reg_ir: 0
    },
    proxy: {
        type: 'memory'
    },

    /**
     * Get the one and only model instance
     * @private
     */
    getRecord: function () {
        return this.getAt(0);
    },

    /**
     * Get halted state
     * @public
     * @returns {boolean}
     */
    getHalted: function () {
        return this.getRecord().get('halted');
    },

    /**
     * Set halted state
     * @public
     * @param value
     */
    setHalted: function (value) {
        this.getRecord().set('halted', !!value);
    },

    /**
     * Get overflow flag
     * @public
     * @returns {boolean}
     */
    getOverflow: function () {
        return this.getRecord().get('overflow_flag');
    },

    /**
     * Set overflow flag
     * @public
     * @param value
     */
    setOverflow: function (value) {
        this.getRecord().set('overflow_flag', !!value);
    },

    /**
     * Get accumulator register
     * @public
     * @returns {Number}
     */
    getACC: function () {
        return this.getRecord().get('reg_a');
    },

    /**
     * Set acccumulator register
     * @public
     * @param value
     */
    setACC: function (value) {
        this.getRecord().set('reg_a', value % 100);
    },

    /**
     * Set acccumulator register without event
     * @public
     * @param value
     */
    setACCRaw: function (value) {
        this.suspendEvent('update');
        this.setACC(value);
        this.resumeEvent('update');
    },

    /**
     * Set PC register
     * @public
     * @param value
     */
    setPC: function (value) {
        this.getRecord().set('reg_pc', value % 100);
    },

    /**
     * Set PC register without event
     * @public
     * @param value
     */
    setPCRaw: function (value) {
        this.suspendEvent('update');
        this.setPC(value);
        this.resumeEvent('update');
    },

    /**
     * Get PC register
     * @public
     * @returns {Number}
     */
    getPC: function () {
        return this.getRecord().get('reg_pc');
    },

    /**
     * Set IR register
     * @public
     * @param value
     */
    setIR: function (value) {
        this.getRecord().set('reg_ir', value % 1000);
    },

    /**
     * Set IR register without event
     * @public
     * @param value
     */
    setIRRaw: function (value) {
        this.suspendEvent('update');
        this.setIR(value);
        this.resumeEvent('update');
    },

    /**
     * Get IR register
     * @public
     * @returns {Number}
     */
    getIR: function () {
        return this.getRecord().get('reg_ir');
    },

    /**
     * Reset the machine
     * @public
     */
    reset: function () {
        this.startBatch();
        this.setHalted(false);
        this.setOverflow(false);
        this.setACC(0);
        this.setPC(0);
        this.setIR(0);
        this.endBatch();
    },

    /**
     * Suspend update events
     * @private
     */
    startBatch: function () {
        this.suspendEvent('update');
    },

    /**
     * Resume update events
     * and fire update event
     * @private
     */
    endBatch: function () {
        this.resumeEvent('update');
        this.fireEventArgs('update', [ this, this.getRecord(), Ext.data.Model.COMMIT ]);
    },

    /**
     * Step the machine
     * @public
     */
    step: function () {
        var pc = this.getPC();
        var overflow = this.getOverflow();
        var memory = Ext.getStore('Memory');
        var value;
        var ir0 = memory.getCellValue(pc);
        var ir1 = memory.getCellValue(++pc);
        var ir2 = memory.getCellValue(++pc);
        var address = ir0 + 10 * ir1;
        var address_ = address;
        var acc = this.getACC();

        pc = (pc + 1) % 100;

        this.startBatch();

        this.setPC(pc);
        this.setIR(ir2 * 100 + ir1 * 10 + ir0);

        if (ir2 >= 4 && ir0 === 0 && ir1 === 0) {   // accumulator addressing
            value = acc;
        } else if (ir2 >= 4 && ir1 === 0) {         // indirect addressing
            address_ = memory.getWord(ir0 + 90);
            value = memory.getWord(address_);
        } else if (ir2 >= 4 && ir2 !== 7) {         // memory access
            value = memory.getWord(address);
        }

        switch (ir2) {
            case 0: // branch or halt
                if (ir0 !== 0 || ir1 !== 0) {
                    this.setPC(pc + address);
                } else {
                    this.setPC(pc + 97);
                    this.setHalted(true);
                }
                break;
            case 1: // branch on overflow
                if (overflow) {
                    if (ir0 !== 0 || ir1 !== 0) {
                        this.setPC(pc + address);
                    } else {
                        this.setPC(pc + 97);
                        this.setHalted(true);
                    }
                }
                break;
            case 2: // branch on not overflow
                if (!overflow) {
                    if (ir0 !== 0 || ir1 !== 0) {
                        this.setPC(pc + address);
                    } else {
                        this.setPC(pc + 97);
                        this.setHalted(true);
                    }
                }
                break;
            case 3: // load immediate accumulator
                this.setACC(address);
                break;
            case 4: // fetch to accumulator
                this.setACC(value);
                break;
            case 5: // add to accumulator
                overflow = acc + value > 99;
                this.setACC(acc + value);
                this.setOverflow(overflow);
                break;
            case 6: // subtract from accumulator
                overflow = acc < value;
                this.setACC(100 + acc - value);
                this.setOverflow(overflow);
                break;
            case 7: // store accumulator
                if (address !== 0) {
                    memory.setWord(address_, acc);
                }
                break;
            case 8: // increment memory value
                overflow = value === 99;
                value = (value + 1) % 100;
                if (address === 0) {
                    this.setACC(value);
                } else {
                    memory.setWord(address_, value);
                }
                this.setOverflow(overflow);
                break;
            case 9: // decrement memory value
                overflow = value === 0;
                value = (value + 99) % 100;
                if (address === 0) {
                    this.setACC(value);
                } else {
                    memory.setWord(address_, value);
                }
                this.setOverflow(overflow);
                break;
        }

        this.endBatch();

        if (ir2 >= 4) {
            if (ir1 !== 0) {
                this.fireEvent('dataAccess', address);
            } else if (ir0 !== 0) {
                this.fireEvent('indirectAccess', 90 + address);
                this.fireEvent('dataAccess', address_);
            }
        }
    },

    /**
     * Load canned program
     * @public
     * @param program
     */
    loadProgram: function (program) {
        var i, n = 0;

        var memory = Ext.getStore('Memory');

        this.startBatch();
        this.setACC(program[n++]);
        this.setPC(program[n++]);
        this.setIR(program[n++]);
        this.endBatch();

        for (i = 0; i < 100; ++i) {
            memory.setCellValue(i, program[n++]);
        }
    }
});

/**
 * Store to represent main memory
 */
Ext.define('BDC.store.Memory', {
    extend: 'Ext.data.ArrayStore',
    model: 'BDC.model.MemoryCell',
    autoLoad: true,
    autoSync: true,
    expandData: true,
    data: Array.apply(null, new Array(100)).map(Number.prototype.valueOf, 0),

    getCellValue: function (location) {
        var cell = this.getAt(location % 100);
        return cell.get('value');
    },

    getWord: function (location) {
        var cell0 = this.getCellValue(location);
        var cell1 = this.getCellValue(location + 1);
        return cell0 + 10 * cell1;
    },

    setWord: function (location, value) {
        var v1 = Math.floor(value / 10);
        var v0 = value % 10;
        this.setCellValue(location, v0);
        this.setCellValue(location + 1, v1);
    },

    setCellValue: function (location, value) {
        var cell = this.getAt(location % 100);
        cell.set('value', value % 10);
    },

    clear: function () {
        this.each(function (record) {
            record.set('value', 0);
        });
    },

    loadProgram: function (program) {
        var i;
        for (i = 0; i < 100; ++i) {
            this.setCellValue(i, program[i]);
        }
    }
});

Ext.define('BDC.lib.RegistersPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.registers-panel',
    requires: [ 'BDC.lib.DigitValidator' ],
    title: 'CPU Registers',
    layout: 'vbox',
    bodyPadding: 10,
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
                'keyup': function (field, event) {
                    var code = event.getCharCode(), store;
                    if (code < 48 || code > 57) {
                        event.stopEvent();
                        return;
                    }
                    store = Ext.getStore('Machine');
                    store.setACCRaw(field.getValue());
                },

                'keypress': function (field, event) {
                    var code = event.getCharCode();
                    if (code < 48 || code > 57) {
                        event.stopEvent();
                        return;
                    }

                    var value = field.getValue();
                    if (value.length === 2) {
                        field.setRawValue('');
                    }
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
                'keyup': function (field, event) {
                    var code = event.getCharCode(), store;
                    if (code < 48 || code > 57) {
                        event.stopEvent();
                        return;
                    }
                    store = Ext.getStore('Machine');
                    store.setPCRaw(field.getValue());
                },

                'keypress': function (field, event) {
                    var code = event.getCharCode();
                    if (code < 48 || code > 57) {
                        event.stopEvent();
                        return;
                    }

                    var value = field.getValue();
                    if (value.length === 2) {
                        field.setRawValue('');
                    }
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
                'keyup': function (field, event) {
                    var code = event.getCharCode(), store;
                    if (code < 48 || code > 57) {
                        event.stopEvent();
                        return;
                    }
                    store = Ext.getStore('Machine');
                    store.setIRRaw(field.getValue());
                },

                'keypress': function (field, event) {
                    var code = event.getCharCode();
                    if (code < 48 || code > 57) {
                        event.stopEvent();
                        return;
                    }

                    var value = field.getValue();
                    if (value.length === 3) {
                        field.setRawValue('');
                    }
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

    setACC: function (n) {
        var x, y , component = this.getComponent('ACC');
        x = Math.floor(n / 10) % 10;
        y = n % 10;
        component.setValue(x + '' + y);
    },


    setPC: function (n) {
        var x, y, component = this.getComponent('PC');
        x = Math.floor(n / 10) % 10;
        y = n % 10;
        component.setValue(x + '' + y);
    },

    setIR: function (n) {
        var x, y, z, component = this.getComponent('IR');
        x = Math.floor(n / 100) % 10;
        n = n % 100;
        y = Math.floor(n / 10);
        z = n % 10;
        component.setValue(x + '' + y + '' + z);
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
    width: 130,
    layout: {
        type: 'vbox',
        align: 'center'
    },
    padding: '10 0 0 0',
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
    height: 350,
    border: false,
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

        panel = this.flagsPanel();
        panel.setOverflow(false);
    },

    setStep: function () {
        var panel = this.getComponent('memoryPanel');
        panel.resetGray();

        panel = this.haltPanel();
        panel.clearHalt();
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

    updateMemory: function (record) {
        var panel = this.getComponent('memoryPanel');
        panel.setNCellValue(record.index, record.data.value);
    },

    updateMachine: function (record) {
        var panel = this.registersPanel();
        panel.setACC(record.data.reg_a);
        panel.setPC(record.data.reg_pc);
        panel.setIR(record.data.reg_ir);

        panel = this.flagsPanel();
        panel.setOverflow(record.data.overflow_flag);

        panel = this.haltPanel();
        if (record.data.halted) {
            panel.setHalt();
        } else {
            panel.clearHalt();
        }

        this.highlightInstruction(record.data.reg_pc, BDC.lib.Colors.MAGENTA);
    },

    dataAccess: function (address) {
        this.highlightData(address, BDC.lib.Colors.BLUE);
    },

    indirectAccess: function (address) {
        this.highlightData(address, BDC.lib.Colors.GREEN);
    }
});

Ext.define('BDC.controller.Controller', {
    extend: 'Ext.app.Controller',
    uses: ['BDC.lib.Programs', 'BDC.lib.AssemblerEditor', 'BDC.lib.Disassembler'],
    stores: [ 'Machine', 'Memory', 'Disassembly' ],
    views: [ 'BDC.view.View' ],
    refs: [
        { selector: 'bdc-view', ref: 'BDCView' },
        { selector: 'panel[itemId=bdc-assembler]', ref: 'Assembler' }
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
        var disassembly = this.getDisassemblyStore();

        memory.on('update', disassembly.onUpdateMemory, disassembly);
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
        var store = this.getMemoryStore();

        try {
            memory = editor.assemble();
        } catch (e) {
            message = Ext.String.format("Error: {0}, Line: {1}", e.error, e.line_no);
            Ext.Msg.alert(message);
            return;
        }

        this.onReset();
        store.loadProgram(memory);
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
        TT_LBRACKET: 4, // left bracket
        TT_RBRACKET: 5, // right bracket

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
    tt: undefined,  // current input token type
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
        this.tt = this.self.TT_EMPTY;
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

        while (true) {
            this.getToken();
            switch (this.tt) {
                case this.self.TT_EMPTY:    // empty
                    return;
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
        this.tt = this.self.TT_EMPTY;

        for (this.token = ''; this.i_index < length; ++this.i_index) {
            c = this.program[this.i_index];
            switch (c) {
                case ' ':   // whitespace delimiter
                case '\t':
                case '\r':
                    if (this.token.length) {
                        return;
                    }
                    break;
                case ':':   // label definition
                    if (this.token.length) {
                        this.i_index++;
                        this.tt = this.self.TT_LABEL;
                        return;
                    } else {
                        this.syntax_error();
                    }
                    break;
                case ';':   // comment
                    this.comment();
                    break;
                case '[':   // left bracket
                    if (this.token.length) {
                        return;
                    }
                    this.token = c;
                    this.i_index++;
                    this.tt = this.self.TT_LBRACKET;
                    return;
                case ']':   // right bracket
                    if (this.token.length) {
                        return;
                    }
                    this.token = c;
                    this.i_index++;
                    this.tt = this.self.TT_RBRACKET;
                    return;
                case '\n':  // new line
                    if (this.token.length) {
                        return;
                    }
                    this.line_no++;
                    break;
                default:
                    if (BDC.lib.Character.isdigit(c)) {
                        if (this.tt === this.self.TT_EMPTY) {
                            this.tt = this.self.TT_NUMBER;
                        }
                        this.token += c;
                        continue;
                    } else if (BDC.lib.Character.isalpha(c)) {
                        this.tt = this.self.TT_ID;
                        this.token += c;
                        continue;
                    } else {
                        this.syntax_error();
                    }
                    break;
            }
        }
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
        var value = this.getTarget();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.j;
    },

    /**
     * Jump if overflow set
     * @private
     */
    jo: function () {
        var value = this.getTarget();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.jo;
    },

    /**
     * Jump unless overflow set
     * @private
     */
    jno: function () {
        var value = this.getTarget();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.jno;
    },


    /**
     * Load memory to accumulator
     * @private
     */
    load: function () {
        var value = this.getMemory();
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
        var value = this.getMemory();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.store;
    },

    /**
     * Add value in memory to accumulator
     * @private
     */
    add: function () {
        var value = this.getMemory();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.add;
    },

    /**
     * Subtract value in memory from accumulator
     * @private
     */
    sub: function () {
        var value = this.getMemory();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.sub;
    },

    /**
     * Increment a value in memory or accumulator
     * @private
     */
    inc: function () {
        var value = this.getMemAcc();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.inc;
    },

    /**
     * Decrement a value in memory or accumulator
     * @private
     */
    dec: function () {
        var value = this.getMemAcc();
        this.assemble_val(value);
        this.memory[this.o_index++] = this.self.MNEMONICS.dec;
    },

    /**
     * Get immediate value
     * @private
     * @returns {Number}
     */
    getImmediate: function () {
        this.getToken();
        if (this.tt !== this.self.TT_NUMBER)
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
     * Get memory location
     * @private
     * @return {Number}
     */
    getMemory: function () {
        this.getToken();
        return this.getMemValue();
    },

    /**
     * Get memory value from current input token
     * @private
     * @returns {Number}
     */
    getMemValue: function () {
        var value;

        if (this.tt === this.self.TT_LBRACKET) {    // indirect
            if ((value = this.getIndirect()) === false) {
                this.syntax_error();
            }
            return value;
        }

        if (this.tt !== this.self.TT_NUMBER && this.tt !== this.self.TT_ID) {
            this.syntax_error();
        }

        if (this.tt === this.self.TT_NUMBER) {
            return this.parseValue();
        }

        if ((value = this.self.PSEUDO_REGS[this.token]) === undefined) {
            this.error('undefined symbol');
        }

        return value;
    },

    /**
     * Get memory location or accumulator addressing
     * @private
     * @return {Number}
     */
    getMemAcc: function () {
        this.getToken();

        if (this.tt === this.self.TT_ID && this.token === 'a') {    // accumulator addressing
            return 0;   // special accumulator addressing indicator
        }

        return this.getMemValue();
    },

    /**
     * Get indirect memory reference
     * @private
     * @returns {*}
     */
    getIndirect: function () {
        var value, save;

        this.getToken();
        if (this.tt !== this.self.TT_ID)
            return false;

        save = this.token;
        this.getToken();
        if (this.tt !== this.self.TT_RBRACKET)
            return false;

        // must be w|x|y|z
        if (save.match(/^[w-z]$/) === null)
            return false;

        if ((value = this.self.PSEUDO_REGS[save]) === undefined)
            return false;

        value = value - this.self.PSEUDO_REGS.v;

        return value;
    },

    /**
     * Get branch target
     */
    getTarget: function () {
        var value;
        this.getToken();
        if (this.tt !== this.self.TT_NUMBER && this.tt !== this.self.TT_ID)
            this.syntax_error();

        if (this.tt === this.self.TT_NUMBER) {
            value = this.parseValue();
            value = this.getOffset(value);
            return value;
        }

        if ((value = this.symbols[this.token]) !== undefined) {
            value = this.getOffset(value);
            return value;
        }

        // undefined, generate a forward reference
        this.refs.push({ name: this.token, location: this.o_index, line_no: this.line_no });

        return 0;
    },

    /**
     * Calculate real offset for branch
     * from memory location
     * @param value
     * @returns {Number}
     * @private
     */
    getOffset: function (value) {
        value = ((this.self.PROGRAM_SIZE - this.o_index) + value) - 3;
        value = ((value % this.self.PROGRAM_SIZE) + this.self.PROGRAM_SIZE) % this.self.PROGRAM_SIZE;
        return value;
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
    renderTo: 'bdc-assembler',
    iconCls: 'assemble-icon',
    closable: true,
    width: 600,
    height: 375,
    collapsible: true,
    floating: true,
    draggable: true,
    resizable: true,
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

Ext.define('BDC.lib.Disassembler', {
    extend: 'Ext.grid.Panel',
    itemId: 'bdc-disassembler',
    title: 'BDC Disassembler',
    renderTo: 'bdc-disassembler',
    iconCls: 'disassemble-icon',
    closable: true,
    width: 320,
    height: 400,
    collapsible: true,
    floating: true,
    draggable: true,
    resizable: true,
    statics: {
        show: function () {
            if (Ext.ComponentQuery.query('panel[itemId=bdc-disassembler]')[0])
                return; // shown
            return Ext.create('BDC.lib.Disassembler');
        }
    },
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },

    scroll: 'vertical',
    sortableColumns: false,
    rowLines: false,
    columns: [
        {
            text: 'Location',
            dataIndex: 'location',
            flex: 1,
            draggable: false,
            menuDisabled: true,
            sortable: false,
            resizable: true,
            renderer: function (val) {
                val = val % 100;
                var hi = Math.floor(val / 10);
                var lo = val % 10;
                return Ext.String.format("{0}{1}", hi, lo);
            }
        },
        {
            text: 'Opcode / Operands',
            dataIndex: 'ir',
            flex: 2,
            draggable: false,
            menuDisabled: true,
            sortable: false,
            resizable: true,
            renderer: function (ir) {
                return Ext.String.format("{0} {1} {2}", ir[2], ir[1], ir[0]);
            }
        },
        {
            text: 'Mnemonic Instruction',
            dataIndex: 'instruction',
            flex: 2,
            draggable: false,
            menuDisabled: true,
            sortable: false,
            resizable: true
        }
    ],

    initComponent: function () {
        this.store = Ext.getStore('Disassembly');
        this.callParent(arguments);
    }
});




Ext.define('BDC.lib.Frame', {
    extend: 'Ext.panel.Panel',
    alias: 'bdc-frame',
    itemId: 'bdc-frame',
    title: 'Basic Decimal Computer',
    renderTo: 'bdc-app',
    iconCls: 'cpu-icon',
    width: 625,
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


