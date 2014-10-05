/**
 * Machine load dialog class
 */
Ext.define('BDC.lib.MachineLoadDialog', {
	extend: 'Ext.window.Window',
	iconCls: 'database-icon',
	id: 'loadDialog',
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
						Ext.ComponentQuery.query('button[itemId=okButton]')[0].setDisabled(!selected.length);
					},
					scope: this
				},
				itemcontextmenu: function (view, record, item, index, event) {
					var menu = view.up().up().down('.menu');
					var position = event.getXY();
					event.stopEvent();
					menu.showAt(position);
				}
			}
		},
		{
			xtype: 'menu',
			items: [
				{
					text: 'Delete Machine',
					iconCls: 'delete-icon',
					handler: function () {
						var model, grid = Ext.ComponentQuery.query('#machinesPanel')[0];
						if (grid.getSelectionModel().hasSelection()) {
							model = grid.getSelectionModel().getSelection()[0];
							grid.fireEvent('deleteMachine', model);
						}
					}
				}
			]
		}
	],
	buttons: [
		{
			xtype: 'button',
			text: 'OK',
			disabled: true,
			itemId: 'okButton',
			handler: function () {
				var me = this, model, dlg, machine;
				var grid = Ext.ComponentQuery.query('#machinesPanel')[0];
				if (grid.getSelectionModel().hasSelection()) {
					model = grid.getSelectionModel().getSelection()[0];

					Ext.Ajax.request({
						url: window.location.origin + '/cgi-bin/load.rb?',
						method: 'GET',
						params: { name: model.get('name') },
						success: function (response) {
							dlg = me.up('.window');
							machine = Ext.JSON.decode(response.responseText);
							dlg.fireEvent('loadMachine', machine);
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