var allTestFiles = [];
var TEST_REGEXP = /(src|dist|spec|bower)/i;
Object.keys(window.__karma__.files).forEach(function(file) {
    console.log(file);
    if (TEST_REGEXP.test(file)) {
        var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
        allTestFiles.push(normalizedTestModule);
    }
});

require.config({
    shim: {
        'chief': {
            exports: 'chief'
        }
    },
    baseUrl: '/base',
    deps: allTestFiles,
    callback: window.__karma__.start
});
