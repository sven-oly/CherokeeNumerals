// Calculator variables.

// TODO: more to class?? Connect to output area?

// Put the new list into the output area && reset numList.
function updateChrOutput(numList, chr_output_area) {
    clearArea(chr_output_area);

    let outputText = [];
    for (var k = 0; k < numList.length; k++) {
	const digitVal = numList[k];
	const nextChar = valueToChar[digitVal];
	outputText.push(nextChar);
    }
    // Fill in the text area.
    chr_output_area.innerHTML = outputText.join('');
}
