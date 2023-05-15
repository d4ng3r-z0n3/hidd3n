document.addEventListener('DOMContentLoaded', function() {
  var encodeButton = document.getElementById('encode-button');
  encodeButton.addEventListener('click', function() {
    var publicMessage = document.getElementById('public-message').value;
    var privateMessage = document.getElementById('private-message').value;
    
    var encodedMessage = encodeMessage(publicMessage, privateMessage);
    
    document.getElementById('encoded-message').value = encodedMessage;
  });

  var decodeButton = document.getElementById('decode-button');
  decodeButton.addEventListener('click', function() {
    var encodedMessage = document.getElementById('encoded-message').value;

    var privateMessage = decodeMessage(encodedMessage);

    document.getElementById('private-message').value = privateMessage;
  });

  var copyButton = document.getElementById('copy-button');
  copyButton.addEventListener('click', function() {
    var encodedMessage = document.getElementById('encoded-message').value;

    navigator.clipboard.writeText(encodedMessage).then(function() {
      console.log('Copied to clipboard!');
    }, function() {
      console.error('Failed to copy to clipboard!');
    });
  });

  var pasteButton = document.getElementById('paste-button');
  pasteButton.addEventListener('click', function() {
    navigator.clipboard.readText().then(function(encodedMessage) {
      document.getElementById('encoded-message').value = encodedMessage;
    }, function() {
      console.error('Failed to read from clipboard!');
    });
  });

  var clearButton = document.getElementById('clear-button');
  clearButton.addEventListener('click', function() {
    document.getElementById('encoded-message').value = '';
  });
});

function encodeMessage(publicMessage, privateMessage) {
  var privateBin = '';
  for (var i = 0; i < privateMessage.length; i++) {
    var charCode = privateMessage.charCodeAt(i);
    var charBin = charCode.toString(2).padStart(8, '0');
    privateBin += charBin;
  }

  var privateHidden = privateBin.replace(/0/g, '\u200b').replace(/1/g, '\u200c');
  var privateFinal = '\u2063' + privateHidden + '\u2063';

  var publicChars = document.getElementById('public-message').value.split('');
  var half = Math.floor(publicChars.length / 2);
  publicChars.splice(half, 0, privateFinal);

  var applyLeet = document.getElementById('leet-checkbox').checked; // check the state of the checkbox
  var leetMap = { 'a': '4', 'e': '3', 'i': '!', 'o': '0', 's': '$' };
  publicChars = publicChars.map(function(char) {
    if (applyLeet) {
      return leetMap[char.toLowerCase()] || char;
    } else {
      return char;
    }
  });

  var publicFinal = publicChars.join('');

  return publicFinal;
}

function decodeMessage(publicMessage) {
  var startIndex = publicMessage.indexOf('\u2063');
  var endIndex = publicMessage.indexOf('\u2063', startIndex + 1);

  if (startIndex === -1 || endIndex === -1) {
    console.error('Invalid encoded message format!');
    return '';
  }

  var privateHidden = publicMessage.slice(startIndex + 1, endIndex);
  var privateBin = privateHidden.replace(/\u200b/g, '0').replace(/\u200c/g, '1');
  var privateChars = [];

  for (var i = 0; i < privateBin.length; i += 8) {
    var charBin = privateBin.slice(i, i + 8);
    var charCode = parseInt(charBin, 2);
    privateChars.push(String.fromCharCode(charCode));
  }

  var privateMessage = privateChars.join('');

  var publicChars = publicMessage.split('');
  publicChars.splice(startIndex, endIndex - startIndex + 1);

  var publicFinal = publicChars.join('');

  return privateMessage;
}
