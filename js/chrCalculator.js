// OO Cherokee Calculator
// Based on http://jsfiddle.net/doug65536/peC3r/

let chrCalculator = null;

(function () {
    "use strict";
    // Get doc from the ID.
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

    // The Finite State Machine
    const StartState = Symbol(0);
    const AccumState = Symbol(1);
    const ComputeState = Symbol(2);
    const AccumState2 = Symbol(3);
    const ComputeState2 = Symbol(4);
    const AccumDecimal1 = Symbol(6);
    const ErrorState = Symbol(7);
    
    const noOP = Symbol(4);
    
    // The Calculator object.
    var Calc = function (container, buttons, output, chr_output, numeral_list,
                 num_list_output, test_output) {
	this.accum = 0;  // The accumulator
	this.state = StartState;
	this.pendingOp = 
        this.result = 0;
        this.operand = '';
        this.operation = '';
        this.memory = 0;
        // List of CHR numerals.
        this.numeralList = [];

        this.buttons = $(buttons);
        this.output = $(output);
        this.chr_output = $(chr_output);
        this.num_list_output = $(num_list_output);

        this.test_output = $(test_output);

        this.container = container;

        // Connections to characters and their values
        this.charToValueMap = null;
        this.valueToCodePoint = null;

        // Keeping track of the inputs log
        this.inputLog = [];
        hookEvent(this.buttons, 'click', bind(this, this.on_button_pressed));
        hookEvent(window, 'keypress', bind(this, this.on_key_pressed));
    };

    Calc.prototype = {
        constructor: Calc,
        apply_and_set_operation: function (next_op) {
            if (next_op === 'clear') {
                // CLEAR.
                this.result = 0;
                this.operand = '';
                this.operation = '';
                this.numeralList = [];
                this.num_list_output.innerHTML = this.numeralList;
                clearArea(this.chr_output);
                return;
            }
            if (this.operand !== '') {
                // Basic arithmetic operations
                switch (this.operation) {
                    case '':
                    // this.result = +this.operand;
                        break;
                    case '+':
                        this.result += +this.operand;
                        break;
                    case '-':
                        this.result -= this.operand;
                        break;
                    case '*':
                        this.result *= this.operand;
                        break;
                    case '/':
                        this.result /= this.operand;
                        break;
                }
            }
            this.operation = next_op !== '=' ? next_op : '';
            this.operand = '';
            // ?? this.numeralList = [];
            let resultVals = formatToSequoah(this.result);
            this.numeralList = resultVals;
            // ?? this.result += this.operand;
            updateChrOutput(resultVals, this.chr_output);
        },
        add_input: function (character) {
            if (this.trancendental[character] !== undefined) {
                this.result = this.trancendental[character](+this.get_operand());
                this.operand = '';
            } else if (character === '.') {
                this.operand += this.operand === '' ? '0.' : '.';
                this.numeralList.push(character);
            // } else if (character === '-') {
            // ignore unary minus
            //     // Negate current value. If already negative, remove sign.
            //     if (this.operand.length > 0 && this.operand[0] == '-') {
            //         // TODO: Remove minus
            //         this.operand = this.operand.slice(1);
            //         this.numeralList.shift();
            //     } else {
            //         // TODO: Prepend minus
            //         this.operand = character + this.operand;
            //         this.numeralList.unshift(character);
            //     }
            //     this.operand += this.operand === '' ? '-' : '';
            //     this.numeralList.push(character);
            } else if (character == 'delete') {
                // Delete the last entry.
                this.numeralList.pop();
                // this.num_list_output.innerHTML = this.numeralList;
                var newVal = numListToInteger(this.numeralList);
                this.operand = newVal;
                this.output.value = this.get_operand();
                var resultVals = FormatToSequoah(newVal);
                updateChrOutput(resultVals[0], this.chr_output);
            } else if (this.charToValueMap.has(character[0])) {
                // Numeral input: put numeral on the list, and display it.
                let value = this.charToValueMap.get(character);
                this.numeralList.push(value);
                if (this.operation === '') { 
                    // Add to current value
                    var newVal = numListToInteger(this.numeralList);
                    this.operand = newVal;
                } else {
                    // Start a new operand
                    this.operand = value;
                }
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
            this.num_list_output.innerHTML = this.numeralList;

            var resultVals = formatToSequoah(this.get_operand());
            updateChrOutput(resultVals[0], this.chr_output);
        },
        on_button_pressed: function (ev) {
            if (ev !== null && ev.target !== undefined && ev.target.value !== undefined) {
                this.on_input(ev.target.value);
            } else if (ev !== null && ev.target !== undefined && ev.target.alt !== undefined) {
                this.on_input(ev.target.alt);
            }
        },
        key_translation: {
            '\r': '=',
            '\n': '=',
            'S': 'sin',
            'O': 'cos',
            'T': 'tan',
            'L': 'ln',
            '1': '\uf601',
            '2': '\uf602',
            '3': '\uf603',
            '4': '\uf604',
            '5': '\uf605',
            '6': '\uf606',
            '7': '\uf607',
            '8': '\uf608',
            '0': '\uf609',
        },
        on_key_pressed: function (ev) {
            var ch = String.fromCharCode(ev.charCode).toUpperCase();
            if ("0.+-*/=C".indexOf(ch) >= 0) {
                this.on_input(ch);
                return;
            }
            var translation = this.key_translation[ch];
            if (translation !== undefined) {
                this.on_input(translation);
            }
            if (ch == "!") {
                test0();
            }
        }
    };

    // Set relationships between characters and values
    Calc.prototype.setCharToValue = function(x) {
        this.charToValueMap = x;
        // Get the mimimum and maximum numeral values
        let sortedChars = Array.from(x.keys()).sort();
    }
    Calc.prototype.setValueToCodePoint = function(x) {
        this.valueToCodePoint = x;
    }


    let calculator;

    function test0() {
      // Tests that should pass
      calculator.on_input("C");  // Clear
      if (calculator.get_operand() == 0) {
        calculator.test_output.innerHTML = 'Clear passes';
      } else {
        calculator.test_output.innerHTML = 'Clear fails';
      }
    }


    calculator = new Calc($('chr_calculator'), $('chrButtontableNew'), $('outputChr'),
                          $('accumulator_codes'), $('numeral_list'), $('numeral_list'), $('test_output'));

    chrCalculator = calculator;
}());

// Not used now.
function setupCalc() {
    calculator = new Calc($('calculator'), $('chrButtonTableNew'), $('output'));
}
