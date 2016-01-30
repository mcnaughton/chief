define([], function() {
    var bridge;
    if (!!window.__adobe_cep__) {
        requirejs(['csinterface'], function(CSInterface) {
            bridge = new CSInterface();
        })
    }
    return bridge;
});