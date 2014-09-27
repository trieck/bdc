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
     * Output value in accumulator
     * at cell stored in pseudo-register Q
     * @private
     */
    output: function () {
        var memory = Ext.getStore('Memory');
        var q = memory.getCellValue(80);  // Q pseudo-register
        this.fireEvent('output', q, this.getACC());
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
                } else {
                    this.output();
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
