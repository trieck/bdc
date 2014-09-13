Ext.define('BDC.lib.Disassembler', {
    extend: 'Ext.panel.Panel',
    itemId: 'bdc-disassembler',
    title: 'BDC Disassembler',
    renderTo: 'bdc-disassembler',
    iconCls: 'disassemble-icon',
    closable: true,
    width: 300,
    height: 400,
    collapsible: true,
    floating: true,
    draggable: true,
    resizable: false,
    statics: {
        show: function () {
            if (Ext.ComponentQuery.query('panel[itemId=bdc-disassembler]')[0])
                return; // shown
            return Ext.create('BDC.lib.Disassembler');
        }
    },
    items: [
        {
            xtype: 'gridpanel',
            itemId: 'disassembler-grid',
            width: 300,
            height: 400,
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true
            },
            scroll: 'vertical',
            columns: [
                {
                    text: 'Location',
                    dataIndex: 'location',
                    width: 100,
                    draggable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    locked: true
                },
                {
                    text: 'Instruction',
                    dataIndex: 'instruction',
                    width: 200,
                    draggable: false,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    locked: true
                }
            ]
        }
    ]
});



