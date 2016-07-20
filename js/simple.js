var buttons;
var result;
var clear;

window.onload = function () {
      buttons = document.getElementsByTagName('span'); // Select all buttons
      result = document.querySelectorAll('.result p')[0]; // Select the result-field
      clear = document.getElementsByClassName('clear')[0]; // Select the clearAll-button
 
  for (var i = 0; i < buttons.length; i += 1) {
    // It will loop through all the buttons to add onclick-event
    // If the inside of that button is NOT '=' --> we will
    // add the onclick-function: addValue(i). 
    // If it is '=' --> add the onclick-function: calculate(i)
 
    if (buttons[i].innerHTML === '=') {
      buttons[i].addEventListener("click", calculate(i));
    } else {
      buttons[i].addEventListener("click", addValue(i));
    }
  }
  
  clear.onclick = function () {
    result.innerHTML = '';
  };
  
};

function addValue(i) {
    return function () {
      // We need to replace the '÷' and 'x' symbols,
      // because JS can't calculate with it. The if-statement replaces
      // those symbols with a correct symbol.
 
      if (buttons[i].innerHTML === '÷') {
         result.innerHTML  += '/';
      } else if (buttons[i].innerHTML === 'x') {
         result.innerHTML  += '*';
      } else {
         result.innerHTML  += buttons[i].innerHTML; 
      }
    };
}

function calculate(i) {
  return function () {
      result.innerHTML = eval(result.innerHTML);
  };
};

//clear.onclick = function () {
//  result.innerHTML = '';
//};