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

    outputPanel: function () {
        return Ext.ComponentQuery.query('#outputPanel')[0];
    },

    reset: function () {
        var panel = this.getComponent('memoryPanel');
        panel.clear();

        panel = this.registersPanel();
        panel.clear();

        panel = this.flagsPanel();
        panel.setOverflow(false);

        panel = this.haltPanel();
        panel.clearHalt();

        panel = this.outputPanel();
        panel.clear();
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
    },

    output: function (cell, value) {
        var panel = this.outputPanel();
        panel.set(cell, value);
    }
});
