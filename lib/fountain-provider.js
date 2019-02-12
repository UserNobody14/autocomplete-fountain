'use babel';

import completions from '../data/completions';

class FountainProvider {
  constructor() {
    this.scopeSelector = '.source.fountain';
    this.disableForScopeSelector = '.source.fountain .comment';

    this.suggestionPriority = 2;
    this.filterSuggestions = true;
  }

  createSuggestion(type, label, suggestion) {
    return {
      text: suggestion.name,
      description: suggestion.description,
      descriptionMoreURL: suggestion.docUrl,
      type: type,
      leftLabel: label,
      rightLabel: suggestion.typeSig
    };
  }

  getSuggestions({prefix}) {
    if (!prefix) {
      return null;
    }

    const suggestions = [];

    for (const pkg of completions) {
      for (const module of pkg.modules) {
        suggestions.push(this.createSuggestion('import', pkg.name, module));

        const funcSugg = this.createSuggestion.bind(null, 'function', module.name);
        suggestions.push(...module.functions.map(funcSugg));

        for (const cls of module.typeClasses) {
          suggestions.push(this.createSuggestion('class', module.name, cls));
          suggestions.push(...cls.functions.map(funcSugg));
        }

        const constrSugg = this.createSuggestion.bind(null, 'tag', module.name);

        for (const tys of module.types) {
          suggestions.push(this.createSuggestion('type', module.name, tys));
          suggestions.push(...tys.constructors.map(constrSugg));
        }
      }
    }

    return suggestions;
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
