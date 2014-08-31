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
                margin: '2px'
            });
        }
    }
});


