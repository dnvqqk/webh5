var ObjectUtils = /** @class */ (function () {
    function ObjectUtils() {
    }
    ObjectUtils.onGetInstanceName = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        try {
            var instance = Object.create(window[name].prototype);
            instance.constructor.apply(instance, args);
            return instance;
        }
        catch (error) {
            return null;
        }
    };
    ObjectUtils.onGetInstance = function (obj) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var instance = Object.create(obj["prototype"]);
        instance.constructor.apply(instance, args);
        return instance;
    };
    ObjectUtils.onCreateObject = function (obj, values) {
        var instance = ObjectUtils.onGetInstance(obj);
        for (var key in values) {
            try {
                if (instance["set" + key] != null) {
                    instance["set" + key](values[key]);
                }
            }
            catch (error) {
            }
        }
        return instance;
    };
    return ObjectUtils;
}());
//# sourceMappingURL=ObjectUtils.js.map