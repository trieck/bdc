Ext.application({
    name: 'BDC',
    appFolder: 'app',
    controllers: [ 'Controller' ],
    uses: 'BDC.lib.Frame',

    launch: function () {
        Ext.create('bdc-frame').show();
    }
});
