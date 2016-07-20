// Cherokee numerals computations.
// Same as the Python backend code.

  // Init image array.
  var imgArrayNames = ['1E18A', '1E15A', '1E12A','1E9A', '1E6A','1000', '100',
    '90', '80', '70', '60', '50', '40', '30',
    '20', '19', '18', '17', '16', '15', '14',
    '13', '12', '11', '10',
    '9', '8', '7', '6', '5', '4', '3',
    '2', '1', '0']; 

  var numeralValues = [1e18, 1e15, 1e12, 1e9, 1e6, 1000,
    100, 90, 80, 70, 60, 50, 40, 30, 20,
    19, 18, 17, 16, 15, 14, 13, 12, 11, 10,
    9, 8, 7, 6, 5, 4, 3, 2, 1, 0];


// Toggle the region id.
function showhide(id) {
  var e = document.getElementById(id);
  e.style.display = (e.style.display == 'block') ? 'none' : 'block';
}

function cleanUpListDeletions(l1, l2) {
  // Remove items where l1[i] == -1.
  var i = l1.length - 1;
  while (i >= 0) {
    if (l1[i] == -1) {
      l1.splice(i, 1);
      l2.splice(i, 1);
    }
    i -= 1;
  }
}
    
function numListToInteger(numList) {
  // a. scan for add small
  // b. scan for multiply by hundreds
  // c. scan for add to hundreds
  // d. multiply 10^N from left
  // e. add all 
  var working = numList.slice();
  var tags = numList.slice();

  //# a. scan for add small
  var start = 0;
  var limit = working.length;
  var sum = 0;
  while (start < limit) {
    end = start;
    while (end < limit && working[end] < 100) {
      sum += working[end];
      end += 1;
    }
    if (end > start) {
      working[start] = sum;
      for (i = start + 1; i < end; i ++) {
        tags[i] = -1;
      }
      sum = 0;
    }
    start += 1;
  }  
  cleanUpListDeletions(tags, working);
            
  // b. scan for multiply hundreds
  start = 1;
  limit = working.length;
  while (start < limit) {
    if (working[start - 1] < 100 && working[start] == 100) {
      working[start] = working[start - 1] * working[start];
      tags[start-1] = -1;
    }
    start += 1;
  }
  cleanUpListDeletions(tags, working);

  // c. scan for add to hundreds
  start = 1;
  limit = working.length;
  while (start < limit) {
    if (tags[start - 1] == 100 && tags[start] < 100) {
      working[start] = working[start - 1] + working[start];
      tags[start-1] = -1;
    }
    start += 1
  }
  cleanUpListDeletions(tags, working);

  // d. scan for multiply 10^N
  start = 0;
  limit = working.length;
  while (start < limit) {
    if (tags[start - 1] <= 100 && tags[start] > 100) {
      working[start] = working[start - 1] * working[start];
      tags[start-1] = -1;
    }
    start += 1;
  }
  cleanUpListDeletions(tags, working);

  // Add the results if needed
  var grandSum = 0;
  for (i = 0; i < working.length; i ++) {
    grandSum += working[i];
  }
  return grandSum;
}


// Process the input numeral, outputting a list of count and numerals.
function digitalToSequoah(decimalNum) {

  // Returns a list of (value) of the decoded number in Sequoyah's numerals
  var result = [];
  var resultImage = [];
  var remaining;

  if (decimalNum == 0) {
    result = [0];
    resultImage = ['0'];
    return (result, resultImage);
  }
  
  if (decimalNum < 0) {
    remaining = -decimalNum;
    result.push(-1);
    resultImage = ['-1'];
  } else {
    remaining = decimalNum;
  }
  
  var index = 0;
  var count = 0;
  while (remaining > 0 && index < numeralValues.length && count < 100) {
    if (remaining > 0 && remaining < 1) {
      resultImage.push('point');
      result.push(-10);
      break;  
    }
    if (remaining >= numeralValues[index]) {
      count = Math.floor(remaining / numeralValues[index]);
      remaining -= count * numeralValues[index];
    }
    if (count > 0) {
      if (count > 1) {
        // Recurse with the hundreds.
        var prefix = digitalToSequoah(count);
        for (var j = 0; j < prefix[0].length; j++) {   
          resultImage.push(prefix[1][i]);
          result.push(prefix[0][j]);
        }
      }
      resultImage.push(imgArrayNames[index]);
      result.push(numeralValues[index]);
    }
    count = 0;
    index += 1;
  }
  return [result, resultImage]  // Both the numbers and the strings.
}

