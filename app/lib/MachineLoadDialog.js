/**
 * Machine load dialog class
 */
Ext.define('BDC.lib.MachineLoadDialog', {
	extend: 'Ext.window.Window',
	iconCls: 'database-icon',
	modal: true,
	autoShow: true,
	width: 400,
	height: 300,
	shadow: true,
	resizable: false,
	buttonAlign: 'right',
	title: 'Load Machine',
	layout: 'fit',
	items: [
		{
			xtype: 'gridpanel',
			itemId: 'machinesPanel',
			autoHeight: true,
			columns: [
				{
					text: 'Name',
					flex: 2,
					dataIndex: 'name',
					draggable: false,
					menuDisabled: true,
					sortable: true,
					resizable: true
				},
				{
					text: 'Date',
					xtype: 'datecolumn',
					format: 'm-d h:i a',
					flex: 1,
					dataIndex: 'date',
					draggable: false,
					menuDisabled: true,
					sortable: true,
					resizable: true
				}
			]
		}
	], buttons: [
		{
			xtype: 'button',
			text: 'OK',
			handler: function () {
				this.up('.window').close();
			}
		},
		{
			xtype: 'button',
			text: 'Cancel',
			handler: function () {
				this.up('.window').close();
			}
		}
	],

	initComponent: function () {
		var panel, store = Ext.getStore('MachineList');

		this.callParent(arguments);

		panel = this.getComponent('machinesPanel');
		panel.reconfigure(store);
		store.load();
	}
});