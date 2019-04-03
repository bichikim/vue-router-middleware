(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var getFileName = function (path) {
        var match = path.match(/\/.*\.ts$/);
        if (!match || match.length < 1) {
            return path;
        }
        return match[0].split('/')[1].split('.')[0];
    };
    var createPack = function (name, middleware) {
        return {
            name: getFileName(name),
            middleware: middleware,
        };
    };
    var getter = function (resources) {
        var afterEachList = [];
        var beforeEachList = [];
        var beforeResolveList = [];
        var keys = resources.keys();
        var modules = keys.map(function (key) { return ({
            name: key,
            module: resources(key),
        }); });
        modules.forEach(function (_a) {
            var module = _a.module, name = _a.name;
            if (!module) {
                return;
            }
            var beforeEach = module.beforeEach, beforeResolve = module.beforeResolve, afterEach = module.afterEach;
            if (beforeEach) {
                beforeEachList.push(createPack(name, beforeEach));
            }
            if (beforeResolve) {
                beforeResolveList.push(createPack(name, beforeResolve));
            }
            if (afterEach) {
                afterEachList.push(createPack(name, afterEach));
            }
        });
        return {
            beforeEach: beforeEachList,
            beforeResolve: beforeResolveList,
            afterEach: afterEachList,
        };
    };
    var capsule = function (name, middleware, store, options) {
        if (options === void 0) { options = {}; }
        var _a = options.always, always = _a === void 0 ? [] : _a, _b = options.app, app = _b === void 0 ? {} : _b;
        return function (to, from, next) {
            var runMiddleware = function () {
                var ctx = { to: to, from: from, store: store, app: app };
                if (next) {
                    ctx.next = next;
                }
                return middleware(ctx);
            };
            var alwaysSome = function (requireName) { return (name === requireName); };
            var recordSome = function (record) {
                if (!record.meta || !record.meta.middleware) {
                    return false;
                }
                var middleware = record.meta.middleware;
                if (Array.isArray(middleware)) {
                    return middleware.some(function (mid) { return (mid === name); });
                }
                return middleware === name;
            };
            if (always.some(alwaysSome)) {
                return runMiddleware();
            }
            if (to.matched.some(recordSome)) {
                return runMiddleware();
            }
            // skip
            if (next) {
                next();
            }
        };
    };
    exports.default = (function (router, store, options) {
        if (options === void 0) { options = {}; }
        var middlewareList = getter(require.context(process.env.SRC_ALIAS + "/" + process.env.MIDDLEWARE_PATH + "/", false, /\.ts$/));
        middlewareList.beforeEach.forEach(function (_a) {
            var name = _a.name, middleware = _a.middleware;
            router.beforeEach(capsule(name, middleware, store, options));
        });
        middlewareList.beforeResolve.forEach(function (_a) {
            var name = _a.name, middleware = _a.middleware;
            router.beforeResolve(capsule(name, middleware, store, options));
        });
        middlewareList.afterEach.forEach(function (_a) {
            var name = _a.name, middleware = _a.middleware;
            router.afterEach(capsule(name, middleware, store, options));
        });
    });
});
//# sourceMappingURL=index.js.map