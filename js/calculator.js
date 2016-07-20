// OO Calculator
// http://jsfiddle.net/doug65536/peC3r/

(function () {
    "use strict";
    var $ = function (item) {
        return typeof item === 'string' ? document.getElementById(item) : item;
    };
    var hookEvent = window.addEventListener ? function (target, name, handler) {
            $(target).addEventListener(name, handler);
        } : function (target, name, handler) {
            $(target).attachEvent('on' + name, handler);
        };

    var bind = function (target, callback) {
        var self = target;
        return function (event) {
            return callback.call(self, event);
        };
    };

    var Calc = function (container, buttons, output) {
        this.result = 0;
        this.operand = '';
        this.operation = '';
        this.memory = 0;

        this.buttons = $(buttons);
        this.output = $(output);
        this.container = container;

        hookEvent(this.buttons, 'click', bind(this, this.on_button_pressed));
        hookEvent(window, 'keypress', bind(this, this.on_key_pressed));
    };
    Calc.prototype = {
        constructor: Calc,
        apply_and_set_operation: function (next_op) {
            if (next_op === 'C') {
                this.result = 0;
                this.operand = '';
                this.operation = '';
                return;
            }
            if (this.operand !== '') {
                switch (this.operation) {
                    case '':
                        this.result = +this.operand;
                        break;
                    case '+':
                        this.result += +this.operand;
                        break;
                    case '-':
                        this.result -= +this.operand;
                        break;
                    case '*':
                        this.result *= +this.operand;
                        break;
                    case '/':
                        this.result /= +this.operand;
                        break;
                }
            }
            this.operation = next_op !== '=' ? next_op : '';
            this.operand = '';
        },
        add_input: function (character) {
            if (this.trancendental[character] !== undefined) {
                this.result = this.trancendental[character](+this.get_operand());
                this.operand = '';
            } else if (character === '.') {
                this.operand += this.operand === '' ? '0.' : '.';
            } else if (character >= '0' && character <= '9') {
                this.operand += character;
            } else {
                this.apply_and_set_operation(character);
            }
        },
        get_operand: function () {
            return this.operand === '' ? this.result : this.operand;
        },
        trancendental: {
            ln: Math.log,
            sin: Math.sin,
            cos: Math.cos,
            tan: Math.tan
        },
        on_input: function (character) {
            this.add_input(character);
            this.output.value = this.get_operand();
        },
        on_button_pressed: function (ev) {
            if (ev !== null && ev.target !== undefined && ev.target.value !== undefined) {
                this.on_input(ev.target.value);
            }
        },
        key_translation: {
            '\r': '=',
            '\n': '=',
            'S': 'sin',
            'O': 'cos',
            'T': 'tan',
            'L': 'ln'
        },
        on_key_pressed: function (ev) {
            var ch = String.fromCharCode(ev.charCode).toUpperCase();
            if ("0123456789.+-*/=C".indexOf(ch) >= 0) {
                this.on_input(ch);
                return;
            }
            var translation = this.key_translation[ch];
            if (translation !== undefined) {
                this.on_input(translation);
            }
        }
    };

    var calculator;

      calculator = new Calc($('calculator'), $('buttontable'), $('output'));

}());

    function setupCalc() {
      calculator = new Calc($('calculator'), $('buttontable'), $('output'));
    }