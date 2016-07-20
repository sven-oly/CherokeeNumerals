// ------------------------ TESTS ----------------------
var chrTestSets = [	
  [[0], 0],
  [[2], 2],
  [[20,2], 22],
  [[4, 100, 8], 408],
  [[30, 1000, 7, 100, 50, 6], 30756],
  [[3, 100, 7], 307],
  [[100, 70, 9, 1000], 179000],
  [[6, 1000, 6, 100, 60, 6], 6666],
  [[50, 8, 1000, 40], 58040],
  [[100, 2, 1e6, 3, 1000, 4, 100, 50, 6], 102003456],
  [[17, 1e12, 8, 1000, 1], 17000000008001],
  [[1e9, 20, 1e6, 30, 4, 1000, 5, 100, 60, 7], 1020034567],
  [[7, 1000000000000, 20, 1, 1000000000, 30, 2, 1000000, 30, 9, 1000, 5, 100, 60, 7],
    7021032039567],
  [[9, 1e12, 9, 100, 80, 7, 1e3, 30], 9000000987030], 
  [[20, 3, 1000, 4], 23004]
  ];
  
// Tests num lists to integers.
function testChrToDec() {
  var failCount = 0;
  var passCount = 0;

  var failList = [];
  for (var i = 0; i < chrTestSets.length; i ++) {
    var test = chrTestSets[i];
    var t0 = chrTestSets[i][0];
    var t1 = chrTestSets[i][1];
    var result = numListToInteger(t0);
    if (compareLists(result, t1)) {
      passCount += 1;
      resultStatus = 'PASS';
    } else {
      failCount += 1;
      resultStatus ='FAIL';
      failList.push([resultStatus, test, result]);
    }
  }
  return ('Test CHR to Dec: ' + passCount + ' pass, ' +
          failCount + ' fail' + failList);
}

function compareLists(l1, l2) {
  if (l1.length != l2.length) {
    return false;
  }
  var i;
  for (i = 0; i < l1.length; i++) {
    if (l1[i] != l2[i]) {
      return false;
    }
  }
  return true;
}

// Tests integers to num lists.
function testDecToChr() {
  var failCount = 0;
  var passCount = 0;
  var result;
  var resultStatus;
  var failList = [];
  
  for (var i = 0; i < chrTestSets.length; i ++) {
    var test = chrTestSets[i];
    var t0 = chrTestSets[i][0];
    var t1 = chrTestSets[i][1];
    var testResult = digitalToSequoah(t1);
    var result = testResult[0];
    if (compareLists(result, t0)) {
      passCount += 1;
      resultStatus = 'PASS';
    } else {
      failCount += 1;
      resultStatus ='FAIL';
      failList.push([resultStatus, test, result]);
    }
  }
  return ('Test decimal to CHR: ' + passCount + ' pass, ' +
          failCount + ' fail' + failList);
}