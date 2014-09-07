Ext.application({
    name: 'BDC',
    appFolder: 'app',
    controllers: [ 'Controller' ],
    uses: 'BDC.lib.Frame',
    launch: function () {
        Ext.create('bdc-frame').show();
    }
});

$(function () {
    $("#tabs").tabs({
        activate: function (event, ui) {
            var frame;
            if (ui.newTab.index() === 1) {
                frame = Ext.ComponentQuery.query('#bdc-frame')[0];
                frame.doLayout();
            }
        }
    });
});

