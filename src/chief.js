define(
    [
        'q',
        'underscore'
    ],
    function (Q, _) {
        'use strict';
        var module = Q.defer();
        module.resolve();
        return module.promise;
    }
);