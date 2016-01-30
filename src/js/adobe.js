define(['src/js/bridge', 'src/js/load', 'vulcan'], function(bridge, load) {
    var stack = {};
    if (bridge) {
        load.directory("jsx");
        bridge.evalScript("log()", function(){
            console.log("ARGS",arguments);
        });
    }
    return {
        run: function (src, callback) {
            if (!bridge) {
                return false;
            }
            bridge.evalScript(src, callback);
        },
        pub: function (eventName, data) {
            if (!bridge) {
                return false;
            }
            var event = new CSEvent(eventName, "APPLICATION");
            if (!data) {
                data = {};
            }
            event.data = data;
            new bridge.dispatchEvent(event);
        },
        sub: function (eventName, callback) {
            if (!bridge) {
                return false;
            }
            if (!stack[eventName]) {
                bridge.addEventListener(eventName, function (event) {
                    var data = event.data,
                        x,
                        fn,
                        xlen = stack[eventName];
                    for (x = 0; x < xlen; x += 1) {
                        fn = stack[eventName][x];
                        if ("function" === typeof fn) {
                            fn.apply(this, [data]);
                        }
                    }
                });
            }
            stack[eventName] = stack[eventName] || [];
            stack[eventName].push(callback);
        }
    }
});