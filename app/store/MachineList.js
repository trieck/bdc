/**
 * Store to represent a list of machines
 */
Ext.define('BDC.store.MachineList', {
	extend: 'Ext.data.Store',
	autoLoad: false,
	remoteSort: true,
	fields: [
		{name: 'name', type: 'string'},
		{name: 'date', type: 'date'}
	],

	proxy: {
		type: 'ajax',
		url: './list.rb',
		reader: {
			type: 'json',
			root: 'machines'
		}
	}
});
