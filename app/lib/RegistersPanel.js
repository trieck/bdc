Ext.define('BDC.lib.RegistersPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.registers-panel',
    title: 'CPU Registers',
    columnWidth: .2,
    layout: 'vbox',
    bodyPadding: 10,
    padding: '10px',

    items: [
        {
            xtype: 'textfield',
            itemId: 'ACC',
            fieldLabel: 'A:',
            fieldCls: 'memory-cell',
            labelWidth: 20,
            minLength: 1,
            maxLength: 3,
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
            maxLength: 3,
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
        }
    ],

    clear: function () {
        var component = this.getComponent('ACC');
        component.reset();

        component = this.getComponent('PC');
        component.reset();

        component = this.getComponent('IR');
        component.reset();

    }
});
