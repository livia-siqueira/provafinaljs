(function (win, doc) {
    'use-scrict';

    function DOM(textString) {
        if (!(this instanceof DOM)) {
            return new DOM(textString);
          }
          this.element = doc.querySelectorAll(textString);
    }

    DOM.prototype.on = function on(typeEvent, funCallback) {
        Array.prototype.forEach.call(this.element, function (element) {
            element.addEventListener(typeEvent, funCallback, false);
        })
    }

    DOM.prototype.off = function off(typeEvent, funCallback) {
        Array.prototype.forEach.call(this.element, function (element) {
            element.removeEventListener(typeEvent, funCallback, false);
        })
    }

    DOM.prototype.get = function get(index) {
        if (!index)
            return this.element[0];
        return this.element[index];

    }

    DOM.prototype.forEach = function forEach() {
        return Array.prototype.forEach.apply(this.element, arguments)
    };

    DOM.prototype.map = function map() {
        return Array.prototype.map.apply(this.element, arguments);
    }

    DOM.prototype.filter = function filter() {
        return Array.prototype.filter.apply(this.element, arguments);
    }

    DOM.prototype.reduce = function reduce() {
        return Array.prototype.reduce.apply(this.element, arguments);
    }
    DOM.prototype.reduceRigth = function reduceRigth() {
        return Array.prototype.reduceRight.apply(this.element, arguments);
    }

    DOM.prototype.every = function every() {
        return Array.prototype.every.apply(this.element, arguments);
    }

    DOM.prototype.some = function some() {
        return Array.prototype.some.apply(this.element, arguments);
    }

    DOM.isArray = function isArray(test) {
        return testType(test, "[object Array]");
    }

    DOM.isFunction = function isFunction(test) {
        return testType(test, "[object Function]");
    }

    DOM.isObject = function isArray(test) {
        return testType(test, "[object Object]");
    }

    DOM.isNumber = function isArray(test) {
        return testType(test, "[object Number]");
    }
    DOM.isString = function isString(test) {
        return testType(test, "[object String]");
    }

    DOM.isBoolean = function isBoolean(test) {
        return testType(test, "[object Boolean]");
    }

    DOM.isNull = function (test) {
        return testType(test, "[object Null]") || testType(test, "[object Undefined]");
    }

    function testType(test, type) {
        return Object.prototype.toString.call(test) === type;
    }

    win.DOM = DOM;

})(window, document);
