Ext.define('BDC.lib.MemoryPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.memory-panel',
    title: 'Main Memory',
    columnWidth: .6,
    height: 350,
    layout: {
        type: 'table',
        columns: 11
    },
    padding: '10px',
    statics: {
        MAGENTA: 'FF00FF'
    },

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
                maxLength: 3,
                fieldCls: 'memory-cell',
                selectOnFocus: true,
                emptyText: '0',
                width: 25,
                itemId: 'memory-cell-' + i,
                margin: '2px'
            });
        }
    },

    clear: function () {
        var items = this.query('textfield[itemId^=memory-cell]');
        Ext.each(items, function (item) {
            item.reset();
            item.setFieldStyle('color: darkgrey;');
            item.setValue('0');
        });
        this.highlightInstruction(0, this.self.MAGENTA);
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
        var index = i * 10 + j;
        var id = Ext.String.format('memory-cell-{0}', index);
        var component = this.getComponent(id);
        var style = Ext.String.format('color: #{0};', color);

        component.setFieldStyle(style);
    }
});


