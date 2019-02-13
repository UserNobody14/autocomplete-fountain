'use babel';

import slick from 'atom-slick'

const seekSelector = function (selector, docItem) {
  return [].slice.call(docItem.querySelectorAll(selector) || []);}

class FountainProvider {
  constructor() {
    this.scopeSelector = '.source.fountain';
    this.disableForScopeSelector = '.source.fountain .comment';
    this.suggestionPriority = 2;
    this.filterSuggestions = true;
    this.excludeLowerPriority = true;
    this.suggestionCache = [];
  }
  getSuggestionFromElement(element) {
  var htmlText = element.innerHTML;
  return {
    text: htmlText,
    description: 'CHARACTER',
    descriptionMoreURL: 'www.google.com',
    type: 'character',
    leftLabel: 'character',
    rightLabel: 'fountain-character'
  }
}
  getSuggestions({editor, bufferPosition, scopeDescriptor, prefix}) {
    if (!prefix) {
      return null;
    }
    var muhThing = seekSelector(".syntax--character", editor.getElement());
    var newsuggestionsCache = muhThing.map(getSuggestionFromElement);
    console.log(this.suggestionCache);
    return newsuggestionsCache;
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
