Ext.define('BDC.controller.Controller', {
    extend: 'Ext.app.Controller',
    views: [ 'BDC.view.View' ],
    refs: [
        { selector: 'bdc-view', ref: 'BDCView' }
    ],

    init: function () {
        this.control({
            'bdc-view': {
                afterrender: this.onViewAfterRender
            },
            '#resetButton': {
                click: this.onReset
            }
        });
    },

    onViewAfterRender: function (view) {
        view.reset();
    },

    onReset: function () {
        var view = this.getBDCView();
        view.reset();
    }
});
