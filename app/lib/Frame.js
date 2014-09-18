Ext.define('BDC.lib.Frame', {
    extend: 'Ext.panel.Panel',
    alias: 'bdc-frame',
    itemId: 'bdc-frame',
    title: 'Basic Decimal Computer',
    renderTo: 'bdc-app',
    iconCls: 'cpu-icon',
    width: 625,
    height: 375,
    layout: 'fit',
    items: [
        { xtype: 'bdc-view' }
    ],

    initComponent: function () {
        Ext.QuickTips.init();
        this.callParent(arguments);
    }
});
