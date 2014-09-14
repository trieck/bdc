/**
 * Model for BDC machine
 */
Ext.define('BDC.model.Machine', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'halted', type: 'boolean' },
        { name: 'overflow_flag', type: 'boolean' },
        { name: 'reg_a', type: 'int' },
        { name: 'reg_pc', type: 'int' },
        { name: 'reg_ir', type: 'int' }
    ]
});