import { Pipe } from "@angular/core";
export class OrderPipe {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LW9yZGVyLnBpcGUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3ZhZGltZGV6L0RvY3VtZW50cy9teV9kZXYvbmd4LW9yZGVyLXBpcGUvIiwic291cmNlcyI6WyJzcmMvYXBwL29yZGVyLXBpcGUvbmd4LW9yZGVyLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFNcEQsTUFBTSxPQUFPLFNBQVM7SUFDcEI7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBVTtRQUN4QixPQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLFlBQVksTUFBTSxDQUFDO0lBQzlELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFNLEVBQUUsQ0FBTTtRQUN2QyxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNsRCxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDM0I7UUFDRCxPQUFPLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBTSxFQUFFLENBQU07UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksRUFBRTtZQUMxQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2pCO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksRUFBRTtZQUMxQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2pCO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ1gsT0FBTyxDQUFDLENBQUM7U0FDVjtRQUNELElBQUks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T0FBTyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBVyxFQUFFLFVBQWUsRUFBRSxFQUFFO1lBQ25FLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FDbkIsTUFBTSxFQUNOLFVBQVUsRUFDVixPQUFPLEVBQ1AsaUJBQWlCLEVBQ2pCLFVBQVUsQ0FDWCxDQUFDO1FBQ0osQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ1osQ0FBQzs7O1lBalJGLElBQUksU0FBQztnQkFDSixJQUFJLEVBQUUsU0FBUztnQkFDZixJQUFJLEVBQUUsS0FBSzthQUNaIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5cbkBQaXBlKHtcbiAgbmFtZTogXCJvcmRlckJ5XCIsXG4gIHB1cmU6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBPcmRlclBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgdmFsdWUgaXMgYSBzdHJpbmdcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICBzdGF0aWMgaXNTdHJpbmcodmFsdWU6IGFueSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgfHwgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmc7XG4gIH1cblxuICAvKipcbiAgICogU29ydHMgdmFsdWVzIGlnbm9yaW5nIHRoZSBjYXNlXG4gICAqXG4gICAqIEBwYXJhbSBhXG4gICAqIEBwYXJhbSBiXG4gICAqL1xuICBzdGF0aWMgY2FzZUluc2Vuc2l0aXZlU29ydChhOiBhbnksIGI6IGFueSkge1xuICAgIGlmIChPcmRlclBpcGUuaXNTdHJpbmcoYSkgJiYgT3JkZXJQaXBlLmlzU3RyaW5nKGIpKSB7XG4gICAgICByZXR1cm4gYS5sb2NhbGVDb21wYXJlKGIpO1xuICAgIH1cbiAgICByZXR1cm4gT3JkZXJQaXBlLmRlZmF1bHRDb21wYXJlKGEsIGIpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgY29tcGFyZSBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIGFcbiAgICogQHBhcmFtIGJcbiAgICovXG4gIHN0YXRpYyBkZWZhdWx0Q29tcGFyZShhOiBhbnksIGI6IGFueSkge1xuICAgIGlmIChhICYmIGEgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICBhID0gYS5nZXRUaW1lKCk7XG4gICAgfVxuICAgIGlmIChiICYmIGIgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICBiID0gYi5nZXRUaW1lKCk7XG4gICAgfVxuXG4gICAgaWYgKGEgPT09IGIpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBpZiAoYSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgaWYgKGIgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICByZXR1cm4gYSA+IGIgPyAxIDogLTE7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgZXhwcmVzc2lvbiwgc3BsaXQgaW50byBpdGVtc1xuICAgKiBAcGFyYW0gZXhwcmVzc2lvblxuICAgKiBAcmV0dXJucyB7c3RyaW5nW119XG4gICAqL1xuICBzdGF0aWMgcGFyc2VFeHByZXNzaW9uKGV4cHJlc3Npb246IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICBleHByZXNzaW9uID0gZXhwcmVzc2lvbi5yZXBsYWNlKC9cXFsoXFx3KylcXF0vZywgXCIuJDFcIik7XG4gICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24ucmVwbGFjZSgvXlxcLi8sIFwiXCIpO1xuICAgIHJldHVybiBleHByZXNzaW9uLnNwbGl0KFwiLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdmFsdWUgYnkgZXhwcmVzc2lvblxuICAgKlxuICAgKiBAcGFyYW0gb2JqZWN0XG4gICAqIEBwYXJhbSBleHByZXNzaW9uXG4gICAqIEByZXR1cm5zIHthbnl9XG4gICAqL1xuICBzdGF0aWMgZ2V0VmFsdWUob2JqZWN0OiBhbnksIGV4cHJlc3Npb246IHN0cmluZ1tdKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIG4gPSBleHByZXNzaW9uLmxlbmd0aDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKCFvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgayA9IGV4cHJlc3Npb25baV07XG4gICAgICBpZiAoIShrIGluIG9iamVjdCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBvYmplY3Rba10gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBvYmplY3QgPSBvYmplY3Rba10oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9iamVjdCA9IG9iamVjdFtrXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB2YWx1ZSBieSBleHByZXNzaW9uXG4gICAqXG4gICAqIEBwYXJhbSBvYmplY3RcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqIEBwYXJhbSBleHByZXNzaW9uXG4gICAqL1xuICBzdGF0aWMgc2V0VmFsdWUob2JqZWN0OiBhbnksIHZhbHVlOiBhbnksIGV4cHJlc3Npb246IHN0cmluZ1tdKSB7XG4gICAgbGV0IGk7XG4gICAgZm9yIChpID0gMDsgaSA8IGV4cHJlc3Npb24ubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICBvYmplY3QgPSBvYmplY3RbZXhwcmVzc2lvbltpXV07XG4gICAgfVxuXG4gICAgb2JqZWN0W2V4cHJlc3Npb25baV1dID0gdmFsdWU7XG4gIH1cblxuICB0cmFuc2Zvcm0oXG4gICAgdmFsdWU6IGFueSB8IGFueVtdLFxuICAgIGV4cHJlc3Npb24/OiBhbnksXG4gICAgcmV2ZXJzZT86IGJvb2xlYW4sXG4gICAgaXNDYXNlSW5zZW5zaXRpdmU6IGJvb2xlYW4gPSBmYWxzZSxcbiAgICBjb21wYXJhdG9yPzogRnVuY3Rpb25cbiAgKTogYW55IHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZXhwcmVzc2lvbikpIHtcbiAgICAgIHJldHVybiB0aGlzLm11bHRpRXhwcmVzc2lvblRyYW5zZm9ybShcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGV4cHJlc3Npb24sXG4gICAgICAgIHJldmVyc2UsXG4gICAgICAgIGlzQ2FzZUluc2Vuc2l0aXZlLFxuICAgICAgICBjb21wYXJhdG9yXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuc29ydEFycmF5KFxuICAgICAgICB2YWx1ZS5zbGljZSgpLFxuICAgICAgICBleHByZXNzaW9uLFxuICAgICAgICByZXZlcnNlLFxuICAgICAgICBpc0Nhc2VJbnNlbnNpdGl2ZSxcbiAgICAgICAgY29tcGFyYXRvclxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1PYmplY3QoXG4gICAgICAgIE9iamVjdC5hc3NpZ24oe30sIHZhbHVlKSxcbiAgICAgICAgZXhwcmVzc2lvbixcbiAgICAgICAgcmV2ZXJzZSxcbiAgICAgICAgaXNDYXNlSW5zZW5zaXRpdmUsXG4gICAgICAgIGNvbXBhcmF0b3JcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNvcnQgYXJyYXlcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqIEBwYXJhbSBleHByZXNzaW9uXG4gICAqIEBwYXJhbSByZXZlcnNlXG4gICAqIEBwYXJhbSBpc0Nhc2VJbnNlbnNpdGl2ZVxuICAgKiBAcGFyYW0gY29tcGFyYXRvclxuICAgKiBAcmV0dXJucyB7YW55W119XG4gICAqL1xuICBwcml2YXRlIHNvcnRBcnJheShcbiAgICB2YWx1ZTogYW55W10sXG4gICAgZXhwcmVzc2lvbj86IGFueSxcbiAgICByZXZlcnNlPzogYm9vbGVhbixcbiAgICBpc0Nhc2VJbnNlbnNpdGl2ZT86IGJvb2xlYW4sXG4gICAgY29tcGFyYXRvcj86IEZ1bmN0aW9uXG4gICk6IGFueVtdIHtcbiAgICBjb25zdCBpc0RlZXBMaW5rID0gZXhwcmVzc2lvbiAmJiBleHByZXNzaW9uLmluZGV4T2YoXCIuXCIpICE9PSAtMTtcblxuICAgIGlmIChpc0RlZXBMaW5rKSB7XG4gICAgICBleHByZXNzaW9uID0gT3JkZXJQaXBlLnBhcnNlRXhwcmVzc2lvbihleHByZXNzaW9uKTtcbiAgICB9XG5cbiAgICBsZXQgY29tcGFyZUZuOiBGdW5jdGlvbjtcblxuICAgIGlmIChjb21wYXJhdG9yICYmIHR5cGVvZiBjb21wYXJhdG9yID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGNvbXBhcmVGbiA9IGNvbXBhcmF0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbXBhcmVGbiA9IGlzQ2FzZUluc2Vuc2l0aXZlXG4gICAgICAgID8gT3JkZXJQaXBlLmNhc2VJbnNlbnNpdGl2ZVNvcnRcbiAgICAgICAgOiBPcmRlclBpcGUuZGVmYXVsdENvbXBhcmU7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyYXk6IGFueVtdID0gdmFsdWUuc29ydCgoYTogYW55LCBiOiBhbnkpOiBudW1iZXIgPT4ge1xuICAgICAgaWYgKCFleHByZXNzaW9uKSB7XG4gICAgICAgIHJldHVybiBjb21wYXJlRm4oYSwgYik7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNEZWVwTGluaykge1xuICAgICAgICBpZiAoYSAmJiBiKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbXBhcmVGbihhW2V4cHJlc3Npb25dLCBiW2V4cHJlc3Npb25dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29tcGFyZUZuKGEsIGIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY29tcGFyZUZuKFxuICAgICAgICBPcmRlclBpcGUuZ2V0VmFsdWUoYSwgZXhwcmVzc2lvbiksXG4gICAgICAgIE9yZGVyUGlwZS5nZXRWYWx1ZShiLCBleHByZXNzaW9uKVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICByZXR1cm4gYXJyYXkucmV2ZXJzZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm0gT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKiBAcGFyYW0gZXhwcmVzc2lvblxuICAgKiBAcGFyYW0gcmV2ZXJzZVxuICAgKiBAcGFyYW0gaXNDYXNlSW5zZW5zaXRpdmVcbiAgICogQHBhcmFtIGNvbXBhcmF0b3JcbiAgICogQHJldHVybnMge2FueVtdfVxuICAgKi9cbiAgcHJpdmF0ZSB0cmFuc2Zvcm1PYmplY3QoXG4gICAgdmFsdWU6IGFueSB8IGFueVtdLFxuICAgIGV4cHJlc3Npb24/OiBhbnksXG4gICAgcmV2ZXJzZT86IGJvb2xlYW4sXG4gICAgaXNDYXNlSW5zZW5zaXRpdmU/OiBib29sZWFuLFxuICAgIGNvbXBhcmF0b3I/OiBGdW5jdGlvblxuICApOiBhbnkge1xuICAgIGNvbnN0IHBhcnNlZEV4cHJlc3Npb24gPSBPcmRlclBpcGUucGFyc2VFeHByZXNzaW9uKGV4cHJlc3Npb24pO1xuICAgIGxldCBsYXN0UHJlZGljYXRlID0gcGFyc2VkRXhwcmVzc2lvbi5wb3AoKTtcbiAgICBsZXQgb2xkVmFsdWUgPSBPcmRlclBpcGUuZ2V0VmFsdWUodmFsdWUsIHBhcnNlZEV4cHJlc3Npb24pO1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KG9sZFZhbHVlKSkge1xuICAgICAgcGFyc2VkRXhwcmVzc2lvbi5wdXNoKGxhc3RQcmVkaWNhdGUpO1xuICAgICAgbGFzdFByZWRpY2F0ZSA9IG51bGw7XG4gICAgICBvbGRWYWx1ZSA9IE9yZGVyUGlwZS5nZXRWYWx1ZSh2YWx1ZSwgcGFyc2VkRXhwcmVzc2lvbik7XG4gICAgfVxuXG4gICAgaWYgKCFvbGRWYWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIE9yZGVyUGlwZS5zZXRWYWx1ZShcbiAgICAgIHZhbHVlLFxuICAgICAgdGhpcy50cmFuc2Zvcm0ob2xkVmFsdWUsIGxhc3RQcmVkaWNhdGUsIHJldmVyc2UsIGlzQ2FzZUluc2Vuc2l0aXZlKSxcbiAgICAgIHBhcnNlZEV4cHJlc3Npb25cbiAgICApO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBtdWx0aXBsZSBleHByZXNzaW9uc1xuICAgKlxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICogQHBhcmFtIHthbnlbXX0gZXhwcmVzc2lvbnNcbiAgICogQHBhcmFtIHtib29sZWFufSByZXZlcnNlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNDYXNlSW5zZW5zaXRpdmVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGFyYXRvclxuICAgKiBAcmV0dXJucyB7YW55fVxuICAgKi9cbiAgcHJpdmF0ZSBtdWx0aUV4cHJlc3Npb25UcmFuc2Zvcm0oXG4gICAgdmFsdWU6IGFueSxcbiAgICBleHByZXNzaW9uczogYW55W10sXG4gICAgcmV2ZXJzZTogYm9vbGVhbixcbiAgICBpc0Nhc2VJbnNlbnNpdGl2ZTogYm9vbGVhbiA9IGZhbHNlLFxuICAgIGNvbXBhcmF0b3I/OiBGdW5jdGlvblxuICApOiBhbnkge1xuICAgIHJldHVybiBleHByZXNzaW9ucy5yZXZlcnNlKCkucmVkdWNlKChyZXN1bHQ6IGFueSwgZXhwcmVzc2lvbjogYW55KSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm0oXG4gICAgICAgIHJlc3VsdCxcbiAgICAgICAgZXhwcmVzc2lvbixcbiAgICAgICAgcmV2ZXJzZSxcbiAgICAgICAgaXNDYXNlSW5zZW5zaXRpdmUsXG4gICAgICAgIGNvbXBhcmF0b3JcbiAgICAgICk7XG4gICAgfSwgdmFsdWUpO1xuICB9XG59XG4iXX0=