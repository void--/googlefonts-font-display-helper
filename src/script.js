(function(window, document, localStorage) {
  'use strict';

  // %FONT_STYLESHEET% and %UNIQUE_ID% values are replaced by the snippet generator
  // when the snippet is generated
  var fontStylesheet = '%FONT_STYLESHEET%';
  // We need a unique ID for a localStorage key and a style tag attribute (see #18 for reasoning).
  // In this script, we reuse the same variable for both meanings
  // to reduce the script size after minification and gzip
  var uniqueStorageId = '__3perf_gFonts_%UNIQUE_ID%';

  function append(el) {
    (document.head || document.body).appendChild(el);
  }

  function insertFallback() {
    var link = document.createElement('link');
    link.href = fontStylesheet;
    link.rel = 'stylesheet';
    append(link);
  }

  function insertStylesheet(stylesheet) {
    if (!document.getElementById(uniqueStorageId)) {
      var style = document.createElement('style');
      style.id = uniqueStorageId;
      append(style);
    }

    document.getElementById(uniqueStorageId).innerHTML = stylesheet;
  }

  if (localStorage[uniqueStorageId]) {
    // We insert a cached stylesheet syncronously to avoid a FOUT if fonts are cached.
    // This matches the behavior of the original render-blocking `<link rel="stylesheet">` tag.
    // There’s a small chance that the cached stylesheet is outdated – to handle this,
    // we still perform a `fetch` and update the stylesheet asynchronously
    insertStylesheet(localStorage[uniqueStorageId]);
  }

  // Still initiate http request to avoid “Unused <link rel="preload">” warnings
  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === XMLHttpRequest.DONE) {
          if (xmlhttp.status === 200) {
              localStorage[uniqueStorageId] = xmlhttp.responseText;
              insertStylesheet(xmlhttp.responseText);
          }
          else {
              insertFallback();
          }
      }
  };

  xmlhttp.open("GET", fontStylesheet, true);
  xmlhttp.send();

})(window, document, localStorage);
