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