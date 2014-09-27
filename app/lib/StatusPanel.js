Ext.define('BDC.lib.StatusPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.status-panel',
    requires: [
        'BDC.lib.RegistersPanel',
        'BDC.lib.FlagsPanel',
        'BDC.lib.HaltPanel',
        'BDC.lib.OutputPanel'
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
            xtype: 'output-panel',
            itemId: 'outputPanel'
        },
        {
            xtype: 'halt-panel',
            itemId: 'haltPanel'
        }
    ]
});
