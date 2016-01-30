requirejs.config({
    timeout: 15,
    catchError: true,
    baseUrl: './',
    map: {},
    paths: {
        'underscore': 'bower_components/underscore/underscore',
        'q': 'bower_components/q/q',
        es6: 'bower_components/requirejs-babel/es6',
        babel: 'bower_components/requirejs-babel/babel-5.8.22.min'
    },
    shim: {
        'q': {
            exports: 'Q'
        },
        'underscore': {
            exports: '_'
        }
    }
});

requirejs(
    [
        'q',
        'underscore'
    ],
    function (Q, _) {
        'use strict';
        var module = Q.defer();

        return module.promise;
    }
);

