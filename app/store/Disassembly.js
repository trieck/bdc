/**
 * Store to represent disassembled memory
 */
Ext.define('BDC.store.Disassembly', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    autoSync: true,
    statics: {
        ADDRESS_TABLE: {
            2: '[W]',
            4: '[X]',
            6: '[Y]',
            8: '[Z]',
            80: 'Q',
            82: 'R',
            84: 'S',
            86: 'T',
            88: 'U',
            90: 'V',
            92: 'W',
            94: 'X',
            96: 'Y',
            98: 'Z'
        }
    },
    fields: [
        { name: 'location', type: 'int' },
        { name: 'instruction', type: 'string' },
        { name: 'ir', type: 'auto' }
    ],
    data: Array.apply(null, new Array(26)).map(function (el, index) {
        return { location: index * 3, instruction: 'HALT', ir: [ 0, 0, 0 ] };
    }),

    onUpdateMemory: function (store, record, op) {
        if (op === Ext.data.Model.COMMIT) {
            if (record.index > 25 * 3)
                return; // out of range

            this.updateMemory(record);
        }
    },

    updateMemory: function (mem_record) {
        var index = Math.floor(mem_record.index / 3);
        var record = this.getAt(index);
        var pos = mem_record.index % 3;
        var ir = record.get('ir');
        ir[pos] = mem_record.data.value;
        record.set('ir', ir);
        this.format(record);
    },

    format: function (record) {
        var instruction;
        var ir = record.get('ir');
        switch (ir[2]) {
            case 0:
                if (ir[0] === 0 && ir[1] === 0) {
                    instruction = 'HALT';
                } else {
                    instruction = Ext.String.format("J {0}", this.formatTarget(record));
                }
                break;
            case 1:
                instruction = Ext.String.format("JO {0}", this.formatTarget(record));
                break;
            case 2:
                instruction = Ext.String.format("JNO {0}", this.formatTarget(record));
                break;
            case 3:
                instruction = Ext.String.format("LOADI {0}{1}", ir[1], ir[0]);
                break;
            case 4:
                instruction = Ext.String.format("LOAD {0}", this.formatAddress(record));
                break;
            case 5:
                instruction = Ext.String.format("ADD {0}", this.formatAddress(record));
                break;
            case 6:
                instruction = Ext.String.format("SUB {0}", this.formatAddress(record));
                break;
            case 7:
                if (ir[0] === 0 && ir[1] === 0) {
                    instruction = 'OUTPUT';
                } else {
                    instruction = Ext.String.format("STORE {0}", this.formatAddress(record));
                }
                break;
            case 8:
                if (ir[0] === 0 && ir[1] === 0) {
                    instruction = Ext.String.format("INC A");
                } else {
                    instruction = Ext.String.format("INC {0}", this.formatAddress(record));
                }
                break;
            case 9:
                if (ir[0] === 0 && ir[1] === 0) {
                    instruction = Ext.String.format("DEC A");
                } else {
                    instruction = Ext.String.format("DEC {0}", this.formatAddress(record));
                }
                break;
        }

        record.set('instruction', instruction);
    },

    /**
     * Format branch target
     * @param record
     * @returns {String}
     * @private
     */
    formatTarget: function (record) {
        var ir, address, location, value, lo, hi;
        ir = record.get('ir');
        location = record.get('location');
        address = ir[1] * 10 + ir[0];
        value = (location + 3) - (100 - address);
        value = ((value % 100) + 100) % 100;
        hi = Math.floor(value / 10);
        lo = value % 10;

        return Ext.String.format("{0}{1}", hi, lo);
    },

    /**
     * Format address
     * @param record
     * @returns {String}
     * @private
     */
    formatAddress: function (record) {
        var ir = record.get('ir');
        var address = ir[1] * 10 + ir[0];
        var symbol;
        if ((symbol = this.self.ADDRESS_TABLE[address]) !== undefined) {
            return symbol;
        }

        return Ext.String.format("{0}{1}", ir[1], ir[0]);
    }
});

