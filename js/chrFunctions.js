  
  // Global Finite State Machine for the calculator.
  calcFSM = null;
  
  // All the numeral images.
  var imgArray = new Array();

  var accumIndex = 0;
  
  // Init image array.
  var imgArrayNames = ['1E18A', '1E15A', '1E12A','1E9A', '1E6A','1000', '100',
    '90', '80', '70', '60', '50', '40', '30',
    '20', '19', '18', '17', '16', '15', '14',
    '13', '12', '11', '10',
    '9', '8', '7', '6', '5', '4', '3',
    '2', '1', '0', 'minus']; 
   var imgValues = [1e18, 1e15, 1e12, 1e9, 1e6, 1000, 100,
     90, 80, 70, 60, 50, 40, 30,
     20, 19, 18, 17, 16, 15, 14,
     13, 12, 11, 10,
     9, 8, 7, 6, 5, 4, 3,
     2, 1, 0, -1];

function initImgArray() {   
  for (i = 0; i < imgArrayNames.length; i++) {
    imgArray[i] = new Image();
    imgArray[i].src = '/images/' + 'CHR_' + imgArrayNames[i] + '.png';
    imgArray[i].numVal = imgValues[i];
  }
}

  function valueToImgIndex(val) {
    var index = 0;
    for (index = 0; index < imgValues.length; index ++) {
      if (imgValues[index] == val) {
        return index;
      }
    }
  }

  // Calculator variables.
  // Put the new list into the output area && reset numList.
  function updateChrOutput(new_numlist, chr_output_area) {
    clearArea(chr_output_area);
    var images = chr_output_area.querySelectorAll(".accum");
    for (var k = 0; k < new_numlist.length; k++) {
      var index = valueToImgIndex(new_numlist[k]);
      images[k].src = imgArray[index].src;
    }
  }
  
  function clearArea(chr_output_area) {
	// Clear out the images.
    var images = chr_output_area.querySelectorAll(".accum");
    var size = images.length;
    for (var i = 0; i < size; i ++) {
      images[i].src = "/images/CHR_blank.png";
    }
    images[0].src = "/images/CHR_0.png";
  }

  function chrToDecimal(area1, area2) {
    // Get characters and send to backend for conversion to decimal.
	var input_area = document.getElementById(area1);
    var chrCodes = input_area.value;
    
	if (window.XMLHttpRequest)
	  {
	  // code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {
	  // code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }

    // Deal with the results	  
    xmlhttp.onreadystatechange=function()
	{
	  if(xmlhttp.readyState==4) {
	      var returned_json = xmlhttp.responseText
		  var output_area = document.getElementById(area2);
		  var json_obj = JSON.parse(returned_json);

		  var new_text = json_obj.formatted;
          output_area.innerHTML = new_text;
          output_area.value = new_text;  
     }
	}
	
	// Set up the call to the backend.
	var target = "/chrToDecimal/?chrCodes=" + chrCodes;
	xmlhttp.open("GET", target, true);
	xmlhttp.send(null);	    
  }
 
  // Show / hide controls for testing.    
  function toggleHide(obj, newState) {
    var el = document.getElementById(obj);
    if (newState == 'off') {
      el.style.display = 'none';
      return;
    }
    if (newState == 'on') {
      el.style.display = 'block';
      return;
	}
    // Otherwise, toggle.
    if (el.style.display == 'none') {
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  }
  