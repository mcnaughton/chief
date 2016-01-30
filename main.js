({
    appDir: '.',
    baseUrl: '.',
    map: {},
    paths: {
        'q': 'bower_components/q/q',
        'underscore': 'bower_components/underscore/underscore',
        'node_modules': 'empty:',
        'bower_components': 'empty:'
    },
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

    modules: [
        {
            name: 'src/chief',
            include: [
                'q',
                'underscore'
            ]
        }
    ],
    dir: 'dist',
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