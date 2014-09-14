/**
 * Store to represent main memory
 */
Ext.define('BDC.store.Memory', {
    extend: 'Ext.data.ArrayStore',
    model: 'BDC.model.MemoryCell',
    autoLoad: true,
    autoSync: true,
    expandData: true,
    data: Array.apply(null, new Array(100)).map(Number.prototype.valueOf, 0),

    getCellValue: function (location) {
        var cell = this.getAt(location % 100);
        return cell.get('value');
    },

    getWord: function (location) {
        var cell0 = this.getCellValue(location);
        var cell1 = this.getCellValue(location + 1);
        return cell0 + 10 * cell1;
    },

    setWord: function (location, value) {
        var v1 = Math.floor(value / 10);
        var v0 = value % 10;
        this.setCellValue(location, v0);
        this.setCellValue(location + 1, v1);
    },

    setCellValue: function (location, value) {
        var cell = this.getAt(location % 100);
        cell.set('value', value % 10);
    },

    setCellRawValue: function(location, value) {
        this.suspendEvent('update');
        this.setCellValue(location, value);
        this.resumeEvent('update');
    },

    clear: function () {
        this.each(function (record) {
            record.set('value', 0);
        });
    }
});
