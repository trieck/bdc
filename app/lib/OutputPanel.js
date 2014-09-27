Ext.define('BDC.lib.OutputPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.output-panel',
    requires: 'BDC.lib.OutputDigit',
    title: 'Output',
    bodyPadding: '5 0 0 5',
    padding: '10 0 0 0',
    width: 100,
    height: 60,
    border: true,
    bodyCls: 'output-panel',
    layout: 'hbox',
    items: [
        { xtype: 'output-digit', itemId: 'digit-0' },
        { xtype: 'output-digit', itemId: 'digit-1' },
        { xtype: 'output-digit', itemId: 'digit-2' },
        { xtype: 'output-digit', itemId: 'digit-3' },
        { xtype: 'output-digit', itemId: 'digit-4' },
        { xtype: 'output-digit', itemId: 'digit-5' },
        { xtype: 'output-digit', itemId: 'digit-6' },
        { xtype: 'output-digit', itemId: 'digit-7' },
        { xtype: 'output-digit', itemId: 'digit-8' }
    ],

    /**
     * Clear output panel
     * @public
     */
    clear: function () {
        var digits = this.query('output-digit[itemId^=digit-]');
        Ext.each(digits, function (digit) {
            digit.clear();
        });
    },

    /**
     * Set digit value
     * @param cell
     * @param value
     * @public
     */
    set: function (cell, value) {
        var digit;

        cell = cell % 9;
        digit = this.getComponent('digit-' + cell);
        if (digit) {
            digit.set(value);
        }
    }
});
