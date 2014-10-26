Ext.define('BDC.lib.ButtonsPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.buttons-panel',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    width: 140,
    height: 350,
    title: 'Options',
    padding: '10 10 10 15',
    items: [
        {
            border: false,
            flex: 0.2
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
            border: false,
            flex: 0.2
        },
        {
            xtype: 'button',
            tooltip: { text: 'Load Program/Machine' },
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
                        text: 'Canned Programs',
                        iconCls: 'can-icon',
                        menu: {
                            plain: true,
                            items: [
                                {
                                    text: 'Multiply X and Y',
                                    id: 'programOne',
                                    iconCls: 'tape-icon'
                                },
                                {
                                    text: 'Divide X by Y',
                                    id: 'programTwo',
                                    iconCls: 'tape-icon'
                                },
                                {
                                    text: 'Add numbers from X up to Y',
                                    id: 'programThree',
                                    iconCls: 'tape-icon'
                                },
                                {
                                    text: 'Generate Fibonacci numbers',
                                    id: 'programFour',
                                    iconCls: 'tape-icon'
                                },
                                {
                                    text: 'Compute base-2 Logarithm of X',
                                    id: 'programFive',
                                    iconCls: 'tape-icon'
                                },
                                {
                                    text: 'Add data in array',
                                    id: 'programSix',
                                    iconCls: 'tape-icon'
                                }
                            ]
                        }
                    },
                    {
                        text: 'Program from Text...',
                        iconCls: 'text-icon',
                        id: 'loadTextButton'
                    },
                    {
                        text: 'From Database...',
                        iconCls: 'database-icon',
                        id: 'loadMachineButton'
                    }
                ]
            }
        },
        {
            border: false,
            flex: 0.10
        },
        {
            xtype: 'button',
            tooltip: { text: 'Save Program/Machine' },
            text: 'SAVE',
            focusCls: '',
            id: 'saveButton',
            iconCls: 'save-icon',
            iconAlign: 'top',
            width: '80%',
            flex: 0.6,
            menu: [
                {
                    text: 'Program to Text...',
                    iconCls: 'text-icon',
                    id: 'saveTextButton'
                },
                {
                    text: 'To Database...',
                    iconCls: 'database-icon',
                    id: 'saveMachineButton'
                }
            ]
        },
        {
            border: false,
            flex: 0.2
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
            border: false,
            flex: 0.2
        },
        {
            xtype: 'button',
            tooltip: { text: 'Launch Assembler Editor' },
            text: 'ASSEMBLER',
            focusCls: '',
            id: 'assemblerButton',
            iconCls: 'assemble-icon',
            iconAlign: 'top',
            width: '80%',
            flex: 0.6
        },
        {
            border: false,
            flex: 0.10
        },
        {
            xtype: 'button',
            tooltip: { text: 'Launch Disassembler' },
            text: 'DISASSEMBLER',
            focusCls: '',
            id: 'disassemblerButton',
            iconCls: 'disassemble-icon',
            iconAlign: 'top',
            width: '80%',
            flex: 0.6
        },
        {
            border: false,
            flex: 0.2
        }
    ]
});
