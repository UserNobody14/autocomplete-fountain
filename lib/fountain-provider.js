'use babel';

import slick from 'atom-slick'

const trimStringRegex = /([ \t]*)(.+)/;

const saniTrimmer = /^[^<>]*/;

const sceneHead = /^(IN?T?|E[XS]?T?)\.?\/?(?!\1)(IN?T?|E[XS]?T?)?\.?[ ]*/i;

const seekSelector = function (selector, docItem) {
  return [].slice.call(docItem.querySelectorAll(selector) || []);}

const sanitizeHtmlInteriors = function (element) {
  var interiorH = element.innerHTML;
  return interiorH.match(saniTrimmer)[0];
}

const getSuggestionFromElement = function (element) {
  return {
    text: sanitizeHtmlInteriors(element),
    //prevents the 'trailing whitespace' html from interfering.
    description: 'CHARACTER',
    descriptionMoreURL: 'www.google.com',
    type: 'character',
    leftLabel: 'character',
    rightLabel: 'fountain-character'
  };
}
const intExtFn = function (rowPrefix) {
  var locNull, loc1, loc2;
  [locNull, loc1, loc2] = rowPrefix.match(sceneHead);
  if (locNull) {
    if (loc2) {
      if ((loc1.match(/I/i) && loc2.match(/EX?T?/i)) ||
           (loc1.match(/EX?T?/i) & loc2.match(/I/i))) {
             return 'interior/exterior';
           }
      else if ((loc1.match(/I/i) && loc2.match(/EST/i)) ||
           (loc1.match(/EST/i) && loc2.match(/I/i))) {
             return 'interior/est'
           }
        }
    else if (!loc2) {
      if (loc1.match(/I/i)) {
        return 'interior'
      }
      else if (loc1.match(/EX?T?/i)) {
        return 'exterior'
      }
      else if (loc1.match(/EST/i)) {
        return 'est'
      }
    }
    }
  return null;
}
const sceneSuggestionFromElement = function (prefix, rowPrefix) {
  var thisPrefix = intExtFn(rowPrefix);
  console.log('the beginning of line: ' + rowPrefix);
  console.log('the reg prefix: ' + prefix);
      //temporary
  return function (element) {
    return {
      text: sanitizeHtmlInteriors(element),
      replacementPrefix: rowPrefix,
      description: 'SCENE',
      descriptionMoreURL: 'www.google.com',
      type: 'scene',
      leftLabel: 'scene',
      rightLabel: intExtFn(rowPrefix)
    }
  };
}
//lineTextForBufferRow(bufferRow)
//getTextInBufferRange(range)
const fetchPrecedingRowText = function (editor, bp) {
    //TODO make it so this will work even in cases the Regex screws up.
    //like if the string untrimmed is null or only spaces or whatever.
    var untrimmed = editor.getTextInBufferRange([[bp.row, 0] , [bp.row, bp.column]]);
    var allTrimmed = untrimmed.match(trimStringRegex);
    if(!allTrimmed) {
      return null;
    }
    else {
      return allTrimmed[2];
    }
  }
//TODO: stop it from repeating itself all the time (remove duplicates)
//TODO: try and pipe in an alt provider for plaintext?
//TODO: get an array of providers available? One for each kind of text?
//TODO: give it scene and frequency biases? Might be alot of work.
//TODO: make it work async with a server hooked up to the subscriptions & the provider.

class FountainProvider {
  constructor() {
    this.scopeSelector = '.source.fountain';
    this.disableForScopeSelector =  '.source.fountain .comment,' +
                                    ' .source.fountain .spoken,' +
                                    ' .source.fountain .secHeading';
                                    //' .source.fountain .scene.heading';
    this.suggestionPriority = 2;
    this.filterSuggestions = true;
    this.excludeLowerPriority = true;
    this.suggestionCache = [];
  }
  getSuggestions({editor, bufferPosition, scopeDescriptor, prefix}) {
    var precedingRow = fetchPrecedingRowText(editor, bufferPosition);
    if (!prefix && !precedingRow) {
      return null;
    }
    else if (precedingRow.match(sceneHead) || prefix.match(sceneHead)) {
      var muhScenes = seekSelector(".syntax--scene.syntax--heading", editor.getElement())
      return muhScenes.map(sceneSuggestionFromElement(prefix, precedingRow));
    }
    else {
      var muhThing = seekSelector(".syntax--character", editor.getElement());
      return muhThing.map(getSuggestionFromElement);
    }
  }
}

export default new FountainProvider();
//   getRangeForSyntaxNodeContainingRange
//   bufferRangeForScopeAtPosition
//   getSyntaxNodeAtPosition
//   syntaxTreeScopeDescriptorForPosition
//   [].slice.call(document.querySelectorAll(selector) || []);
//
//   Notice: document.querySelector and document.querySelectorAll are quite SLOW,
//   try to use getElementById, document.getElementsByClassName or
//   document.getElementsByTagName if you want to get a performance bonus.
//
// // jQuery
// $el.parentsUntil(selector, filter);
//
// // Native
// function parentsUntil(el, selector, filter) {
//   const result = [];
//   const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
//
//   // match start from parent
//   el = el.parentElement;
//   while (el && !matchesSelector.call(el, selector)) {
//     if (!filter) {
//       result.push(el);
//     } else {
//       if (matchesSelector.call(el, filter)) {
//         result.push(el);
//       }
//     }
//     el = el.parentElement;
//   }
//   return result;
// }
//
//   isAtTagBoundary
//   idea: select the range of the current 'scene' then scan it 4 regex of character?
