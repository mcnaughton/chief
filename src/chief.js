var chief = define(
    [
        'q',
        'underscore',
        'src/js/adobe'
    ],
    function (Q, _, adobe) {
        'use strict';
        var module = Q.defer();
        module.resolve();
        return module.promise;
    }
);