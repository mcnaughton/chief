define(['src/js/bridge'], function(csInterface) {
    return {
        file: function (pPath) {
            return csInterface.evalScript('$._ext.evalFile("' + csInterface.getSystemPath(SystemPath.EXTENSION) + pPath + '")');
        },
        directory: function (pFolderPath) {
            return csInterface.evalScript('$._ext.evalFiles("' + csInterface.getSystemPath(SystemPath.EXTENSION) + pFolderPath + '")');
        }
    };
});