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
