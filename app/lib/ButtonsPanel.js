Ext.define('BDC.lib.ButtonsPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.buttons-panel',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    columnWidth: 0.2,
    height: 350,
    title: 'Options',
    padding: '10px',
    items: [
        {
            xtype: 'component',
            flex: 0.5
        },
        {
            xtype: 'button',
            tooltip: { text: 'Step the machine' },
            text: 'STEP',
            focusCls: '',
            id: 'stepButton',
            iconCls: 'step-icon',
            iconAlign: 'top',
            width: '80%',
            flex: 0.6
        },
        {
            xtype: 'component',
            flex: 0.5
        },
        {
            xtype: 'button',
            tooltip: { text: 'Reset the machine' },
            text: 'RESET',
            focusCls: '',
            id: 'resetButton',
            iconCls: 'reset-icon',
            iconAlign: 'top',
            width: '80%',
            flex: 0.6
        },
        {
            xtype: 'component',
            flex: 0.5
        },
        {
            xtype: 'button',
            tooltip: { text: 'Save the machine state' },
            text: 'SAVE',
            disabled: true,
            focusCls: '',
            id: 'saveButton',
            iconCls: 'save-icon',
            iconAlign: 'top',
            width: '80%',
            flex: 0.6
        },
        {
            xtype: 'component',
            flex: 0.10
        },
        {
            xtype: 'button',
            tooltip: { text: 'Load program to the machine' },
            text: 'LOAD',
            focusCls: '',
            id: 'loadButton',
            iconCls: 'load-icon',
            iconAlign: 'top',
            width: '80%',
            flex: 0.6,
            menu: {
                items: [
                    {
                        text: 'Multiply x and y',
                        iconCls: 'tape-icon'
                    },
                    {
                        text: 'Divide x by y',
                        iconCls: 'tape-icon'
                    },
                    {
                        text: 'Add numbers from x up to y',
                        iconCls: 'tape-icon'
                    },
                    {
                        text: 'Generate Fibonacci numbers',
                        iconCls: 'tape-icon'
                    },
                    {
                        text: 'Compute base-2 Logarithm of x',
                        iconCls: 'tape-icon'
                    },
                    {
                        text: 'Add data in array',
                        iconCls: 'tape-icon'
                    }
                ]
            }
        },
        {
            xtype: 'component',
            flex: 1
        }
    ]
});
