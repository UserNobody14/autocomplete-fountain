'use babel';

import FountainAutocompleteView from './fountain-autocomplete-view';
import { CompositeDisposable } from 'atom';
import fountainProvider from './fountain-provider'

export default {

  fountainAutocompleteView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.fountainAutocompleteView = new FountainAutocompleteView(state.fountainAutocompleteViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.fountainAutocompleteView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'fountain-autocomplete:toggle': () => this.toggle()
    }));
  },
  getProvider() {
    return fountainProvider;
},
  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.fountainAutocompleteView.destroy();
  },

  serialize() {
    return {
      fountainAutocompleteViewState: this.fountainAutocompleteView.serialize()
    };
  },

  toggle() {
    console.log('FountainAutocomplete was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
