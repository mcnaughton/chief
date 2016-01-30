({
    baseUrl: '.',
    packages: [
        {
            name: 'cs',
            location: 'bower_components/require-cs',
            main: 'cs'
        },
        {
            name: 'coffee-script',
            location: 'bower_components/coffeescript',
            main: 'extras/coffee-script'
        }
    ],
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
    },
    include: ['src/chief'],
    out: 'dist',
    name: 'chief',
    mainConfigFile: 'src/chief.js',
    preserveLicenseComments: false,
    optimizeAllPluginResources: true,
    removeCombined: true,
    findNestedDependencies: true,
    optimize: 'none',
    generateSourceMaps: true,
    keepBuildDir: false,
    optimizeCss: 'none',
    inlineText: true,
    pragmasOnSave: {
        excludeCoffeeScript: true
    }
});