Ext.define('BDC.lib.FlagsPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.flags-panel',
    title: 'CPU Flags',
    layout: 'vbox',
    bodyPadding: 10,
    padding: '10 0 0 0',
    width: 100,
    items: [
        {
            itemId: 'overflow-flag',
            html: 'OF:',
            baseCls: 'register-label',
            width: 75
        }
    ],

    setOverflow: function (flag) {
        var component = this.getComponent('overflow-flag');

        if (flag === true) {
            component.update('OF: 1');
        } else {
            component.update('OF: 0');
        }
    }
});
