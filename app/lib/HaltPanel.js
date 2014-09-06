Ext.define('BDC.lib.HaltPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.halt-panel',
    border: false,
    padding: '10 0 0 0',
    items: [
        {
            xtype: 'image',
            cls: 'halt-icon',
            title: 'Halted'
        }
    ],

    clearHalt: function () {
        this.setVisible(false);
    },

    setHalt: function () {
        this.setVisible(true);
    }
});
