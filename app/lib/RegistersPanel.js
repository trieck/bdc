Ext.define('BDC.lib.RegistersPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.registers-panel',
    requires: [ 'BDC.lib.DigitValidator' ],
    title: 'CPU Registers',
    layout: 'vbox',
    bodyPadding: 10,
    items: [
        {
            xtype: 'textfield',
            itemId: 'ACC',
            fieldLabel: 'A:',
            fieldCls: 'memory-cell',
            labelCls: 'register-label',
            labelWidth: 20,
            minLength: 1,
            maxLength: 2,
            selectOnFocus: true,
            emptyText: '00',
            vtype: 'two-digits',
            enableKeyEvents: true,
            listeners: {
                'keyup': function(field, event) {
                    var code = event.getCharCode(), store;
                    if (code < 48 || code > 57) {
                        event.stopEvent();
                        return;
                    }
                    store = Ext.getStore('Machine');
                    store.setACCRaw(field.getValue());
                },

                'keypress': function (field, event) {
                    var code = event.getCharCode();
                    if (code < 48 || code > 57) {
                        event.stopEvent();
                        return;
                    }

                    var value = field.getValue();
                    if (value.length === 2) {
                        field.setRawValue('');
                    }
                }
            },
            width: 75
        },
        {
            xtype: 'textfield',
            itemId: 'PC',
            fieldLabel: 'PC:',
            fieldCls: 'memory-cell',
            labelCls: 'register-label',
            labelWidth: 20,
            minLength: 1,
            maxLength: 2,
            selectOnFocus: true,
            emptyText: '00',
            vtype: 'two-digits',
            enableKeyEvents: true,
            listeners: {
                'keyup': function(field, event) {
                    var code = event.getCharCode(), store;
                    if (code < 48 || code > 57) {
                        event.stopEvent();
                        return;
                    }
                    store = Ext.getStore('Machine');
                    store.setPCRaw(field.getValue());
                },

                'keypress': function (field, event) {
                    var code = event.getCharCode();
                    if (code < 48 || code > 57) {
                        event.stopEvent();
                        return;
                    }

                    var value = field.getValue();
                    if (value.length === 2) {
                        field.setRawValue('');
                    }
                }
            },
            width: 75
        },
        {
            xtype: 'textfield',
            itemId: 'IR',
            fieldLabel: 'IR:',
            fieldCls: 'memory-cell',
            labelCls: 'register-label',
            labelWidth: 20,
            minLength: 1,
            maxLength: 3,
            selectOnFocus: true,
            emptyText: '000',
            vtype: 'three-digits',
            enableKeyEvents: true,
            listeners: {
                'keyup': function(field, event) {
                    var code = event.getCharCode(), store;
                    if (code < 48 || code > 57) {
                        event.stopEvent();
                        return;
                    }
                    store = Ext.getStore('Machine');
                    store.setIRRaw(field.getValue());
                },

                'keypress': function (field, event) {
                    var code = event.getCharCode();
                    if (code < 48 || code > 57) {
                        event.stopEvent();
                        return;
                    }

                    var value = field.getValue();
                    if (value.length === 3) {
                        field.setRawValue('');
                    }
                }
            },
            width: 75
        }
    ],

    clear: function () {
        var component = this.getComponent('ACC');
        component.reset();

        component = this.getComponent('PC');
        component.reset();

        component = this.getComponent('IR');
        component.reset();
    },

    setACC: function (n) {
        var x, y , component = this.getComponent('ACC');
        x = Math.floor(n / 10) % 10;
        y = n % 10;
        component.setValue(x + '' + y);
    },


    setPC: function (n) {
        var x, y, component = this.getComponent('PC');
        x = Math.floor(n / 10) % 10;
        y = n % 10;
        component.setValue(x + '' + y);
    },

    setIR: function (n) {
        var x, y, z, component = this.getComponent('IR');
        x = Math.floor(n / 100) % 10;
        n = n % 100;
        y = Math.floor(n / 10);
        z = n % 10;
        component.setValue(x + '' + y + '' + z);
    }
});
