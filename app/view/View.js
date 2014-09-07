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
                this.of = acc + value_ > 100;
                registersPanel.setACCN((acc + value_) % 100);
                flagsPanel.setOverflow(this.of);
                break;
            case 6:      // subtract from accumulator
                this.of = acc < value_;
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
                this.of = value_ === 99;
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
                this.of = value_ === 0;
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
