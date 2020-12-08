import { Pipe, NgModule } from '@angular/core';

class OrderPipe {
    /**
     * Check if a value is a string
     *
     * @param value
     */
    static isString(value) {
        return typeof value === "string" || value instanceof String;
    }
    /**
     * Sorts values ignoring the case
     *
     * @param a
     * @param b
     */
    static caseInsensitiveSort(a, b) {
        if (OrderPipe.isString(a) && OrderPipe.isString(b)) {
            return a.localeCompare(b);
        }
        return OrderPipe.defaultCompare(a, b);
    }
    /**
     * Default compare method
     *
     * @param a
     * @param b
     */
    static defaultCompare(a, b) {
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
    }
    /**
     * Parse expression, split into items
     * @param expression
     * @returns {string[]}
     */
    static parseExpression(expression) {
        expression = expression.replace(/\[(\w+)\]/g, ".$1");
        expression = expression.replace(/^\./, "");
        return expression.split(".");
    }
    /**
     * Get value by expression
     *
     * @param object
     * @param expression
     * @returns {any}
     */
    static getValue(object, expression) {
        for (let i = 0, n = expression.length; i < n; ++i) {
            if (!object) {
                return;
            }
            const k = expression[i];
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
    }
    /**
     * Set value by expression
     *
     * @param object
     * @param value
     * @param expression
     */
    static setValue(object, value, expression) {
        let i;
        for (i = 0; i < expression.length - 1; i++) {
            object = object[expression[i]];
        }
        object[expression[i]] = value;
    }
    transform(value, expression, reverse, isCaseInsensitive = false, comparator) {
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
    }
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
    sortArray(value, expression, reverse, isCaseInsensitive, comparator) {
        const isDeepLink = expression && expression.indexOf(".") !== -1;
        if (isDeepLink) {
            expression = OrderPipe.parseExpression(expression);
        }
        let compareFn;
        if (comparator && typeof comparator === "function") {
            compareFn = comparator;
        }
        else {
            compareFn = isCaseInsensitive
                ? OrderPipe.caseInsensitiveSort
                : OrderPipe.defaultCompare;
        }
        const array = value.sort((a, b) => {
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
    }
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
    transformObject(value, expression, reverse, isCaseInsensitive, comparator) {
        const parsedExpression = OrderPipe.parseExpression(expression);
        let lastPredicate = parsedExpression.pop();
        let oldValue = OrderPipe.getValue(value, parsedExpression);
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
    }
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
    multiExpressionTransform(value, expressions, reverse, isCaseInsensitive = false, comparator) {
        return expressions.reverse().reduce((result, expression) => {
            return this.transform(result, expression, reverse, isCaseInsensitive, comparator);
        }, value);
    }
}
OrderPipe.decorators = [
    { type: Pipe, args: [{
                name: "orderBy",
                pure: false,
            },] }
];

/**
 * Created by vadimdez on 20/01/2017.
 */
class OrderModule {
}
OrderModule.decorators = [
    { type: NgModule, args: [{
                declarations: [OrderPipe],
                exports: [OrderPipe],
                providers: [OrderPipe]
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { OrderModule, OrderPipe };
//# sourceMappingURL=ngx-order-pipe.js.map
