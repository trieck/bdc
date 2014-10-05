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
			],
			listeners: {
				selectionchange: {
					fn: function (model, selected) {
						model.view.up().up().down('button[itemId=okButton]').setDisabled(!selected.length);
					},
					scope: this
				}
			}
		}
	], buttons: [
		{
			xtype: 'button',
			text: 'OK',
			disabled: true,
			itemId: 'okButton',
			handler: function () {
				var me = this, model, dlg, machine;
				var grid = me.up().up().down('gridpanel');
				if (grid.getSelectionModel().hasSelection()) {
					model = grid.getSelectionModel().getSelection()[0];

					Ext.Ajax.request({
						url: window.location.origin + '/load.rb?',
						method: 'GET',
						params: { name: model.get('name') },
						success: function (response) {
							dlg = me.up('.window');
							machine = Ext.JSON.decode(response.responseText);
							dlg.controller.loadMachine(machine);
							dlg.close();
						},

						failure: function (response) {
							Ext.Msg.alert(response.responseText);
						}
					});
				}
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