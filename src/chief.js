requirejs.config({
    timeout: 15,
    catchError: true,
    baseUrl: './',
    map: {},
    paths: {

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
window.requirejs(
    [
        'q',
        'underscore',

    ],
    function (Q, _, storage, layout, React, ReactDOM, state, FastClick, lazyData, err, menuBuilder, utils, is, dispatch, pushStateModule, notify, bugsnag, upgrade, stripe, jQuery) {
        'use strict';
        var module = Q.defer();

        window.requirejs.onError = function (errorObj) {
            if (utils.exists(errorObj)) {
                err.log(errorObj.requireType, 'RequireJSError', {
                    requireModules: errorObj.requireModules
                });
            } else {
                err.log('Unknown', 'RequireJSError');
            }
        };

        /*
         'src/module/location',
         'src/module/accounts,
         */
        /*
         */
        window.requirejs([
            'src/ui/ads',
            'src/ui/content',
            'src/ui/subheader',
            'src/ui/right',
            'src/ui/left',
            'src/ui/middle_right',
            'src/ui/middle_left',
            'src/ui/top_right',
            'src/ui/top_left',
            'src/ui/bottom_right',
            'src/ui/bottom_left',
            'src/ui/header',
            'src/ui/bottom',
            'src/ui/loader',
            'src/ui/issues',
            'src/ui/footer',
            'src/module/fonts'
        ], function () {
            var deferred = Q.defer(),
                components = [],
                modules = Array.prototype.slice.apply(arguments, [0]),
                loaded = 0,
                json = window.JSON,
                animating = true,
                staticBootstrap,
                incomingNativeMessage = function (data) {
                    var context = utils.clone(lastState);
                    console.log('Native app incoming', data.name);
                    context.message = data;
                    animating = false;
                    if ('location' === data.name) {
                        context.previousLocation = context.currentLocation;
                        context.currentLocation = data.data;
                        console.log('Updated app location', context.currentLocation);
                    } else if ('subscription' === data.name) {
                        context = context || {};
                        context.subscription = data.data;
                    } else if ('beacon' === data.name) {
                        context = context || {};
                        context.beaconUpdate = Date.now();
                        context.previousBeacon = context.currentBeacon;
                        context.currentBeacon = data.data;
                    } else if ('foreground' === data.name) {
                        context = context || {};
                        context.foregroundUpdate = Date.now();
                        context.background = false;
                        context.foreground = true;
                    } else if ('background' === data.name) {
                        context = context || {};
                        context.backgroundUpdate = Date.now();
                        context.background = true;
                        context.foreground = false;
                    } else if ('reachable' === data.name) {
                        context = context || {};
                        context.reachableUpdate = Date.now();
                        context.reachable = true;
                        context.unreachable = false;
                    } else if ('unreachable' === data.name) {
                        context = context || {};
                        context.reachable = false;
                        context.unreachable = true;
                    } else if ('pushtoken' === data.name) {
                        context = context || {};
                        context.pushTokenUpdate = Date.now();
                        context.pushToken = data.data;
                    } else if ('settings' === data.name) {
                        context = context || {};
                        context.settingsUpdate = Date.now();
                        context.beaconing = data.data.beaconing;
                        context.notifying = data.data.notifying;
                        context.geolocating = data.data.geolocating;
                        context.hyperlocal = data.data.hyperlocal;
                        context.subscriptionLevel = data.data.subscription;
                        context.ipad = data.data.ipad;
                    } else if ('go' === data.name) {
                        window.location = data.data;
                    }
                    propagateState(context, function() {
                        animating = true;
                    });

                },
                setupComments = function(context) {
                    if (is.isSingular(context)) {
                        if (utils.exists(context.data)) {
                            window.decom_post_id = context.data.ID;
                        }
                        if (utils.exists(context.user)) {
                            window.decom_user_id = context.user.ID;
                        }
                        window.decom_plugin_url = '/wp-content/plugins/decomments/comments/assets';
                        window.decom_post_url = context.data.post_url;
                        window.decom_comments_last_page = utils.exists(context.comments_lastpage) ? (context.comments_lastpage) : null;
                        window.decom_position_form = 1;
                        window.decom_comment_single_translate = 'comment';
                        window.decom_comment_twice_translate = 'twice';
                        window.decom_comment_plural_translate = 'comments';
                        window.decomSettings = window.decomSettings || {};
                        if (utils.exists(context.site)) {
                            window.decomSettings.site_url = context.site.url;
                        }

                    }
                },
                createFactory = React.createFactory || function () {},
                lastNativeDataUpdate,
                lastNativeIssuesUpdate,
                foothold = document.getElementById('app'),
                fiddle = function (patch) {
                    propagateState(_.extend(lastState, patch));
                },
                doSave = function(incoming) {
                    var ctx = utils.clone(incoming),
                        thin = [],
                        stackCt,
                        issuesThin = [],
                        stackItem,
                        el,
                        clearNative = false,
                        issues = utils.exists(ctx.issues) ? ctx.issues : [],
                        stack = is.isSearch(ctx) ? ctx.query : ctx.stream,
                        stackCount;

                    if (utils.isEmpty(ctx)) {
                        return;
                    }

                    delete ctx.auth;

                    pushStateModule.replace(ctx, null, true);

                    if (utils.exists(ctx)) {
                        if (utils.exists(storage) && utils.exists(storage.local)) {
                            storage.local.update.entry('context-' + ctx.site.publisher_id, json.stringify(ctx));
                        }
                    }

                    if (ctx.isNative && lastNativeDataUpdate != ctx.dataUpdated) {
                        stack = utils.isArray(stack) ? stack : [];
                        stackCount = stack.length;
                        for (stackCt = 0; stackCt < Math.max(stackCount, 7); stackCt += 1) {
                            stackItem = stack[stackCt];
                            if (utils.exists(stackItem)) {
                                el = {
                                    post_title: stackItem.post_title,
                                    post_url: stackItem.post_url
                                };
                                if (utils.exists(stackItem.post_featured) && utils.exists(stackItem.post_featured.media_url_large)) {
                                    el.media_url_large = stackItem.post_featured.media_url_large;
                                }
                                thin.push(el);
                            }
                        }
                        stackCount = issues.length;
                        for (stackCt = 0; stackCt < Math.max(stackCount, 7); stackCt += 1) {
                            stackItem = issues[stackCt];
                            if (utils.exists(stackItem)) {
                                el = {
                                    post_title: stackItem.post_title,
                                    post_url: stackItem.post_url
                                };
                                if (utils.exists(stackItem.post_featured) && utils.exists(stackItem.post_featured.media_url_large)) {
                                    el.media_url_large = stackItem.post_featured.media_url_large;
                                }
                                issuesThin.push(el);
                            }
                        }
                        if (utils.exists(thin) || clearNative) {
                            lastNativeDataUpdate = ctx.streamUpdate;
                            if (utils.exists(thin)) {
                                notify('watch', {
                                    watch: thin
                                });
                            }
                        }
                        if (utils.exists(issuesThin) || clearNative) {
                            lastNativeIssuesUpdate = ctx.issuesUpdate;
                            if (utils.exists(issuesThin)) {
                                notify('issues', {
                                    issues: issuesThin
                                });
                            }
                        }

                    }

                },

                pacedSave = _.throttle(function () {
                    doSave(lastState);
                }, 5000),
                throttledSave = _.throttle(function () {
                    doSave(lastState);
                }, 20000),
                slowSave = _.throttle(function () {
                    doSave(lastState);
                }, 60000),
                lazyNotification = _.throttle(function (cloned, notif) {
                    module.notify(cloned);
                    if (utils.isFunction(notif)) {
                        notif(cloned);
                    }
                }, 5000),
                factory,
                dataStore = {},
                lastDataUpdate,
                savedOnce = false,
                lastState,
                propagateState = function (ctx, callback) {

                    animating = false;

                    if (utils.isEmpty(ctx)) {
                        ctx = {};
                    }

                    if (utils.exists(this) && utils.exists(utils.exists(this.props))) {
                        ctx.updated = Date.now();
                        if (utils.exists(ctx.menus) && utils.isEmpty(ctx.builtMenus)) {
                            ctx.builtMenus = menuBuilder(ctx.menus);
                        }
                    }

                    ctx.current = layout.current(ctx);
                    ctx.hearts = storage.user.hearts();
                    ctx.stars = storage.user.stars();

                    window.mcnaughton = _.extend({
                        '__': fiddle,
                        upgrade: upgrade,
                        incoming: incomingNativeMessage
                    }, ctx);

                    lastState = ctx;

                    lazyData(ctx).then(function (results) {
                        dataStore = results;
                        savedOnce = false;
                    });
                    ctx = _.extend(ctx, dataStore);

                    ReactDOM.render(factory(ctx), foothold, function () {
                        if (utils.isFunction(callback)) {
                            callback(ctx);
                        }
                        animating = true;
                    });

                    pushStateModule.noop(ctx.ads);
                    deferred.notify('state', ctx);

                    try {
                        if ((utils.exists(ctx.user) && utils.exists(ctx.user.ID) && 0 !== ctx.user.ID && false === is.isRestricted(ctx))) {
                            storage.user.reconfig(ctx.user, ctx.site.publisher_id, ctx.offsets.stream, ctx.limits.stream, fiddle);
                        }
                    } catch(e) {
                        //bugsnag.error(e);
                    }

                    if (true !== ctx.isActive) {
                        lazyNotification(ctx);
                        slowSave();
                    } else if (true !== ctx.foreground) {
                        throttledSave();
                    } else {
                        pacedSave();
                    }

                },
                doScrollUpdate = function (x, y, height, width, initialState, updateTime, activeState, timeUpdate) {
                    var props = initialState || lastState || (utils.exists(this) ? this.props : {}),
                        clone = utils.exists(initialState) ? initialState : utils.clone(props);
                    if (utils.isEmpty(clone)) {
                        return;
                    }
                    if (utils.exists(activeState)) {
                        clone = _.extend(clone, activeState);
                    }
                    layout.invalidate();
                    clone.screen = clone.screen || {};
                    clone.screen.width = width || 0;
                    clone.screen.height = height || 0;
                    clone.scroll = clone.scroll || {};
                    clone.scroll.y = y || 0;
                    clone.scroll.x = x || 0;
                    clone.lastScrollUpdate = updateTime;
                    clone.animationTime = updateTime;
                    if (true === timeUpdate) {
                        clone.issuesMinorUpdate = Date.now();
                        clone.streamMinorUpdate = clone.issuesMinorUpdate;
                    }
                    propagateState(clone);
                },
                ready = function () {
                    var clone = _.extend(state, window.mcnaughton),
                        maxIterations = 2,
                        updateTimes,
                        pro,
                        def,
                        handleAuth = function(response) {
                            console.log('auth changed');
                            var clone = utils.clone(lastState);
                            clone.auth = response;
                            dispatch(clone, null, true);
                        },
                        pixelSensitivity = 10,
                        pixelSensitivityY = 10,
                        updateInterval = 1000,
                        maxInterval = 20480,
                        timeUpdateInterval = 300000,
                        lastUpdateTime,
                        lastUpdate,
                        activeState = {},
                        matches = window.location.pathname.match(/page\/(\d{1,})\/?/),
                        animationLoop = function (updateTime, initialState, noLoop) {
                            var y = window.scrollY,
                                x = window.scrollX,
                                timeUpdate = false,
                                height = window.innerHeight,
                                width = window.innerWidth,
                                updated = false,
                                currentUpdate = '_' + (updateTime - (updateTime % updateInterval)) + (y - (y % pixelSensitivity)) +
                                    (x - (x % pixelSensitivity)) + height + width,
                                timeoutThreshold = 5000,
                                currentScrollUpdate = '_' + (y % pixelSensitivityY) +
                                    (x % pixelSensitivity) + height + width,
                                isActive,
                                newlyActive = false,
                                newlyInactive = false;

                            if (true !== noLoop) {
                                window.requestAnimFrame(animationLoop);
                            }

                            isActive = currentScrollUpdate !== activeState.lastActivityUpdate;

                            //Hide the header when the user is active, but not when the mouse
                            //y position is <= header_height
                            if (isActive && !activeState.isActive) {
                                newlyActive = true;
                            } else if ((updateTime - activeState.lastActivityUpdateTime) >= timeoutThreshold && activeState.isActive) {
                                newlyInactive = true;
                                activeState.lastActivityUpdate = currentScrollUpdate;
                                activeState.lastActivityUpdateTime = updateTime;
                            }

                            if (isActive) {
                                activeState.lastActivityUpdate = currentScrollUpdate;
                                activeState.lastActivityUpdateTime = updateTime;
                            }

                            if (newlyInactive) {
                                activeState.isInactive = true;
                                activeState.isActive = false;
                                notify('inactive', null);
                            } else if (newlyActive) {
                                activeState.isActive = true;
                                activeState.isInactive = false;
                                notify('active', null);
                            }

                            if ((Date.now() - lastUpdateTime) > timeUpdateInterval) {
                                lastUpdateTime = Date.now();
                                timeUpdate = true;
                            }

                            if (false === animating && false === timeUpdate) {
                                return;
                            }

                            if (lastUpdate !== currentUpdate) {
                                updateTimes = 0;
                                updated = true;
                            } else if (updateTimes < maxIterations) {
                                updateTimes += 1;
                                updated = true;
                            }
                            if (updated) {
                                lastUpdate = currentUpdate;
                                doScrollUpdate(x, y, height, width, initialState, updateTime, activeState, timeUpdate);
                                updateInterval = window.Math.max(0, updateInterval - 100);
                            } else {
                                updateInterval = window.Math.min(maxInterval, updateInterval + 200);
                            }
                        };

                    if (utils.isEmpty(clone)) {
                        clone = {};
                    }

                    if (null !== matches && undefined !== matches[1]) {
                        if (is.isSearch(clone)) {
                            clone.offsets.search = (parseInt(matches[1], 10) - 1) * clone.limits.search;
                            if (isNaN(clone.offsets.search) || 0 > clone.offsets.search) {
                                clone.offsets.search = 0;
                                clone.paginates.search = true;
                            }
                        } else {
                            clone.offsets.stream = (parseInt(matches[1], 10) - 1) * clone.limits.stream;
                            if (isNaN(clone.offsets.stream) || 0 > clone.offsets.stream) {
                                clone.offsets.stream = 0;
                                clone.paginates.stream = true;
                            }
                        }
                    }

                    clone.isReady = true;

                    if (utils.exists(clone.user)) {
                        window.decom_user_id = clone.user.ID;
                    }
                    if (utils.exists(clone.data) && utils.exists(clone.data.ID)) {
                        window.decom_post_id = clone.data.ID;
                        window.decom_post_url = clone.data.ID;
                        window.decom_comments_last_page = clone.data.post_comments_lastpage;
                    }
                    window.decom_comment_single_translate = 'comment';
                    window.decom_comment_twice_translate = 'comments';
                    window.decom_comment_plural_translate = 'comments';
                    window.decom_plugin_url = '/wp-content/plugins/decomments/comments/assets';

                    if (utils.isFunction(clone.staticBootstrap)) {
                        staticBootstrap = clone.staticBootstrap;
                        delete clone.staticBootstrap;
                    }

                    clone.isLoading = false;
                    clone.loaded = Date.now();


                    dispatch(clone, null, true);
                    animationLoop(null, clone);

                    try {
                        if ((utils.exists(clone.user) && utils.exists(clone.user.ID) && 0 !== clone.user.ID && false === is.isRestricted(clone))) {
                            storage.user.config(clone.user, clone.site.publisher_id, utils.exists(clone.offsets) ? clone.offsets.stream : 0, utils.exists(clone.limits) ? clone.limits.stream : 12, fiddle);
                        }
                    } catch(e) {
                        //bugsnag(e);
                    }
                    if ('missing' === clone.type) {
                        clone.searchQuery = window.location.pathname.replace(/\//g, ' ').replace(/^\s{1,}/,'').replace(/\s{1,}$/,'').replace('-', ' ');
                    }

                    setupComments(clone);

                    if (utils.exists(clone.user) && utils.exists(clone.user.data) && utils.exists(clone.user.ID) && 0 !== clone.user.ID && utils.exists(storage.firebase)) {
                        try {
                            storage.firebase.authWithCustomToken(clone.user.data.firebase_token, function(error, result) {
                                storage.firebase.onAuth(handleAuth);
                            });
                        } catch (e) {
                            bugsnag.error(e);
                        }

                    }
                },
                forEachHandler = function (ourApi) {
                    var incoming = function (incomingApi) {
                        if (utils.exists(incomingApi)) {
                            incomingApi.then(null, null, propagateState);
                        }
                        loaded += 1;
                        if (modules && loaded === modules.length) {
                            ready();
                        }
                    }, readyHandler = (function (a) {
                        return function (comp) {
                            if (comp) {
                                components.push(createFactory(comp));
                            }

                            /* Outgoing (the function we call) is from the module's perspective
                             * Incoming is from our (the app's) perspective
                             * We give them a promise to which we subscribe
                             * They call notify whenever they have something for us
                             * Note: a resolve() would kill the updates
                             * Notifies modules of changes in props in case they are not React elements
                             */
                            if ('function' === typeof a.outgoing) {
                                a.outgoing(incoming);
                            } else {
                                loaded += 1;
                                if (loaded === modules.length) {
                                    ready();
                                }
                            }
                        };
                    }(ourApi));
                    if (utils.exists(ourApi) && 'function' === typeof ourApi.ready) {
                        ourApi.ready(readyHandler);
                    } else {
                        loaded += 1;
                        if (loaded === modules.length) {
                            ready();
                        }
                    }
                },
                component = React.createClass({
                    displayName: 'App',
                    componentWillMount: function () {
                        propagateState = _.bind(propagateState, this);
                        dispatch(propagateState, null, true);
                        doScrollUpdate = _.bind(doScrollUpdate, this);
                    },
                    componentDidMount: function () {
                        if (document.hasOwnProperty('addEventListener')) {
                            document.addEventListener('DOMContentLoaded', function () {
                                FastClick.attach(document.body);
                            }, false);
                        }
                        if (utils.isFunction(staticBootstrap)) {
                            staticBootstrap(function() {
                                fiddle({
                                    staticUpdated: Date.now()
                                })
                            });
                        }
                    },
                    render: function () {
                        var props = this.props,
                            args = components.slice(0).map(function (el) {
                                return el(props);
                            });
                        args.unshift({
                            className: 'app-container' + (is.isRestricted(this.props) ? ' restricted' : '') +  ((this.props.isNative && true !== this.props.ipad) ? ' native' : ''),
                            ref: 'app'
                        });
                        return React.DOM.div.apply(React.DOM, args);
                    }
                });

            factory = createFactory(component);

            window.requestAnimFrame = (function () {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    function (callback) {
                        window.setTimeout(callback, 1000 / 60);
                    };
            }());

            if ('complete' === document.readyState) {
                Array.prototype.forEach.call(modules, forEachHandler);
            } else {
                window.addEventListener('load', function () {
                    Array.prototype.forEach.call(modules, forEachHandler);
                });
            }

            deferred.promise.then(null, function (e) {
                err.log('Something is awry.', 'ModuleError', e);
            }, err.notify);


        });

        return module.promise;
    }
);

