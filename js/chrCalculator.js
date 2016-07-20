// OO Cherokee Calculator
// Based on http://jsfiddle.net/doug65536/peC3r/

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

    // The Calculator object.
    var Calc = function (container, buttons, output, chr_output, numeral_list, 
                 num_list_output, test_output) {
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
            this.numeralList = [];
			// updateChrOutput(this.numeralList, this.chr_output);
        },
        add_input: function (character) {
            if (this.trancendental[character] !== undefined) {
                this.result = this.trancendental[character](+this.get_operand());
                this.operand = '';
            } else if (character === '.') {
                this.operand += this.operand === '' ? '0.' : '.';
                this.numeralList.push(character);
            } else if (character == 'delete') {
                // Delete the last entry.
                this.numeralList.pop();
                // this.num_list_output.innerHTML = this.numeralList;
                var newVal = numListToInteger(this.numeralList);           
                this.operand = newVal;
                // this.output.value = this.get_operand();
                // var resultVals = digitalToSequoah(newVal);
                // updateChrOutput(resultVals[0], this.chr_output);
           } else if (character[0] >= '0' && character[0] <= '9') {
                // Put numeral on the list, and display it.
                this.numeralList.push(parseFloat(character));
                // this.num_list_output.innerHTML = this.numeralList;
				// Recompute digital operand from the Cherokee list value.
                var newVal = numListToInteger(this.numeralList);            
                this.operand = newVal;
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

            var resultVals = digitalToSequoah(this.get_operand());
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
            if (ch == "!") {
                test0();
            }
        }
    };

    var calculator;

    function test0() {
      // Tests that should pass
      calculator.on_input("C");  // Clear
      if (calculator.get_operand() == 0) {
        calculator.test_output.innerHTML = 'Clear passes'; 
      } else {
        calculator.test_output.innerHTML = 'Clear fails'; 
      }
    }
    

      calculator = new Calc($('chr_calculator'), $('chrButtontable'), $('outputChr'),
        $('chr_img_accumulator'), $('numeral_list'), $('numeral_list'), $('test_output'));
    
      // Set up output area.
      initImgArray();

}());

