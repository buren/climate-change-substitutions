// Tribute to  justin.giancola and the s/keyboard/leopard chrome extension.
chrome.runtime.sendMessage("config", function(response) {
  "use strict";
  function sendEvent(replacements) {
    if (replacements.length === 0) {
      return;
    }

    chrome.storage.sync.get(null, function(result) {
      var analyticsUrl = result["analytics_url"];
      if (result["analytics"] !== "enabled" || !analyticsUrl) {
        return;
      }

      var i;
      var data = [];
      for (i = replacements.length - 1; i >= 0; i--) {
        data.push({
          url: window.location.href,
          original: replacements[i].original,
          replacement: replacements[i].replacement
        });
      }
      var request = new XMLHttpRequest();
      request.open("POST", analyticsUrl, true);
      request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
      request.send(JSON.stringify({ replacements: data }));
    });
  }

  // taken from http://stackoverflow.com/questions/17264639/replace-text-but-keep-case
  function matchCase(text, pattern) {
    var result = '';
    for (var i = 0; i < text.length; i++) {
      var c = text.charAt(i);
      var p = pattern.charCodeAt(i);
      if (p >= 65 && p < 65 + 26) {
        result += c.toUpperCase();
      } else {
        result += c.toLowerCase();
      }
    }
    return result;
  }
  var substitute = (function() {
    "use strict";
    var replacements, ignore, i, replacementsObject, original;
    replacements = response;
    replacementsObject = [];
    for (i = replacements.length - 1; i >= 0; i--) {
      original = new RegExp("\\b" + replacements[i][0] + "\\b", "gi");
      replacementsObject.push([original, replacements[i][1]]);
    }
    return function(node, replacedCallback) {
      var i, original, replacement;
      var ignore = {
        "STYLE": 0,
        "SCRIPT": 0,
        "NOSCRIPT": 0,
        "IFRAME": 0,
        "OBJECT": 0,
        "INPUT": 0,
        "FORM": 0,
        "TEXTAREA": 0
      };
      if (node.parentElement.tagName in ignore) {
        return;
      }
      for (i = replacementsObject.length - 1; i >= 0; i--) {
        original = replacementsObject[i][0];
        replacement = replacementsObject[i][1];
        node.nodeValue = node.nodeValue.replace(original, function(match) {
          replacedCallback(match, replacement);
          return matchCase(replacement, match);
        });
      }
    };
  })();

  var node, iter;
  var iter = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);
  var replacements = [];
  while ((node = iter.nextNode())) {
    substitute(node, function(original, replacement) {
      replacements.push({
        original: original,
        replacement: replacement
      });
    });
  }
  sendEvent(replacements);
});
