Ext.define('BDC.lib.Frame', {
    extend: 'Ext.window.Window',
    alias: 'bdc-frame',
    closable: false,
    title: 'Basic Decimal Computer',
    items: [
        { xtype: 'bdc-view' }
    ],
    resizable: false,

    initComponent: function () {
        Ext.QuickTips.init();
        Ext.tip.Tip.prototype.minWidth = 200;
        this.callParent(arguments);
    }
});
