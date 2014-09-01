Ext.define('BDC.lib.DigitValidator', function () {

    Ext.apply(Ext.form.field.VTypes, {
        pattern: /^[0-9]$/,

        digit: function (val, field) {
            return this.pattern.test(val);
        },
        digitMask: /[0-9]/
    });

    Ext.apply(Ext.form.field.VTypes, {
        pattern: /^[0-9]*[0-9]$/,

        'two-digits': function (val, field) {
            return this.pattern.test(val);
        },
        'two-digitsMask': /[0-9]/
    });

    Ext.apply(Ext.form.field.VTypes, {
        pattern: /^[0-9]*[0-9]*[0-9]$/,

        'three-digits': function (val, field) {
            return this.pattern.test(val);
        },

        'three-digitsMask': /[0-9]/
    });

    return this;
}());

