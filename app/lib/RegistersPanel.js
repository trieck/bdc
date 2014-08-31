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
