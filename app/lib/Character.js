Ext.define('BDC.lib.Character', {
    statics: {
        isalpha: function (c) {
            return (((c >= 'a') && (c <= 'z')) || ((c >= 'A') && (c <= 'Z')));
        },

        isdigit: function (c) {
            return ((c >= '0') && (c <= '9'));
        },

        isalnum: function (c) {
            return (this.isalpha(c) || this.isdigit(c));
        }
    }
});
