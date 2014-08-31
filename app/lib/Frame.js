Ext.define('BDC.lib.Frame', {
    extend: 'Ext.window.Window',
    alias: 'bdc-frame',
    closable: false,
    title: 'Basic Decimal Computer',
    items: [
        { xtype: 'bdc-view' }
    ],
    resizable: false
});
