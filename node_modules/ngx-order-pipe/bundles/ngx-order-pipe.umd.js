(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('ngx-order-pipe', ['exports', '@angular/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ngx-order-pipe'] = {}, global.ng.core));
}(this, (function (exports, core) { 'use strict';

    var OrderPipe = /** @class */ (function () {
        function OrderPipe() {
        }
        /**
         * Check if a value is a string
         *
         * @param value
         */
        OrderPipe.isString = function (value) {
            return typeof value === "string" || value instanceof String;
        };
        /**
         * Sorts values ignoring the case
         *
         * @param a
         * @param b
         */
        OrderPipe.caseInsensitiveSort = function (a, b) {
            if (OrderPipe.isString(a) && OrderPipe.isString(b)) {
                return a.localeCompare(b);
            }
            return OrderPipe.defaultCompare(a, b);
        };
        /**
         * Default compare method
         *
         * @param a
         * @param b
         */
        OrderPipe.defaultCompare = function (a, b) {
            if (a && a instanceof Date) {
                a = a.getTime();
            }
            if (b && b instanceof Date) {
                b = b.getTime();
            }
            if (a === b) {
                return 0;
            }
            if (a == null) {
                return 1;
            }
            if (b == null) {
                return -1;
            }
            return a > b ? 1 : -1;
        };
        /**
         * Parse expression, split into items
         * @param expression
         * @returns {string[]}
         */
        OrderPipe.parseExpression = function (expression) {
            expression = expression.replace(/\[(\w+)\]/g, ".$1");
            expression = expression.replace(/^\./, "");
            return expression.split(".");
        };
        /**
         * Get value by expression
         *
         * @param object
         * @param expression
         * @returns {any}
         */
        OrderPipe.getValue = function (object, expression) {
            for (var i = 0, n = expression.length; i < n; ++i) {
                if (!object) {
                    return;
                }
                var k = expression[i];
                if (!(k in object)) {
                    return;
                }
                if (typeof object[k] === "function") {
                    object = object[k]();
                }
                else {
                    object = object[k];
                }
            }
            return object;
        };
        /**
         * Set value by expression
         *
         * @param object
         * @param value
         * @param expression
         */
        OrderPipe.setValue = function (object, value, expression) {
            var i;
            for (i = 0; i < expression.length - 1; i++) {
                object = object[expression[i]];
            }
            object[expression[i]] = value;
        };
        OrderPipe.prototype.transform = function (value, expression, reverse, isCaseInsensitive, comparator) {
            if (isCaseInsensitive === void 0) { isCaseInsensitive = false; }
            if (!value) {
                return value;
            }
            if (Array.isArray(expression)) {
                return this.multiExpressionTransform(value, expression, reverse, isCaseInsensitive, comparator);
            }
            if (Array.isArray(value)) {
                return this.sortArray(value.slice(), expression, reverse, isCaseInsensitive, comparator);
            }
            if (typeof value === "object") {
                return this.transformObject(Object.assign({}, value), expression, reverse, isCaseInsensitive, comparator);
            }
            return value;
        };
        /**
         * Sort array
         *
         * @param value
         * @param expression
         * @param reverse
         * @param isCaseInsensitive
         * @param comparator
         * @returns {any[]}
         */
        OrderPipe.prototype.sortArray = function (value, expression, reverse, isCaseInsensitive, comparator) {
            var isDeepLink = expression && expression.indexOf(".") !== -1;
            if (isDeepLink) {
                expression = OrderPipe.parseExpression(expression);
            }
            var compareFn;
            if (comparator && typeof comparator === "function") {
                compareFn = comparator;
            }
            else {
                compareFn = isCaseInsensitive
                    ? OrderPipe.caseInsensitiveSort
                    : OrderPipe.defaultCompare;
            }
            var array = value.sort(function (a, b) {
                if (!expression) {
                    return compareFn(a, b);
                }
                if (!isDeepLink) {
                    if (a && b) {
                        return compareFn(a[expression], b[expression]);
                    }
                    return compareFn(a, b);
                }
                return compareFn(OrderPipe.getValue(a, expression), OrderPipe.getValue(b, expression));
            });
            if (reverse) {
                return array.reverse();
            }
            return array;
        };
        /**
         * Transform Object
         *
         * @param value
         * @param expression
         * @param reverse
         * @param isCaseInsensitive
         * @param comparator
         * @returns {any[]}
         */
        OrderPipe.prototype.transformObject = function (value, expression, reverse, isCaseInsensitive, comparator) {
            var parsedExpression = OrderPipe.parseExpression(expression);
            var lastPredicate = parsedExpression.pop();
            var oldValue = OrderPipe.getValue(value, parsedExpression);
            if (!Array.isArray(oldValue)) {
                parsedExpression.push(lastPredicate);
                lastPredicate = null;
                oldValue = OrderPipe.getValue(value, parsedExpression);
            }
            if (!oldValue) {
                return value;
            }
            OrderPipe.setValue(value, this.transform(oldValue, lastPredicate, reverse, isCaseInsensitive), parsedExpression);
            return value;
        };
        /**
         * Apply multiple expressions
         *
         * @param value
         * @param {any[]} expressions
         * @param {boolean} reverse
         * @param {boolean} isCaseInsensitive
         * @param {Function} comparator
         * @returns {any}
         */
        OrderPipe.prototype.multiExpressionTransform = function (value, expressions, reverse, isCaseInsensitive, comparator) {
            var _this = this;
            if (isCaseInsensitive === void 0) { isCaseInsensitive = false; }
            return expressions.reverse().reduce(function (result, expression) {
                return _this.transform(result, expression, reverse, isCaseInsensitive, comparator);
            }, value);
        };
        return OrderPipe;
    }());
    OrderPipe.decorators = [
        { type: core.Pipe, args: [{
                    name: "orderBy",
                    pure: false,
                },] }
    ];

    /**
     * Created by vadimdez on 20/01/2017.
     */
    var OrderModule = /** @class */ (function () {
        function OrderModule() {
        }
        return OrderModule;
    }());
    OrderModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [OrderPipe],
                    exports: [OrderPipe],
                    providers: [OrderPipe]
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.OrderModule = OrderModule;
    exports.OrderPipe = OrderPipe;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-order-pipe.umd.js.map
