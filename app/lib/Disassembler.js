Ext.define('BDC.lib.Disassembler', {
    extend: 'Ext.grid.Panel',
    itemId: 'bdc-disassembler',
    title: 'BDC Disassembler',
    renderTo: 'bdc-disassembler',
    iconCls: 'disassemble-icon',
    autoShow: true,
    closable: true,
    width: 320,
    height: 400,
    collapsible: true,
    floating: true,
    draggable: true,
    resizable: true,
    statics: {
        show: function () {
            if (Ext.ComponentQuery.query('panel[itemId=bdc-disassembler]')[0])
                return; // shown
            return Ext.create('BDC.lib.Disassembler');
        }
    },
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },

    scroll: 'vertical',
    sortableColumns: false,
    rowLines: false,
    columns: [
        {
            text: 'Location',
            dataIndex: 'location',
            flex: 1,
            draggable: false,
            menuDisabled: true,
            sortable: false,
            resizable: true,
            renderer: function (val) {
                val = val % 100;
                var hi = Math.floor(val / 10);
                var lo = val % 10;
                return Ext.String.format("{0}{1}", hi, lo);
            }
        },
        {
            text: 'Opcode / Operands',
            dataIndex: 'ir',
            flex: 2,
            draggable: false,
            menuDisabled: true,
            sortable: false,
            resizable: true,
            renderer: function (ir) {
                return Ext.String.format("{0} {1} {2}", ir[2], ir[1], ir[0]);
            }
        },
        {
            text: 'Mnemonic Instruction',
            dataIndex: 'instruction',
            flex: 2,
            draggable: false,
            menuDisabled: true,
            sortable: false,
            resizable: true
        }
    ],

    initComponent: function () {
        this.store = Ext.getStore('Disassembly');
        this.callParent(arguments);
    }
});



