Ext.define('BDC.controller.Controller', {
	extend: 'Ext.app.Controller',
	uses: ['BDC.lib.Programs', 'BDC.lib.AssemblerEditor', 'BDC.lib.Disassembler', 'BDC.lib.MachineLoadDialog'],
	stores: [ 'Machine', 'Memory', 'Disassembly', 'MachineList' ],
	views: [ 'BDC.view.View' ],
	refs: [
		{ selector: 'bdc-view', ref: 'BDCView' },
		{ selector: 'panel[itemId=bdc-assembler]', ref: 'Assembler' }
	],

	init: function () {
		this.control({
			'bdc-view': {
				afterrender: this.onReset
			},
			'#assemblerButton': {
				click: this.onAssembler
			},
			'#disassemblerButton': {
				click: this.onDisassembler
			},
			'#assembleButton': {
				click: this.onAssemble
			},
			'#resetButton': {
				click: this.onReset
			},
			'#stepButton': {
				click: this.onStep
			},
			'#loadMachineButton': {
				click: this.onLoadMachine
			},
			'#saveButton': {
				click: this.onSave
			},
			'#programOne': {
				click: this.onProgramOne
			},
			'#programTwo': {
				click: this.onProgramTwo
			},
			'#programThree': {
				click: this.onProgramThree
			},
			'#programFour': {
				click: this.onProgramFour
			},
			'#programFive': {
				click: this.onProgramFive
			},
			'#programSix': {
				click: this.onProgramSix
			}
		});
	},

	onLaunch: function () {
		var memory = this.getMemoryStore();
		var machine = this.getMachineStore();
		var disassembly = this.getDisassemblyStore();

		memory.on('update', disassembly.onUpdateMemory, disassembly);
		memory.on('update', this.onUpdateMemory, this);

		machine.on('update', this.onUpdateMachine, this);
		machine.on('dataAccess', this.onDataAccess, this);
		machine.on('indirectAccess', this.onIndirectAccess, this);
		machine.on('output', this.onOutput, this);
	},

	onUpdateMemory: function (store, record, op) {
		if (op === Ext.data.Model.COMMIT) {
			this.getBDCView().updateMemory(record);
		}
	},

	onUpdateMachine: function (store, record, op) {
		if (op === Ext.data.Model.COMMIT) {
			this.getBDCView().updateMachine(record);
		}
	},

	onDataAccess: function (address) {
		this.getBDCView().dataAccess(address);
	},

	onIndirectAccess: function (address) {
		this.getBDCView().indirectAccess(address);
	},

	onOutput: function (cell, value) {
		this.getBDCView().output(cell, value);
	},

	onAssembler: function () {
		BDC.lib.AssemblerEditor.show();
	},

	onDisassembler: function () {
		BDC.lib.Disassembler.show();
	},

	onAssemble: function () {
		var memory, message, editor = this.getAssembler();
		var store = this.getMemoryStore();

		try {
			memory = editor.assemble();
		} catch (e) {
			message = Ext.String.format("Error: {0}, Line: {1}", e.error, e.line_no);
			Ext.Msg.alert('Error', message);
			return;
		}

		this.onReset();
		store.loadProgram(memory);
	},

	onReset: function () {
		var view = this.getBDCView();
		var memory = this.getMemoryStore();
		var machine = this.getMachineStore();

		memory.clear();
		machine.reset();
		view.reset();
	},

	onStep: function () {
		var view = this.getBDCView();
		var machine = this.getMachineStore();

		view.setStep();
		machine.step();
	},

	onLoadMachine: function () {
		var dialog = new BDC.lib.MachineLoadDialog({controller: this});
	},

	onSave: function () {
		var machine, memory;
		var state = {};
		var result, i;

		Ext.MessageBox.prompt('Save Machine State', 'Please enter a name:', function (buttonId, name) {
			name = name.trim();

			if (buttonId === 'ok' && name.length > 0) {
				machine = this.getMachineStore();
				memory = this.getMemoryStore();

				state.name = name;
				state.halted = machine.getHalted();
				state.overflow_flag = machine.getOverflow();
				state.reg_a = machine.getACC();
				state.reg_pc = machine.getPC();
				state.reg_ir = machine.getIR();
				state.memory = [];
				for (i = 0; i < 100; ++i) {
					state.memory[i] = memory.getCellValue(i);
				}

				Ext.Ajax.request({
					url: window.location.origin + '/cgi-bin/save.rb?',
					method: 'POST',
					params: { machine: Ext.JSON.encode(state) },
					success: function () {
						Ext.Msg.alert('Success', 'Machine saved successfully.');
					},
					failure: function (response) {
						result = Ext.JSON.decode(response.responseText);
						Ext.Msg.alert('Save Error', result.result);
					}
				});
			}
		}, this);
	},

	onProgramOne: function () {
		this.loadProgram(BDC.lib.Programs.PROGRAM_ONE);
	},

	onProgramTwo: function () {
		this.loadProgram(BDC.lib.Programs.PROGRAM_TWO);
	},

	onProgramThree: function () {
		this.loadProgram(BDC.lib.Programs.PROGRAM_THREE);
	},

	onProgramFour: function () {
		this.loadProgram(BDC.lib.Programs.PROGRAM_FOUR);
	},

	onProgramFive: function () {
		this.loadProgram(BDC.lib.Programs.PROGRAM_FIVE);
	},

	onProgramSix: function () {
		this.loadProgram(BDC.lib.Programs.PROGRAM_SIX);
	},

	loadProgram: function (program) {
		var machine = this.getMachineStore();
		this.onReset();
		machine.loadProgram(program);
	},

	loadMachine: function (machine) {
		var machineStore, memoryStore;

		machineStore = this.getMachineStore();
		memoryStore = this.getMemoryStore();

		this.onReset();

		machineStore.setHalted(machine.halted);
		machineStore.setOverflow(machine.overflow_flag);
		machineStore.setACC(machine.reg_a);
		machineStore.setPC(machine.reg_pc);
		machineStore.setIR(machine.reg_ir);

		memoryStore.loadProgram(machine.memory);
	}
});
