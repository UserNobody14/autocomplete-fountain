'use babel'

import slick from 'atom-slick'

const seekSelectorNew = function (selector, docItem) {
  return [].slice.call(docItem.querySelectorAll(selector) || []);}

export default class FountainAutocompleteView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('autocomplete-fountain');

    //var toSearch = editor.getElement();
    var muhThing = seekSelectorNew('.syntax--character', document);
    var altsuggestionsCache = muhThing.map(function (element) {
      console.log(element.innerHTML);
      return element.innerHTML;
    });
    var mString;

    // Create message element
    const message = document.createElement('div');
    message.textContent = mString;
    message.classList.add('message');
    this.element.appendChild(message);
  }
  safeReduceToString(altsuggestionsCache) {
    if (altsuggestionsCache.length > 1){
      return altsuggestionsCache.reduce(aConcatB)
    }
    else if (altsuggestionsCache.length == 1) {
      return altsuggestionsCache[0];
    }
    else {
      return 'empty';
    }
  }
  aConcatB (a, b) {
      return a.concat(b)
    }
  getSuggestionFromElement(element) {
  var htmlText = element.innerHTML;
  console.log(htmlText);
  // return {
  //   text: htmlText,
  //   description: 'CHARACTER',
  //   descriptionMoreURL: 'www.google.com',
  //   type: 'character',
  //   leftLabel: 'character',
  //   rightLabel: 'fountain-character'
  // }
  return htmlText;
}

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
