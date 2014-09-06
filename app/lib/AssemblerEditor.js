Ext.define('BDC.lib.AssemblerEditor', {
    extend: 'Ext.panel.Panel',
    requires: 'BDC.lib.Assembler',
    itemId: 'bdc-assembler',
    title: 'BDC Assembler',
    renderTo: 'bdc-app',
    iconCls: 'assemble-icon',
    closable: true,
    width: 600,
    height: 375,
    collapsible: true,
    statics: {
        show: function () {
            if (Ext.ComponentQuery.query('panel[itemId=bdc-assembler]')[0])
                return; // shown
            return Ext.create('BDC.lib.AssemblerEditor');
        }
    },

    dockedItems: [
        {
            xtype: 'toolbar',
            items: [
                {
                    xtype: 'button',
                    tooltip: { text: 'Assemble Source Code', title: 'Assemble'},
                    text: 'Assemble Source Code',
                    iconCls: 'assemble-icon',
                    focusCls: '',
                    id: 'assembleButton'
                }
            ]
        }
    ],

    items: [
        {
            xtype: 'textarea',
            itemId: 'assembler-text',
            width: 600,
            height: 375,
            fieldStyle: {
                'fontFamily': 'courier new',
                'fontSize': '14px'
            },
            validationEvent: false,
            enableKeyEvents: true,
            listeners: {
                keydown: function (field, e) {
                    if (e.getKey() === e.TAB) {
                        e.stopEvent();
                        field.insertTab();
                    }
                }
            },
            insertTab: function () {
                var el = this.inputEl.dom;
                if (el.setSelectionRange) {
                    var withIns = el.value.substring(0, el.selectionStart) + '\t';
                    var pos = withIns.length;
                    el.value = withIns + el.value.substring(el.selectionEnd, el.value.length);
                    el.setSelectionRange(pos, pos);
                } else if (document.selection) {
                    document.selection.createRange().text = '\t';
                }
            }
        }
    ],

    assembler: Ext.create('BDC.lib.Assembler'),

    assemble: function () {
        var text = this.getComponent('assembler-text');
        var value = text.getValue();
        return this.assembler.assemble(value);
    }
});
