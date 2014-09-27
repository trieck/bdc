/**
 * Digit class that supports
 * decimal digits and a select
 * set of alpha characters
 */
Ext.define('BDC.lib.OutputDigit', {
    extend: 'Ext.container.Container',
    alias: 'widget.output-digit',
    statics: {
        // each entry in the character set table is a binary string
        // of the form 'TOP TOP-RIGHT BOTTOM-RIGHT BOTTOM BOTTOM-LEFT TOP-LEFT MIDDLE'
        CHAR_SET: [
            '1111110',  /* 0 */
            '0110000',  /* 1 */
            '1101101',  /* 2 */
            '1111001',  /* 3 */
            '0110011',  /* 4 */
            '1011011',  /* 5 */
            '0011111',  /* 6 */
            '1110000',  /* 7 */
            '1111111',  /* 8 */
            '1111011',  /* 9 */
            '1110111',  /* A */
            '1001110',  /* C */
            '1001111',  /* E */
            '1000111',  /* F */
            '1011110',  /* G */
            '0110111',  /* H */
            '1111000',  /* J */
            '0001110',  /* L */
            '1110110',  /* N */
            '1100111',  /* P */
            '0111110',  /* U */
            '0000000'  /* {clear} */
        ]
    },
    width: 10,
    height: 14,
    padding: 1,
    componentCls: 'output-digit',
    items: [
        { xtype: 'component', componentCls: 'digit-section digit-middle', itemId: 'section-0' },
        { xtype: 'component', componentCls: 'digit-section digit-top-left', itemId: 'section-1' },
        { xtype: 'component', componentCls: 'digit-section digit-bottom-left', itemId: 'section-2' },
        { xtype: 'component', componentCls: 'digit-section digit-bottom', itemId: 'section-3' },
        { xtype: 'component', componentCls: 'digit-section digit-bottom-right', itemId: 'section-4' },
        { xtype: 'component', componentCls: 'digit-section digit-top-right', itemId: 'section-5' },
        { xtype: 'component', componentCls: 'digit-section digit-top', itemId: 'section-6' }
    ],

    clear: function() {
        var sections = this.query('component[itemId^=section-]');
        Ext.each(sections, function (section) {
            section.setVisible(false);
        });
    },

    /**
     * Set digit value
     * @param value
     * @public
     */
    set: function (value) {
        var i, n, entry, section;

        value = value % this.self.CHAR_SET.length;
        entry = this.self.CHAR_SET[value];
        n = parseInt(entry, 2);

        for (i = 0; i < 7; ++i) {
            section = this.getComponent('section-' + i);
            if (n & (1 << i)) {
                section.setVisible(true);
            } else {
                section.setVisible(false);
            }
        }
    }
});
