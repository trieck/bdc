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
        store.setCellValue(this.cellId, code - 48);

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
                cellId: i,
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


